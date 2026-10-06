const NextResponse = Response;
import { seedDatabase } from "@/db/seed";

export async function POST() {
  try {
    const res = await seedDatabase(true);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error resetting database:", error);
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
}
