CREATE TABLE `launch_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(254) NOT NULL,
	`consent` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `launch_signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `launch_signups_email_unique` UNIQUE(`email`)
);
