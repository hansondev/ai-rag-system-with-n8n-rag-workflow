DROP TABLE "chunks" CASCADE;--> statement-breakpoint
DROP FUNCTION IF EXISTS "chunks_search_vector_update"();--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "filename" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "filename" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "mime_type" text NOT NULL DEFAULT 'application/octet-stream';--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "mime_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "size" integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "size" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "n8n_track_id" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "processed_at" timestamp;--> statement-breakpoint
