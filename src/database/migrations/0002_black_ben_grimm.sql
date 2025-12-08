CREATE TABLE `record` (
	`id` integer PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`field_id` integer NOT NULL,
	`synced` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`value` text NOT NULL
);
