CREATE TABLE "ai_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"url" text NOT NULL,
	"source" text,
	"published_at" timestamp,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"meeting_id" integer NOT NULL,
	"name" text,
	"email" text,
	"note" text,
	"checked_in_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "meeting" ADD COLUMN "slides_url" text;--> statement-breakpoint
ALTER TABLE "meeting" ADD COLUMN "recording_url" text;--> statement-breakpoint
ALTER TABLE "meeting" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_meeting_id_meeting_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meeting"("id") ON DELETE cascade ON UPDATE no action;