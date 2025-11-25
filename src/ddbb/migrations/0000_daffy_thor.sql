CREATE TABLE `auth` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`stage` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_uuid_unique` ON `auth` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_email_unique` ON `auth` (`email`);--> statement-breakpoint
CREATE TABLE `task` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`title` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_uuid_unique` ON `task` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `task_title_unique` ON `task` (`title`);