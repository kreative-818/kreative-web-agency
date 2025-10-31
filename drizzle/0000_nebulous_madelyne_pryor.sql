CREATE TABLE "ai_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitor_id" varchar(255) NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"intent" varchar(100),
	"lead_captured" boolean DEFAULT false,
	"lead_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "intent_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"business_name" varchar(255),
	"business_type" varchar(100),
	"current_website" text,
	"project_type" varchar(100) NOT NULL,
	"project_description" text NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb,
	"budget_range" varchar(50) NOT NULL,
	"timeline" varchar(50) NOT NULL,
	"landing_page" varchar(255),
	"time_to_complete" integer,
	"contacted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"business_name" varchar(255),
	"project_type" varchar(100),
	"budget" varchar(100),
	"timeline" varchar(100),
	"source" varchar(50) NOT NULL,
	"score" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'new',
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "onboarding_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_description" text NOT NULL,
	"target_audience" text NOT NULL,
	"brand_colors" text,
	"competitor_websites" text,
	"services_offered" text NOT NULL,
	"special_requests" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "outreach_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"lead_type" varchar(50) NOT NULL,
	"channel" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"message" text,
	"response" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"business_name" varchar(255),
	"business_type" varchar(100) NOT NULL,
	"base_price" integer NOT NULL,
	"upgrades_total" integer DEFAULT 0,
	"final_total" integer NOT NULL,
	"upgrades" jsonb DEFAULT '[]'::jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"paypal_email" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scraped_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"address" text,
	"phone" varchar(50),
	"website" text,
	"rating" varchar(10),
	"review_count" integer,
	"category" varchar(100),
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"place_id" varchar(255),
	"source" varchar(50) NOT NULL,
	"lead_score" integer,
	"contacted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "scraped_leads_place_id_unique" UNIQUE("place_id")
);
