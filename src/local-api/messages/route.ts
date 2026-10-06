const NextResponse = Response;
import { db } from "@/db";
import { messages, matches } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const matchIdParam = searchParams.get("matchId");

    if (!matchIdParam) {
      return NextResponse.json({ error: "matchId required" }, { status: 400 });
    }

    const matchId = Number(matchIdParam);
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json(msgs);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { matchId, senderRole, senderName, text, messageType, metadata } = body;

    if (!matchId || !text) {
      return NextResponse.json({ error: "Missing matchId or text" }, { status: 400 });
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        matchId: Number(matchId),
        senderRole: senderRole || "tenant",
        senderName: senderName || "User",
        text,
        messageType: messageType || "text",
        metadata: metadata || null,
      })
      .returning();

    // If message is a tour invite or lease offer, also optionally update match status
    if (messageType === "tour_invite" || messageType === "tour_accepted") {
      await db
        .update(matches)
        .set({
          status: "tour_scheduled",
          tourDate: metadata?.tourDate || "Upcoming",
          tourTime: metadata?.tourTime || "Flexible",
        })
        .where(eq(matches.id, Number(matchId)));
    } else if (messageType === "lease_offer") {
      await db
        .update(matches)
        .set({
          status: "lease_offered",
          leaseMonthlyRent: metadata?.rent ? Number(metadata.rent) : undefined,
          leaseDeposit: metadata?.deposit ? Number(metadata.deposit) : undefined,
          leaseStartDate: metadata?.leaseStartDate || undefined,
        })
        .where(eq(matches.id, Number(matchId)));
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
