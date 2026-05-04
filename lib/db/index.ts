import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

let db: ReturnType<typeof drizzle> | null = null;
let initialized = false;

const DB_PATH = path.join(process.cwd(), 'school.db');
const MIGRATIONS_FILE = path.join(process.cwd(), 'lib/db/migrations/0000_nervous_hellcat.sql');

function getMigrationSQL(): string {
  try {
    return fs.readFileSync(MIGRATIONS_FILE, 'utf-8');
  } catch (error) {
    console.error('Could not read migration file:', error);
    return '';
  }
}

export function getDb() {
  if (!db) {
    const sqlite = new Database(DB_PATH);
    // Enable foreign keys
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');

    db = drizzle(sqlite, { schema });

    // Initialize schema on first load
    if (!initialized) {
      initializeSchema(sqlite);
      initialized = true;
    }
  }
  return db;
}

function initializeSchema(sqlite: Database.Database) {
  try {
    // Check if tables already exist
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    
    if (tables.length === 0) {
      // Run migrations
      const migrationSQL = getMigrationSQL();
      if (migrationSQL) {
        const statements = migrationSQL.split(/--> statement-breakpoint/).filter(s => s.trim());
        for (const statement of statements) {
          try {
            sqlite.exec(statement.trim());
          } catch (error) {
            console.error('Migration statement error:', error);
          }
        }
      }

      // Seed initial data
      seedInitialData(sqlite);
    }
  } catch (error) {
    console.error('Schema initialization error:', error);
  }
}

function seedInitialData(sqlite: Database.Database) {
  try {
    // Check if roles already exist
    const rolesCount = sqlite
      .prepare('SELECT COUNT(*) as count FROM roles')
      .get() as { count: number };

    if (rolesCount.count === 0) {
      // Insert roles
      const insertRole = sqlite.prepare(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`
      );

      insertRole.run('Admin', 'System administrator', JSON.stringify(['all']));
      insertRole.run('Teacher', 'Teacher role', JSON.stringify(['view_students', 'grade_assignments', 'manage_attendance']));
      insertRole.run('Student', 'Student role', JSON.stringify(['view_courses', 'submit_assignments', 'view_grades']));
      insertRole.run('Parent', 'Parent role', JSON.stringify(['view_child_progress', 'view_announcements']));
      insertRole.run('Staff', 'Staff role', JSON.stringify(['view_announcements', 'basic_operations']));

      // Insert users
      const adminHash = bcrypt.hashSync('admin123', 10);
      const teacherHash = bcrypt.hashSync('password123', 10);
      const studentHash = bcrypt.hashSync('password123', 10);

      const insertUser = sqlite.prepare(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
      );

      const adminUser = insertUser.run(
        'admin@school.edu',
        adminHash,
        'Admin',
        'User',
        1,
        '555-0001',
        'active'
      );

      const teacher1 = insertUser.run(
        'john.doe@school.edu',
        teacherHash,
        'John',
        'Doe',
        2,
        '555-1001',
        'active'
      );

      const teacher2 = insertUser.run(
        'jane.smith@school.edu',
        teacherHash,
        'Jane',
        'Smith',
        2,
        '555-1002',
        'active'
      );

      insertUser.run(
        'alice.johnson@school.edu',
        studentHash,
        'Alice',
        'Johnson',
        3,
        null,
        'active'
      );

      insertUser.run(
        'bob.wilson@school.edu',
        studentHash,
        'Bob',
        'Wilson',
        3,
        null,
        'active'
      );

      insertUser.run(
        'carol.davis@school.edu',
        studentHash,
        'Carol',
        'Davis',
        3,
        null,
        'active'
      );

      // Insert teachers
      const insertTeacher = sqlite.prepare(
        `INSERT INTO teachers (user_id, employee_id_number, department, specialization, hire_date, status) VALUES (?, ?, ?, ?, ?, ?)`
      );

      insertTeacher.run(
        Number((teacher1 as any).lastInsertRowid),
        'T001',
        'Mathematics',
        'Algebra & Geometry',
        Math.floor(new Date('2020-08-15').getTime() / 1000),
        'active'
      );

      insertTeacher.run(
        Number((teacher2 as any).lastInsertRowid),
        'T002',
        'English',
        'Literature & Writing',
        Math.floor(new Date('2021-09-01').getTime() / 1000),
        'active'
      );

      // Insert students
      const insertStudent = sqlite.prepare(
        `INSERT INTO students (user_id, student_id_number, grade_level, enrollment_date, status) VALUES (?, ?, ?, ?, ?)`
      );

      insertStudent.run(
        4,
        'S001',
        '10',
        Math.floor(new Date('2023-08-20').getTime() / 1000),
        'active'
      );

      insertStudent.run(
        5,
        'S002',
        '10',
        Math.floor(new Date('2023-08-20').getTime() / 1000),
        'active'
      );

      insertStudent.run(
        6,
        'S003',
        '9',
        Math.floor(new Date('2024-08-19').getTime() / 1000),
        'active'
      );

      // Insert courses
      const insertCourse = sqlite.prepare(
        `INSERT INTO courses (name, code, description, teacher_id, grade_level, credits, max_students, semester, year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      insertCourse.run(
        'Algebra I',
        'MATH101',
        'Introduction to Algebra',
        1,
        '10',
        3,
        30,
        'Fall',
        2024,
        'active'
      );

      insertCourse.run(
        'English Literature',
        'ENG201',
        'Classic and Contemporary Literature',
        2,
        '10',
        3,
        25,
        'Fall',
        2024,
        'active'
      );

      insertCourse.run(
        'World History',
        'HIST101',
        'Survey of World History',
        1,
        '9',
        3,
        28,
        'Fall',
        2024,
        'active'
      );

      console.log('[v0] Database initialized with seed data');
    }
  } catch (error) {
    console.error('Seed data error:', error);
  }
}

export type DB = ReturnType<typeof getDb>;
