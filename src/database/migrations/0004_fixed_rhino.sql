CREATE TABLE `record_field` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
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
CREATE INDEX `record_field__index__field_id` ON `record_field` (`field_id`);--> statement-breakpoint
ALTER TABLE `record` ADD `module_id` integer NOT NULL REFERENCES module(id);--> statement-breakpoint
ALTER TABLE `record` ADD `data` text NOT NULL;--> statement-breakpoint
CREATE INDEX `record__index__id` ON `record` (`id`);--> statement-breakpoint
CREATE INDEX `record__index__status` ON `record` (`status`);--> statement-breakpoint
CREATE INDEX `record__index__module_id` ON `record` (`module_id`);--> statement-breakpoint
CREATE INDEX `record__index__synced` ON `record` (`synced`);--> statement-breakpoint
ALTER TABLE `record` DROP COLUMN `field_id`;--> statement-breakpoint
ALTER TABLE `record` DROP COLUMN `device_id`;--> statement-breakpoint
ALTER TABLE `record` DROP COLUMN `value`;--> statement-breakpoint
CREATE INDEX `module__index__id` ON `module` (`id`);--> statement-breakpoint
CREATE INDEX `module__index__status` ON `module` (`status`);--> statement-breakpoint
CREATE INDEX `module__index__code` ON `module` (`code`);--> statement-breakpoint
CREATE INDEX `module__index__active` ON `module` (`active`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_module_field` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
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
INSERT INTO `__new_module_field`("id", "status", "module_id", "title", "description", "type", "values", "required", "order") SELECT "id", "status", "module_id", "title", "description", "type", "values", "required", "order" FROM `module_field`;--> statement-breakpoint
DROP TABLE `module_field`;--> statement-breakpoint
ALTER TABLE `__new_module_field` RENAME TO `module_field`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `module_field__index__id` ON `module_field` (`id`);--> statement-breakpoint
CREATE INDEX `module_field__index__status` ON `module_field` (`status`);--> statement-breakpoint
CREATE INDEX `module_field__index__module_id` ON `module_field` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_field__index__type` ON `module_field` (`type`);