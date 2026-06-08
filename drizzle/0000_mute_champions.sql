CREATE TYPE "public"."membership_status" AS ENUM('default', 'dismissed');--> statement-breakpoint
CREATE TABLE "library_memberships" (
	"id" uuid PRIMARY KEY NOT NULL,
	"viewer_user_id" text NOT NULL,
	"library_share_id" uuid NOT NULL,
	"owner_display_name" text,
	"status" "membership_status" DEFAULT 'default' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "library_memberships_viewer_share_unique" UNIQUE("viewer_user_id","library_share_id")
);
--> statement-breakpoint
CREATE TABLE "library_shares" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_user_id" text NOT NULL,
	"token" text NOT NULL,
	"current_song_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "library_shares_owner_user_id_unique" UNIQUE("owner_user_id"),
	CONSTRAINT "library_shares_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"author" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"content" varchar(10000) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "library_memberships" ADD CONSTRAINT "library_memberships_library_share_id_library_shares_id_fk" FOREIGN KEY ("library_share_id") REFERENCES "public"."library_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_shares" ADD CONSTRAINT "library_shares_current_song_id_songs_id_fk" FOREIGN KEY ("current_song_id") REFERENCES "public"."songs"("id") ON DELETE set null ON UPDATE no action;