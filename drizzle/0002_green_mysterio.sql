PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_library_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text NOT NULL,
	`token` text NOT NULL,
	`current_song_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`current_song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_library_shares`("id", "owner_user_id", "token", "current_song_id", "created_at", "updated_at") SELECT "id", "owner_user_id", "token", NULL, "created_at", "updated_at" FROM `library_shares`;--> statement-breakpoint
DROP TABLE `library_shares`;--> statement-breakpoint
ALTER TABLE `__new_library_shares` RENAME TO `library_shares`;--> statement-breakpoint
CREATE UNIQUE INDEX `library_shares_owner_user_id_unique` ON `library_shares` (`owner_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `library_shares_token_unique` ON `library_shares` (`token`);--> statement-breakpoint
PRAGMA foreign_keys=ON;
