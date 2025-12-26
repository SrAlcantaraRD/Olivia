DROP INDEX `record__unique__created_at`;--> statement-breakpoint
CREATE UNIQUE INDEX `record__unique__module_id__created_at` ON `record` (`module_id`,`created_at`);--> statement-breakpoint
DROP INDEX `record_field__unique__field_id_created_at`;--> statement-breakpoint
CREATE UNIQUE INDEX `record_field__unique__record_id__field_id` ON `record_field` (`record_id`,`field_id`);