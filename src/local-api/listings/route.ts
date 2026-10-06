const NextResponse = Response;
import { db } from "@/db";
import { listings, landlords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        listing: listings,
        landlord: landlords,
      })
      .from(listings)
      .leftJoin(landlords, eq(listings.landlordId, landlords.id))
      .orderBy(desc(listings.id));

    const combined = data.map((item) => ({
      ...item.listing,
      landlord: item.landlord,
    }));

    return NextResponse.json(combined);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let landlordId = body.landlordId;
    // If no landlord specified or new landlord needed, link to landlord 1 or create
    if (!landlordId) {
      const existingLandlord = await db.select().from(landlords).limit(1);
      landlordId = existingLandlord[0]?.id || 1;
    }

    const [newListing] = await db
      .insert(listings)
      .values({
        landlordId,
        title: body.title || "Charming Modern Apartment",
        neighborhood: body.neighborhood || "Downtown",
        city: body.city || "New York",
        rent: Number(body.rent) || 2800,
        deposit: Number(body.deposit) || 2800,
        bedrooms: Number(body.bedrooms) ?? 1,
        bathrooms: String(body.bathrooms || "1.0"),
        sqft: Number(body.sqft) || 800,
        images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
          "https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          "https://images.pexels.com/photos/6920439/pexels-photo-6920439.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
        ],
        description: body.description || "Spacious, sun-filled home with modern amenities and high ceilings.",
        amenities: Array.isArray(body.amenities) ? body.amenities : [
          "In-unit Washer/Dryer",
          "Dishwasher",
          "High Ceilings",
          "Hardwood Floors"
        ],
        petPolicy: body.petPolicy || "Cats and small dogs welcome",
        utilities: Array.isArray(body.utilities) ? body.utilities : ["Water & Trash Included"],
        leaseTerm: body.leaseTerm || "12 Months",
        availableDate: body.availableDate || "Immediate",
      })
      .returning();

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
