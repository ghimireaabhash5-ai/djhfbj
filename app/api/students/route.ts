import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { students, users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const allStudents = await db
      .select({
        id: students.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        studentIdNumber: students.studentIdNumber,
        gradeLevel: students.gradeLevel,
        status: students.status,
      })
      .from(students)
      .leftJoin(users, students.userId === users.id);

    return NextResponse.json({
      students: allStudents,
    });
  } catch (error) {
    console.error('[v0] Fetch students error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
