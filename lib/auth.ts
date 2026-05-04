import bcrypt from 'bcryptjs';
import { getDb } from './db';
import { users, roles } from './db/schema';
import { eq } from 'drizzle-orm';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      role: true,
    },
  });
  return user;
}

export async function getUserById(id: number) {
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      role: true,
    },
  });
  return user;
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  roleId: number
) {
  const db = getDb();
  const passwordHash = await hashPassword(password);
  
  const user = await db.insert(users).values({
    email,
    passwordHash,
    firstName,
    lastName,
    roleId,
  }).returning();

  return user[0];
}

export async function verifyCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) return null;
  
  return user;
}

export const PERMISSIONS = {
  ADMIN: 'all',
  TEACHER: ['view_students', 'grade_assignments', 'manage_attendance', 'create_courses'],
  STUDENT: ['view_courses', 'submit_assignments', 'view_grades', 'view_attendance'],
  PARENT: ['view_child_progress', 'view_announcements'],
  STAFF: ['view_announcements', 'basic_operations'],
};

export const ROLES = {
  ADMIN: 1,
  TEACHER: 2,
  STUDENT: 3,
  PARENT: 4,
  STAFF: 5,
};

export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff';

export function getRoleName(roleId: number): UserRole | null {
  const roleMap: Record<number, UserRole> = {
    1: 'Admin',
    2: 'Teacher',
    3: 'Student',
    4: 'Parent',
    5: 'Staff',
  };
  return roleMap[roleId] || null;
}
