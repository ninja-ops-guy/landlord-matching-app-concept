import { pgTable, serial, text, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  avatar: text("avatar").notNull(),
  job: text("job").notNull(),
  company: text("company").notNull(),
  monthlyIncome: integer("monthly_income").notNull(),
  creditScore: integer("credit_score").notNull(),
  budget: integer("budget").notNull(),
  city: text("city").notNull(),
  bio: text("bio").notNull(),
  petInfo: text("pet_info").notNull(),
  petAvatar: text("pet_avatar"),
  moveInDate: text("move_in_date").notNull(),
  verifiedIncome: boolean("verified_income").default(true).notNull(),
  verifiedBackground: boolean("verified_background").default(true).notNull(),
  verifiedReferences: boolean("verified_references").default(true).notNull(),
  greenFlags: jsonb("green_flags").$type<string[]>().default([]).notNull(),
  redFlags: jsonb("red_flags").$type<string[]>().default([]).notNull(),
  rentalHistoryYears: integer("rental_history_years").default(3).notNull(),
  compatibilityScore: integer("compatibility_score").default(95).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const landlords = pgTable("landlords", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  avatar: text("avatar").notNull(),
  bio: text("bio").notNull(),
  responseTime: text("response_time").notNull(),
  style: text("style").notNull(),
  rating: text("rating").default("4.9").notNull(),
  reviewsCount: integer("reviews_count").default(12).notNull(),
  greenFlags: jsonb("green_flags").$type<string[]>().default([]).notNull(),
  redFlags: jsonb("red_flags").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  landlordId: integer("landlord_id").references(() => landlords.id),
  title: text("title").notNull(),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  rent: integer("rent").notNull(),
  deposit: integer("deposit").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: numeric("bathrooms").notNull(),
  sqft: integer("sqft").notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  description: text("description").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  petPolicy: text("pet_policy").notNull(),
  utilities: jsonb("utilities").$type<string[]>().default([]).notNull(),
  leaseTerm: text("lease_term").default("12 Months").notNull(),
  availableDate: text("available_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  swiperRole: text("swiper_role").notNull(), // 'landlord' | 'tenant'
  tenantId: integer("tenant_id"),
  listingId: integer("listing_id"),
  action: text("action").notNull(), // 'like' | 'pass' | 'superlike'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  listingId: integer("listing_id").notNull(),
  landlordId: integer("landlord_id").notNull(),
  status: text("status").default("matched").notNull(), // 'matched' | 'tour_scheduled' | 'lease_offered' | 'lease_signed'
  tourDate: text("tour_date"),
  tourTime: text("tour_time"),
  leaseMonthlyRent: integer("lease_monthly_rent"),
  leaseDeposit: integer("lease_deposit"),
  leaseStartDate: text("lease_start_date"),
  leaseSignedAt: timestamp("lease_signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  senderRole: text("sender_role").notNull(), // 'landlord' | 'tenant'
  senderName: text("sender_name").notNull(),
  text: text("text").notNull(),
  messageType: text("message_type").default("text").notNull(), // 'text' | 'tour_invite' | 'tour_accepted' | 'lease_offer' | 'lease_signed'
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
