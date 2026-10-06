const NextResponse = Response;
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allTenants = await db.select().from(tenants).orderBy(desc(tenants.id));
    return NextResponse.json(allTenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newTenant] = await db
      .insert(tenants)
      .values({
        name: body.name || "Anonymous Tenant",
        age: Number(body.age) || 28,
        avatar: body.avatar || "https://images.pexels.com/photos/7752822/pexels-photo-7752822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        job: body.job || "Professional",
        company: body.company || "Self-Employed",
        monthlyIncome: Number(body.monthlyIncome) || 12000,
        creditScore: Number(body.creditScore) || 750,
        budget: Number(body.budget) || 3000,
        city: body.city || "New York",
        bio: body.bio || "Quiet, respectful tenant looking for a great home.",
        petInfo: body.petInfo || "No pets",
        petAvatar: body.petAvatar || null,
        moveInDate: body.moveInDate || "Immediate",
        verifiedIncome: Boolean(body.verifiedIncome ?? true),
        verifiedBackground: Boolean(body.verifiedBackground ?? true),
        verifiedReferences: Boolean(body.verifiedReferences ?? true),
        greenFlags: Array.isArray(body.greenFlags) ? body.greenFlags : [
          "Autopay enabled",
          "Takes shoes off at door",
          "Excellent prior landlord reference"
        ],
        redFlags: Array.isArray(body.redFlags) ? body.redFlags : [
          "Needs high-speed internet for work"
        ],
        rentalHistoryYears: Number(body.rentalHistoryYears) || 4,
        compatibilityScore: Number(body.compatibilityScore) || 94
      })
      .returning();

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 });
  }
}
