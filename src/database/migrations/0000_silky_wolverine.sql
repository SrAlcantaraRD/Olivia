CREATE TABLE `carer` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`is_primary` integer DEFAULT 0 NOT NULL,
	`pin_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `carer_uuid_unique` ON `carer` (`uuid`);--> statement-breakpoint
CREATE TABLE `module` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`name` text NOT NULL,
	`description` text,
	`key` text,
	`active` integer DEFAULT 1 NOT NULL,
	`ord` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_uuid_unique` ON `module` (`uuid`);--> statement-breakpoint
CREATE TABLE `module_field` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`module_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`values` text,
	`required` integer DEFAULT 0 NOT NULL,
	`ord` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_field_uuid_unique` ON `module_field` (`uuid`);--> statement-breakpoint
CREATE TABLE `patient` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`name` text NOT NULL,
	`birth_date` integer NOT NULL,
	`sex` text NOT NULL,
	`autonomy_level` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `patient_uuid_unique` ON `patient` (`uuid`);