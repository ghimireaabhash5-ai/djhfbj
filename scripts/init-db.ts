import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DB_PATH = 'school.db';
const MIGRATIONS_PATH = './lib/db/migrations/0000_nervous_hellcat.sql';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

async function runMigration() {
  return new Promise((resolve, reject) => {
    const migrationSQL = fs.readFileSync(MIGRATIONS_PATH, 'utf-8');
    const statements = migrationSQL.split(/--> statement-breakpoint/);

    db.serialize(() => {
      statements.forEach((statement) => {
        const trimmed = statement.trim();
        if (trimmed) {
          db.run(trimmed, (err) => {
            if (err) console.error('Migration error:', err);
          });
        }
      });

      db.run(() => {
        console.log('Migration completed');
        resolve(null);
      });
    });
  });
}

async function seedData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Insert roles
      db.run(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
        ['Admin', 'System administrator', JSON.stringify(['all'])],
        function (err) {
          if (err) console.error('Error inserting admin role:', err);
        }
      );

      db.run(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
        ['Teacher', 'Teacher role', JSON.stringify(['view_students', 'grade_assignments', 'manage_attendance'])],
        function (err) {
          if (err) console.error('Error inserting teacher role:', err);
        }
      );

      db.run(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
        ['Student', 'Student role', JSON.stringify(['view_courses', 'submit_assignments', 'view_grades'])],
        function (err) {
          if (err) console.error('Error inserting student role:', err);
        }
      );

      db.run(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
        ['Parent', 'Parent role', JSON.stringify(['view_child_progress', 'view_announcements'])],
        function (err) {
          if (err) console.error('Error inserting parent role:', err);
        }
      );

      db.run(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
        ['Staff', 'Staff role', JSON.stringify(['view_announcements', 'basic_operations'])],
        function (err) {
          if (err) console.error('Error inserting staff role:', err);
        }
      );

      // Insert admin user
      const adminHash = bcrypt.hashSync('admin123', 10);
      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['admin@school.edu', adminHash, 'Admin', 'User', 1, '555-0001', 'active'],
        function (err) {
          if (err) console.error('Error inserting admin user:', err);
        }
      );

      // Insert teachers
      const teacherHash = bcrypt.hashSync('password123', 10);
      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['john.doe@school.edu', teacherHash, 'John', 'Doe', 2, '555-1001', 'active'],
        function (err) {
          if (err) console.error('Error inserting teacher 1:', err);
        }
      );

      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['jane.smith@school.edu', teacherHash, 'Jane', 'Smith', 2, '555-1002', 'active'],
        function (err) {
          if (err) console.error('Error inserting teacher 2:', err);
        }
      );

      // Insert students
      const studentHash = bcrypt.hashSync('password123', 10);
      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['alice.johnson@school.edu', studentHash, 'Alice', 'Johnson', 3, 'active'],
        function (err) {
          if (err) console.error('Error inserting student 1:', err);
        }
      );

      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['bob.wilson@school.edu', studentHash, 'Bob', 'Wilson', 3, 'active'],
        function (err) {
          if (err) console.error('Error inserting student 2:', err);
        }
      );

      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['carol.davis@school.edu', studentHash, 'Carol', 'Davis', 3, 'active'],
        function (err) {
          if (err) console.error('Error inserting student 3:', err);
        }
      );

      db.run(() => {
        console.log('Database seeded successfully!');
        resolve(null);
      });
    });
  });
}

async function initialize() {
  try {
    await runMigration();
    await seedData();
    db.close();
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Initialization failed:', error);
    db.close();
    process.exit(1);
  }
}

initialize();
