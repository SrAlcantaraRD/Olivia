CREATE TABLE `carer` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`is_primary` integer DEFAULT 0 NOT NULL,
	`pin_hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `module` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`active` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_code_unique` ON `module` (`code`);--> statement-breakpoint
CREATE TABLE `module_field` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`module_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`values` text,
	`required` integer DEFAULT 0 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patient` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`name` text NOT NULL,
	`birth_date` integer NOT NULL,
	`sex` text NOT NULL,
	`autonomy_level` text NOT NULL
);
