ALTER TABLE "library_memberships" ALTER COLUMN "viewer_user_id" SET DATA TYPE varchar(32);--> statement-breakpoint
CREATE INDEX "ownerUserId_idx" ON "library_shares" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "token_idx" ON "library_shares" USING btree ("token");