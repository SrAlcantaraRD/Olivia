DROP INDEX `record_field__unique__created_at`;--> statement-breakpoint
CREATE UNIQUE INDEX `record_field__unique__field_id_created_at` ON `record_field` (`field_id`,`created_at`);