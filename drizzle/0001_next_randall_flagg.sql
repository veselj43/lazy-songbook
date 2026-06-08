CREATE TABLE `library_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`viewer_user_id` text NOT NULL,
	`library_share_id` text NOT NULL,
	`owner_display_name` text,
	`status` text DEFAULT 'default' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`library_share_id`) REFERENCES `library_shares`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `library_memberships_viewer_share_unique` ON `library_memberships` (`viewer_user_id`,`library_share_id`);--> statement-breakpoint
CREATE TABLE `library_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text NOT NULL,
	`token` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `library_shares_owner_user_id_unique` ON `library_shares` (`owner_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `library_shares_token_unique` ON `library_shares` (`token`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_songs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`author` text(50) NOT NULL,
	`name` text(100) NOT NULL,
	`content` text(10000) DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_songs`("id", "user_id", "author", "name", "content", "created_at", "updated_at") SELECT "id", "user_id", "author", "name", "content", "created_at", "updated_at" FROM `songs`;--> statement-breakpoint
DROP TABLE `songs`;--> statement-breakpoint
ALTER TABLE `__new_songs` RENAME TO `songs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;