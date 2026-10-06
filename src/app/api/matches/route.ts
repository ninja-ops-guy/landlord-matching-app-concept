import { NextResponse } from "next/server";
import { db } from "@/db";
import { matches, tenants, listings, landlords, messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const rawMatches = await db
      .select({
        match: matches,
        tenant: tenants,
        listing: listings,
        landlord: landlords,
      })
      .from(matches)
      .leftJoin(tenants, eq(matches.tenantId, tenants.id))
      .leftJoin(listings, eq(matches.listingId, listings.id))
      .leftJoin(landlords, eq(matches.landlordId, landlords.id))
      .orderBy(desc(matches.createdAt));

    // Also fetch the last message for each match
    const enriched = await Promise.all(
      rawMatches.map(async (row) => {
        const lastMsg = await db
          .select()
          .from(messages)
          .where(eq(messages.matchId, row.match.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        return {
          ...row.match,
          tenant: row.tenant,
          listing: row.listing,
          landlord: row.landlord,
          lastMessage: lastMsg[0] || null,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
