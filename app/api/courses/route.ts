import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { courses, teachers, users, enrollments } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    
    const allCourses = await db
      .select({
        id: courses.id,
        name: courses.name,
        code: courses.code,
        description: courses.description,
        teacherId: courses.teacherId,
        gradeLevel: courses.gradeLevel,
        credits: courses.credits,
        maxStudents: courses.maxStudents,
        semester: courses.semester,
        year: courses.year,
        status: courses.status,
        teacherFirstName: users.firstName,
        teacherLastName: users.lastName,
      })
      .from(courses)
      .leftJoin(teachers, courses.teacherId === teachers.id)
      .leftJoin(users, teachers.userId === users.id);

    // Get enrollment counts for each course
    const enrollmentCounts = await Promise.all(
      allCourses.map(async (course) => {
        const countResult = await db
          .select({ count: count() })
          .from(enrollments)
          .where(enrollments.courseId === course.id);
        return countResult[0]?.count || 0;
      })
    );

    const formattedCourses = allCourses.map((course, index) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description,
      teacherId: course.teacherId,
      gradeLevel: course.gradeLevel,
      credits: course.credits,
      maxStudents: course.maxStudents,
      semester: course.semester,
      year: course.year,
      status: course.status,
      teacherName: course.teacherFirstName ? `${course.teacherFirstName} ${course.teacherLastName}` : 'Unassigned',
      enrollmentCount: enrollmentCounts[index],
    }));

    return NextResponse.json({
      courses: formattedCourses,
    });
  } catch (error) {
    console.error('[v0] Fetch courses error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
