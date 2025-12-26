ALTER TABLE `module_field` RENAME COLUMN "title" TO "code";--> statement-breakpoint
CREATE UNIQUE INDEX `module_field__unique__module_id__title` ON `module_field` (`module_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `module__unique__code` ON `module` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `record__unique__created_at` ON `record` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `record_field__unique__created_at` ON `record_field` (`created_at`);