CREATE TABLE "landlords" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"avatar" text NOT NULL,
	"bio" text NOT NULL,
	"response_time" text NOT NULL,
	"style" text NOT NULL,
	"rating" text DEFAULT '4.9' NOT NULL,
	"reviews_count" integer DEFAULT 12 NOT NULL,
	"green_flags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"red_flags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"landlord_id" integer,
	"title" text NOT NULL,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"rent" integer NOT NULL,
	"deposit" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" numeric NOT NULL,
	"sqft" integer NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text NOT NULL,
	"amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pet_policy" text NOT NULL,
	"utilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lease_term" text DEFAULT '12 Months' NOT NULL,
	"available_date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"listing_id" integer NOT NULL,
	"landlord_id" integer NOT NULL,
	"status" text DEFAULT 'matched' NOT NULL,
	"tour_date" text,
	"tour_time" text,
	"lease_monthly_rent" integer,
	"lease_deposit" integer,
	"lease_start_date" text,
	"lease_signed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"sender_role" text NOT NULL,
	"sender_name" text NOT NULL,
	"text" text NOT NULL,
	"message_type" text DEFAULT 'text' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "swipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"swiper_role" text NOT NULL,
	"tenant_id" integer,
	"listing_id" integer,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"avatar" text NOT NULL,
	"job" text NOT NULL,
	"company" text NOT NULL,
	"monthly_income" integer NOT NULL,
	"credit_score" integer NOT NULL,
	"budget" integer NOT NULL,
	"city" text NOT NULL,
	"bio" text NOT NULL,
	"pet_info" text NOT NULL,
	"pet_avatar" text,
	"move_in_date" text NOT NULL,
	"verified_income" boolean DEFAULT true NOT NULL,
	"verified_background" boolean DEFAULT true NOT NULL,
	"verified_references" boolean DEFAULT true NOT NULL,
	"green_flags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"red_flags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rental_history_years" integer DEFAULT 3 NOT NULL,
	"compatibility_score" integer DEFAULT 95 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_landlord_id_landlords_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."landlords"("id") ON DELETE no action ON UPDATE no action;