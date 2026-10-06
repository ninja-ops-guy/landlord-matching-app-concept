import { NextResponse } from "next/server";
import { db } from "@/db";
import { matches, messages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = Number(id);
    const body = await req.json();

    const updateData: Partial<typeof matches.$inferInsert> = {};

    if (body.status) updateData.status = body.status;
    if (body.tourDate !== undefined) updateData.tourDate = body.tourDate;
    if (body.tourTime !== undefined) updateData.tourTime = body.tourTime;
    if (body.leaseMonthlyRent !== undefined) updateData.leaseMonthlyRent = Number(body.leaseMonthlyRent);
    if (body.leaseDeposit !== undefined) updateData.leaseDeposit = Number(body.leaseDeposit);
    if (body.leaseStartDate !== undefined) updateData.leaseStartDate = body.leaseStartDate;
    if (body.signLease) {
      updateData.leaseSignedAt = new Date();
      updateData.status = "lease_signed";
    }

    const [updated] = await db
      .update(matches)
      .set(updateData)
      .where(eq(matches.id, matchId))
      .returning();

    // If signing lease, append an automated celebration message
    if (body.signLease) {
      await db.insert(messages).values({
        matchId,
        senderRole: body.signerRole || "tenant",
        senderName: body.signerName || "Tenant",
        text: `🍾 OFFICIAL LEASE SIGNED! Both Landlord and Tenant have countersigned electronically. Welcome to your new home! 🔑🏡`,
        messageType: "lease_signed",
        metadata: {
          signedAt: new Date().toISOString(),
          monthlyRent: updated.leaseMonthlyRent,
          deposit: updated.leaseDeposit,
          startDate: updated.leaseStartDate,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json({ error: "Failed to update match" }, { status: 500 });
  }
}
