CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL,
	`type` text DEFAULT 'birthday' NOT NULL,
	`frequency` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`birthday_day` integer,
	`birthday_month` integer,
	`birthday_year` integer,
	`joined_at` integer NOT NULL,
	`karma` integer DEFAULT 0,
	CONSTRAINT "birthday_day_check" CHECK("users"."birthday_day" >= 1 AND "users"."birthday_day" <= 31),
	CONSTRAINT "birthday_month_check" CHECK("users"."birthday_month" >= 1 AND "users"."birthday_month" <= 12)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discord_username_idx` ON `users` (`username`);