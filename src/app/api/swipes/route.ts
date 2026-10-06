import { NextResponse } from "next/server";
import { db } from "@/db";
import { swipes, matches, messages, tenants, listings, landlords } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { swiperRole, tenantId, listingId, action } = body;

    if (!tenantId || !listingId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Record swipe
    await db.insert(swipes).values({
      swiperRole: swiperRole || "landlord",
      tenantId: Number(tenantId),
      listingId: Number(listingId),
      action: action, // 'like' | 'pass' | 'superlike'
    });

    if (action === "pass") {
      return NextResponse.json({ isMatch: false });
    }

    // Check if match already exists
    const existing = await db
      .select()
      .from(matches)
      .where(and(eq(matches.tenantId, Number(tenantId)), eq(matches.listingId, Number(listingId))))
      .limit(1);

    let matchRecord = existing[0];

    // Fetch listing details to know landlordId
    const [targetListing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(listingId)))
      .limit(1);

    const [targetTenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, Number(tenantId)))
      .limit(1);

    const [targetLandlord] = await db
      .select()
      .from(landlords)
      .where(eq(landlords.id, targetListing?.landlordId || 1))
      .limit(1);

    if (!matchRecord) {
      const isSuper = action === "superlike";
      const [newMatch] = await db
        .insert(matches)
        .values({
          tenantId: Number(tenantId),
          listingId: Number(listingId),
          landlordId: targetListing?.landlordId || 1,
          status: isSuper ? "tour_scheduled" : "matched",
          tourDate: isSuper ? "Upcoming Weekend" : null,
          tourTime: isSuper ? "12:00 PM" : null,
          leaseMonthlyRent: targetListing?.rent || 3000,
          leaseDeposit: targetListing?.deposit || 3000,
          leaseStartDate: "1st of next month",
        })
        .returning();

      matchRecord = newMatch;

      // Add cheerful opening message
      const introText =
        swiperRole === "landlord"
          ? `🎉 It's a match! Landlord ${targetLandlord?.name || "The Landlord"} loved your profile (Credit score ${targetTenant?.creditScore || "verified"}!) and is excited to connect about ${targetListing?.title || "the apartment"}.`
          : `✨ Great match! You showed interest in ${targetListing?.title || "this home"}. Landlord ${targetLandlord?.name || "The Landlord"} has received your verified credentials!`;

      await db.insert(messages).values({
        matchId: matchRecord.id,
        senderRole: swiperRole === "landlord" ? "landlord" : "tenant",
        senderName: swiperRole === "landlord" ? (targetLandlord?.name || "Landlord") : (targetTenant?.name || "Tenant"),
        text: introText,
        messageType: "text",
      });

      if (isSuper) {
        // Also add a fast-track tour invite
        await db.insert(messages).values({
          matchId: matchRecord.id,
          senderRole: "landlord",
          senderName: targetLandlord?.name || "Landlord",
          text: `⚡ SUPER-SWIPE FAST-TRACK: A private priority tour has been unlocked for ${targetListing?.title}. Select a time that works best for you!`,
          messageType: "tour_invite",
          metadata: {
            tourDate: "This Saturday / Sunday",
            tourTime: "Flexible 10am - 4pm",
            address: `${targetListing?.neighborhood || "Downtown"}, ${targetListing?.city || "New York"}`,
            note: "Super-swiped! Priority applicant queue."
          }
        });
      }
    }

    return NextResponse.json({
      isMatch: true,
      match: matchRecord,
      tenant: targetTenant,
      listing: targetListing,
      landlord: targetLandlord,
    });
  } catch (error) {
    console.error("Error processing swipe:", error);
    return NextResponse.json({ error: "Failed to process swipe", details: String(error) }, { status: 500 });
  }
}
