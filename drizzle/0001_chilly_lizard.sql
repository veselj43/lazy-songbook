ALTER TABLE "songs" ALTER COLUMN "user_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
CREATE INDEX "userId_idx" ON "songs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "author_idx" ON "songs" USING btree ("author");--> statement-breakpoint
CREATE INDEX "name_idx" ON "songs" USING btree ("name");