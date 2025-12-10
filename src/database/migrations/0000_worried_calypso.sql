CREATE TABLE `carer` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`is_primary` integer DEFAULT 0 NOT NULL,
	`pin_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `carer__index__id` ON `carer` (`id`);--> statement-breakpoint
CREATE INDEX `carer__index__status` ON `carer` (`status`);--> statement-breakpoint
CREATE INDEX `carer__index__is_primary` ON `carer` (`is_primary`);--> statement-breakpoint
CREATE TABLE `module` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`active` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_code_unique` ON `module` (`code`);--> statement-breakpoint
CREATE INDEX `module__index__id` ON `module` (`id`);--> statement-breakpoint
CREATE INDEX `module__index__status` ON `module` (`status`);--> statement-breakpoint
CREATE INDEX `module__index__code` ON `module` (`code`);--> statement-breakpoint
CREATE INDEX `module__index__active` ON `module` (`active`);--> statement-breakpoint
CREATE TABLE `module_field` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`module_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`values` text,
	`required` integer DEFAULT 0 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON UPDATE restrict ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `module_field__index__id` ON `module_field` (`id`);--> statement-breakpoint
CREATE INDEX `module_field__index__status` ON `module_field` (`status`);--> statement-breakpoint
CREATE INDEX `module_field__index__module_id` ON `module_field` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_field__index__type` ON `module_field` (`type`);--> statement-breakpoint
CREATE TABLE `patient` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`name` text NOT NULL,
	`birth_date` integer NOT NULL,
	`sex` text NOT NULL,
	`autonomy_level` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `patient__index__id` ON `patient` (`id`);--> statement-breakpoint
CREATE INDEX `patient__index__status` ON `patient` (`status`);--> statement-breakpoint
CREATE TABLE `record` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`module_id` integer NOT NULL,
	`carer_id` integer NOT NULL,
	`data` text NOT NULL,
	`synced` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`carer_id`) REFERENCES `carer`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`module_id`) REFERENCES `module`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`carer_id`) REFERENCES `carer`(`id`) ON UPDATE restrict ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `record__index__id` ON `record` (`id`);--> statement-breakpoint
CREATE INDEX `record__index__status` ON `record` (`status`);--> statement-breakpoint
CREATE INDEX `record__index__module_id` ON `record` (`module_id`);--> statement-breakpoint
CREATE INDEX `record__index__synced` ON `record` (`synced`);--> statement-breakpoint
CREATE TABLE `record_field` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`record_id` integer NOT NULL,
	`field_id` integer NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `record`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`field_id`) REFERENCES `module_field`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`record_id`) REFERENCES `record`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`field_id`) REFERENCES `module_field`(`id`) ON UPDATE restrict ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `record_field__index__id` ON `record_field` (`id`);--> statement-breakpoint
CREATE INDEX `record_field__index__status` ON `record_field` (`status`);--> statement-breakpoint
CREATE INDEX `record_field__index__record_id` ON `record_field` (`record_id`);--> statement-breakpoint
CREATE INDEX `record_field__index__field_id` ON `record_field` (`field_id`);