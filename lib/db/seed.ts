import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import bcrypt from 'bcryptjs';
import * as schema from './schema';

const sqlite = new Database('school.db');
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log('Starting database seed...');

  // Clear existing data
  await db.delete(schema.activityLogs);
  await db.delete(schema.announcements);
  await db.delete(schema.messages);
  await db.delete(schema.grades);
  await db.delete(schema.assignments);
  await db.delete(schema.attendance);
  await db.delete(schema.enrollments);
  await db.delete(schema.courses);
  await db.delete(schema.students);
  await db.delete(schema.teachers);
  await db.delete(schema.users);
  await db.delete(schema.roles);
  await db.delete(schema.settings);

  // Create roles
  const adminRole = await db
    .insert(schema.roles)
    .values({
      name: 'Admin',
      description: 'System administrator',
      permissions: JSON.stringify(['all']),
    })
    .returning();

  const teacherRole = await db
    .insert(schema.roles)
    .values({
      name: 'Teacher',
      description: 'Teacher role',
      permissions: JSON.stringify(['view_students', 'grade_assignments', 'manage_attendance']),
    })
    .returning();

  const studentRole = await db
    .insert(schema.roles)
    .values({
      name: 'Student',
      description: 'Student role',
      permissions: JSON.stringify(['view_courses', 'submit_assignments', 'view_grades']),
    })
    .returning();

  const parentRole = await db
    .insert(schema.roles)
    .values({
      name: 'Parent',
      description: 'Parent role',
      permissions: JSON.stringify(['view_child_progress', 'view_announcements']),
    })
    .returning();

  const staffRole = await db
    .insert(schema.roles)
    .values({
      name: 'Staff',
      description: 'Staff role',
      permissions: JSON.stringify(['view_announcements', 'basic_operations']),
    })
    .returning();

  // Create admin user
  const adminUser = await db
    .insert(schema.users)
    .values({
      email: 'admin@school.edu',
      passwordHash: bcrypt.hashSync('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole[0].id,
      phone: '555-0001',
      status: 'active',
    })
    .returning();

  // Create teachers
  const teacher1 = await db
    .insert(schema.users)
    .values({
      email: 'john.doe@school.edu',
      passwordHash: bcrypt.hashSync('password123', 10),
      firstName: 'John',
      lastName: 'Doe',
      roleId: teacherRole[0].id,
      phone: '555-1001',
      status: 'active',
    })
    .returning();

  const teacher2 = await db
    .insert(schema.users)
    .values({
      email: 'jane.smith@school.edu',
      passwordHash: bcrypt.hashSync('password123', 10),
      firstName: 'Jane',
      lastName: 'Smith',
      roleId: teacherRole[0].id,
      phone: '555-1002',
      status: 'active',
    })
    .returning();

  // Create teacher records
  const teacherRecord1 = await db
    .insert(schema.teachers)
    .values({
      userId: teacher1[0].id,
      employeeIdNumber: 'T001',
      department: 'Mathematics',
      specialization: 'Algebra & Geometry',
      hireDate: Math.floor(new Date('2020-08-15').getTime() / 1000),
    })
    .returning();

  const teacherRecord2 = await db
    .insert(schema.teachers)
    .values({
      userId: teacher2[0].id,
      employeeIdNumber: 'T002',
      department: 'English',
      specialization: 'Literature & Writing',
      hireDate: Math.floor(new Date('2021-09-01').getTime() / 1000),
    })
    .returning();

  // Create students
  const student1 = await db
    .insert(schema.users)
    .values({
      email: 'alice.johnson@school.edu',
      passwordHash: bcrypt.hashSync('password123', 10),
      firstName: 'Alice',
      lastName: 'Johnson',
      roleId: studentRole[0].id,
      status: 'active',
    })
    .returning();

  const student2 = await db
    .insert(schema.users)
    .values({
      email: 'bob.wilson@school.edu',
      passwordHash: bcrypt.hashSync('password123', 10),
      firstName: 'Bob',
      lastName: 'Wilson',
      roleId: studentRole[0].id,
      status: 'active',
    })
    .returning();

  const student3 = await db
    .insert(schema.users)
    .values({
      email: 'carol.davis@school.edu',
      passwordHash: bcrypt.hashSync('password123', 10),
      firstName: 'Carol',
      lastName: 'Davis',
      roleId: studentRole[0].id,
      status: 'active',
    })
    .returning();

  // Create student records
  const studentRecord1 = await db
    .insert(schema.students)
    .values({
      userId: student1[0].id,
      studentIdNumber: 'S001',
      gradeLevel: '10',
      enrollmentDate: Math.floor(new Date('2023-08-20').getTime() / 1000),
    })
    .returning();

  const studentRecord2 = await db
    .insert(schema.students)
    .values({
      userId: student2[0].id,
      studentIdNumber: 'S002',
      gradeLevel: '10',
      enrollmentDate: Math.floor(new Date('2023-08-20').getTime() / 1000),
    })
    .returning();

  const studentRecord3 = await db
    .insert(schema.students)
    .values({
      userId: student3[0].id,
      studentIdNumber: 'S003',
      gradeLevel: '9',
      enrollmentDate: Math.floor(new Date('2024-08-19').getTime() / 1000),
    })
    .returning();

  // Create courses
  const course1 = await db
    .insert(schema.courses)
    .values({
      name: 'Algebra I',
      code: 'MATH101',
      description: 'Introduction to Algebra',
      teacherId: teacherRecord1[0].id,
      gradeLevel: '10',
      credits: 3,
      maxStudents: 30,
      semester: 'Fall',
      year: 2024,
    })
    .returning();

  const course2 = await db
    .insert(schema.courses)
    .values({
      name: 'English Literature',
      code: 'ENG201',
      description: 'Classic and Contemporary Literature',
      teacherId: teacherRecord2[0].id,
      gradeLevel: '10',
      credits: 3,
      maxStudents: 25,
      semester: 'Fall',
      year: 2024,
    })
    .returning();

  const course3 = await db
    .insert(schema.courses)
    .values({
      name: 'World History',
      code: 'HIST101',
      description: 'Survey of World History',
      teacherId: teacherRecord1[0].id,
      gradeLevel: '9',
      credits: 3,
      maxStudents: 28,
      semester: 'Fall',
      year: 2024,
    })
    .returning();

  // Create enrollments
  await db.insert(schema.enrollments).values({
    studentId: studentRecord1[0].id,
    courseId: course1[0].id,
    enrollmentDate: Math.floor(new Date('2024-08-20').getTime() / 1000),
  });

  await db.insert(schema.enrollments).values({
    studentId: studentRecord1[0].id,
    courseId: course2[0].id,
    enrollmentDate: Math.floor(new Date('2024-08-20').getTime() / 1000),
  });

  await db.insert(schema.enrollments).values({
    studentId: studentRecord2[0].id,
    courseId: course1[0].id,
    enrollmentDate: Math.floor(new Date('2024-08-20').getTime() / 1000),
  });

  await db.insert(schema.enrollments).values({
    studentId: studentRecord3[0].id,
    courseId: course3[0].id,
    enrollmentDate: Math.floor(new Date('2024-08-20').getTime() / 1000),
  });

  // Create assignments
  const assignment1 = await db
    .insert(schema.assignments)
    .values({
      courseId: course1[0].id,
      title: 'Algebra Basics Quiz',
      description: 'Solve basic algebraic equations',
      dueDate: Math.floor(new Date('2024-09-15').getTime() / 1000),
      maxPoints: 50,
    })
    .returning();

  const assignment2 = await db
    .insert(schema.assignments)
    .values({
      courseId: course2[0].id,
      title: 'Essay: Character Analysis',
      description: 'Analyze main character from Pride and Prejudice',
      dueDate: Math.floor(new Date('2024-09-20').getTime() / 1000),
      maxPoints: 100,
    })
    .returning();

  // Create grades
  await db.insert(schema.grades).values({
    studentId: studentRecord1[0].id,
    assignmentId: assignment1[0].id,
    score: 45,
    feedback: 'Great work! Minor mistakes on problem 5.',
    submittedAt: Math.floor(new Date('2024-09-14').getTime() / 1000),
    gradedAt: Math.floor(new Date('2024-09-14').getTime() / 1000),
    gradedBy: teacher1[0].id,
  });

  await db.insert(schema.grades).values({
    studentId: studentRecord1[0].id,
    assignmentId: assignment2[0].id,
    score: 92,
    feedback: 'Excellent analysis! Well-written essay.',
    submittedAt: Math.floor(new Date('2024-09-19').getTime() / 1000),
    gradedAt: Math.floor(new Date('2024-09-19').getTime() / 1000),
    gradedBy: teacher2[0].id,
  });

  // Create attendance records
  await db.insert(schema.attendance).values({
    studentId: studentRecord1[0].id,
    courseId: course1[0].id,
    date: Math.floor(new Date('2024-09-01').getTime() / 1000),
    status: 'Present',
  });

  await db.insert(schema.attendance).values({
    studentId: studentRecord1[0].id,
    courseId: course1[0].id,
    date: Math.floor(new Date('2024-09-02').getTime() / 1000),
    status: 'Present',
  });

  // Create messages
  await db.insert(schema.messages).values({
    senderId: teacher1[0].id,
    recipientId: student1[0].id,
    subject: 'Assignment Feedback',
    body: 'Your algebra quiz was great! Keep up the good work.',
    isRead: 0,
  });

  // Create announcements
  await db.insert(schema.announcements).values({
    createdById: adminUser[0].id,
    title: 'School Closure - Labor Day',
    content: 'School will be closed on Monday, September 2 for Labor Day.',
    targetAudience: 'all',
    priority: 'high',
    publishedAt: Math.floor(Date.now() / 1000),
  });

  await db.insert(schema.announcements).values({
    createdById: teacher1[0].id,
    title: 'Upcoming Quiz',
    content: 'There will be a quiz on Algebra fundamentals next Friday.',
    targetAudience: 'students',
    priority: 'normal',
    publishedAt: Math.floor(Date.now() / 1000),
  });

  console.log('Database seeded successfully!');
}

seed().catch(console.error);
