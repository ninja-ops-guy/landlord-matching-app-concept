import { db } from "./index";
import { landlords, listings, tenants, matches, messages, swipes } from "./schema";
import { initialLandlords, initialListings, initialTenants, initialMatches, initialMessages } from "./seed-data";
import { count } from "drizzle-orm";

export async function seedDatabase(force = false) {
  const [existingTenants] = await db.select({ val: count() }).from(tenants);
  if (!force && existingTenants && Number(existingTenants.val) > 0) {
    return { success: true, message: "Database already seeded" };
  }

  // Clear existing
  if (force) {
    await db.delete(messages);
    await db.delete(matches);
    await db.delete(swipes);
    await db.delete(listings);
    await db.delete(landlords);
    await db.delete(tenants);
  }

  // Insert Landlords
  for (const l of initialLandlords) {
    await db.insert(landlords).values(l).onConflictDoNothing();
  }

  // Insert Listings
  for (const list of initialListings) {
    await db.insert(listings).values(list).onConflictDoNothing();
  }

  // Insert Tenants
  for (const t of initialTenants) {
    await db.insert(tenants).values(t).onConflictDoNothing();
  }

  // Insert Matches
  for (const m of initialMatches) {
    await db.insert(matches).values(m).onConflictDoNothing();
  }

  // Insert Messages
  for (const msg of initialMessages) {
    await db.insert(messages).values(msg).onConflictDoNothing();
  }

  return { success: true, message: "Database seeded successfully" };
}
