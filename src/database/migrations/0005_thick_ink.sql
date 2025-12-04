PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_module` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`name` text NOT NULL,
	`description` text,
	`key` text,
	`active` integer DEFAULT 0 NOT NULL,
	`ord` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_module`("id", "uuid", "status", "created_at", "updated_at", "deleted_at", "name", "description", "key", "active", "ord") SELECT "id", "uuid", "status", "created_at", "updated_at", "deleted_at", "name", "description", "key", "active", "ord" FROM `module`;--> statement-breakpoint
DROP TABLE `module`;--> statement-breakpoint
ALTER TABLE `__new_module` RENAME TO `module`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `module_uuid_unique` ON `module` (`uuid`);