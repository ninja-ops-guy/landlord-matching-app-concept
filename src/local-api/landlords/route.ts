const NextResponse = Response;
import { db } from "@/db";
import { landlords } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allLandlords = await db.select().from(landlords).orderBy(asc(landlords.id));
    return NextResponse.json(allLandlords);
  } catch (error) {
    console.error("Error fetching landlords:", error);
    return NextResponse.json({ error: "Failed to fetch landlords" }, { status: 500 });
  }
}
