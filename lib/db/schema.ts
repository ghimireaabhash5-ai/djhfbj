import { sqliteTable, text, integer, real, blob, primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Roles table
export const roles = sqliteTable('roles', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(), // Admin, Teacher, Student, Parent, Staff
  description: text('description'),
  permissions: text('permissions'), // JSON array of permissions
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Users table
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    roleId: integer('role_id').notNull(),
    avatar: text('avatar'),
    phone: text('phone'),
    status: text('status').notNull().default('active'), // active, inactive, suspended
    createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
    updatedAt: integer('updated_at').notNull().default(Math.floor(Date.now() / 1000)),
  },
  (table) => ({
    roleIdIndex: uniqueIndex('idx_user_role').on(table.roleId),
  })
);

// Students table
export const students = sqliteTable('students', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  studentIdNumber: text('student_id_number').notNull().unique(),
  gradeLevel: text('grade_level').notNull(), // K, 1, 2, ..., 12
  enrollmentDate: integer('enrollment_date').notNull(),
  parentId: integer('parent_id'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Teachers table
export const teachers = sqliteTable('teachers', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  employeeIdNumber: text('employee_id_number').notNull().unique(),
  department: text('department'),
  specialization: text('specialization'),
  hireDate: integer('hire_date').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Courses table
export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  teacherId: integer('teacher_id').notNull(),
  gradeLevel: text('grade_level').notNull(),
  credits: real('credits').notNull().default(3),
  maxStudents: integer('max_students'),
  semester: text('semester').notNull(), // Fall, Spring, Summer
  year: integer('year').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Enrollments table (Student enrollment in courses)
export const enrollments = sqliteTable(
  'enrollments',
  {
    id: integer('id').primaryKey(),
    studentId: integer('student_id').notNull(),
    courseId: integer('course_id').notNull(),
    enrollmentDate: integer('enrollment_date').notNull(),
    grade: text('grade'), // A, B, C, D, F, or numeric
    finalScore: real('final_score'),
    status: text('status').notNull().default('enrolled'), // enrolled, dropped, completed
  },
  (table) => ({
    uniqueEnrollment: uniqueIndex('idx_student_course').on(table.studentId, table.courseId),
  })
);

// Attendance table
export const attendance = sqliteTable(
  'attendance',
  {
    id: integer('id').primaryKey(),
    studentId: integer('student_id').notNull(),
    courseId: integer('course_id').notNull(),
    date: integer('date').notNull(), // timestamp
    status: text('status').notNull(), // Present, Absent, Late, Excused
    notes: text('notes'),
    recordedAt: integer('recorded_at').notNull().default(Math.floor(Date.now() / 1000)),
  },
  (table) => ({
    uniqueAttendance: uniqueIndex('idx_attendance_date').on(table.studentId, table.courseId, table.date),
  })
);

// Assignments table
export const assignments = sqliteTable('assignments', {
  id: integer('id').primaryKey(),
  courseId: integer('course_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: integer('due_date').notNull(),
  maxPoints: real('max_points').notNull().default(100),
  status: text('status').notNull().default('active'), // active, closed, graded
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Grades table (Individual assignment grades)
export const grades = sqliteTable(
  'grades',
  {
    id: integer('id').primaryKey(),
    studentId: integer('student_id').notNull(),
    assignmentId: integer('assignment_id').notNull(),
    score: real('score'),
    feedback: text('feedback'),
    submittedAt: integer('submitted_at'),
    gradedAt: integer('graded_at'),
    gradedBy: integer('graded_by'),
  },
  (table) => ({
    uniqueGrade: uniqueIndex('idx_student_assignment').on(table.studentId, table.assignmentId),
  })
);

// Messages table (Internal messaging system)
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey(),
  senderId: integer('sender_id').notNull(),
  recipientId: integer('recipient_id').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  isRead: integer('is_read').notNull().default(0), // 0 = unread, 1 = read
  readAt: integer('read_at'),
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Announcements table
export const announcements = sqliteTable('announcements', {
  id: integer('id').primaryKey(),
  createdById: integer('created_by_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  targetRole: text('target_role'), // Specific role or null for all
  targetAudience: text('target_audience'), // all, students, teachers, parents, staff
  priority: text('priority').notNull().default('normal'), // low, normal, high, urgent
  publishedAt: integer('published_at'),
  expiresAt: integer('expires_at'),
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
  updatedAt: integer('updated_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Activity logs (For admin tracking)
export const activityLogs = sqliteTable('activity_logs', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  action: text('action').notNull(), // login, logout, create, update, delete, etc
  entity: text('entity').notNull(), // student, course, grade, etc
  entityId: integer('entity_id'),
  details: text('details'), // JSON with additional details
  ipAddress: text('ip_address'),
  createdAt: integer('created_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// System settings
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: integer('updated_at').notNull().default(Math.floor(Date.now() / 1000)),
});

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  sentMessages: many(messages, {
    relationName: 'sentMessages',
  }),
  receivedMessages: many(messages, {
    relationName: 'receivedMessages',
  }),
  createdAnnouncements: many(announcements),
  activityLogs: many(activityLogs),
  gradedAssignments: many(grades, {
    relationName: 'gradedBy',
  }),
}));

export const studentRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  attendance: many(attendance),
  grades: many(grades),
}));

export const teacherRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  courses: many(courses),
}));

export const courseRelations = relations(courses, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  enrollments: many(enrollments),
  attendance: many(attendance),
  assignments: many(assignments),
}));

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [attendance.courseId],
    references: [courses.id],
  }),
}));

export const assignmentRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  grades: many(grades),
}));

export const gradeRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
  assignment: one(assignments, {
    fields: [grades.assignmentId],
    references: [assignments.id],
  }),
  gradedByUser: one(users, {
    fields: [grades.gradedBy],
    references: [users.id],
    relationName: 'gradedBy',
  }),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sentMessages',
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: 'receivedMessages',
  }),
}));

export const announcementRelations = relations(announcements, ({ one }) => ({
  createdBy: one(users, {
    fields: [announcements.createdById],
    references: [users.id],
  }),
}));

export const activityLogRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));
