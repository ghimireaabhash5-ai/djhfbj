CREATE TABLE `activity_logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` integer,
	`details` text,
	`ip_address` text,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_by_id` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`target_role` text,
	`target_audience` text,
	`priority` text DEFAULT 'normal' NOT NULL,
	`published_at` integer,
	`expires_at` integer,
	`created_at` integer DEFAULT 1777881049 NOT NULL,
	`updated_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY NOT NULL,
	`course_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`due_date` integer NOT NULL,
	`max_points` real DEFAULT 100 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` integer PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`date` integer NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`recorded_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_attendance_date` ON `attendance` (`student_id`,`course_id`,`date`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`teacher_id` integer NOT NULL,
	`grade_level` text NOT NULL,
	`credits` real DEFAULT 3 NOT NULL,
	`max_students` integer,
	`semester` text NOT NULL,
	`year` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_code_unique` ON `courses` (`code`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` integer PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`enrollment_date` integer NOT NULL,
	`grade` text,
	`final_score` real,
	`status` text DEFAULT 'enrolled' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_student_course` ON `enrollments` (`student_id`,`course_id`);--> statement-breakpoint
CREATE TABLE `grades` (
	`id` integer PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`assignment_id` integer NOT NULL,
	`score` real,
	`feedback` text,
	`submitted_at` integer,
	`graded_at` integer,
	`graded_by` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_student_assignment` ON `grades` (`student_id`,`assignment_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`sender_id` integer NOT NULL,
	`recipient_id` integer NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`is_read` integer DEFAULT 0 NOT NULL,
	`read_at` integer,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`permissions` text,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updated_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`student_id_number` text NOT NULL,
	`grade_level` text NOT NULL,
	`enrollment_date` integer NOT NULL,
	`parent_id` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_number_unique` ON `students` (`student_id_number`);--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`employee_id_number` text NOT NULL,
	`department` text,
	`specialization` text,
	`hire_date` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_employee_id_number_unique` ON `teachers` (`employee_id_number`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`role_id` integer NOT NULL,
	`avatar` text,
	`phone` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT 1777881049 NOT NULL,
	`updated_at` integer DEFAULT 1777881049 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_role` ON `users` (`role_id`);