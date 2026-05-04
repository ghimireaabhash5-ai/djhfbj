import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, courses, students, messages, enrollments, grades } from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    // Get counts
    const userCountResult = await db
      .select({ count: count() })
      .from(users);
    const totalUsers = userCountResult[0]?.count || 0;

    const courseCountResult = await db
      .select({ count: count() })
      .from(courses);
    const totalCourses = courseCountResult[0]?.count || 0;

    const studentCountResult = await db
      .select({ count: count() })
      .from(students);
    const totalStudents = studentCountResult[0]?.count || 0;

    const unreadMessagesResult = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.isRead, 0));
    const unreadMessages = unreadMessagesResult[0]?.count || 0;

    // Mock enrollment trend data
    const enrollmentTrend = [
      { month: 'Aug', count: 12 },
      { month: 'Sep', count: 19 },
      { month: 'Oct', count: 15 },
      { month: 'Nov', count: 22 },
      { month: 'Dec', count: 25 },
      { month: 'Jan', count: 20 },
    ];

    // Mock grade distribution
    const gradeDistribution = [
      { grade: 'A', value: 30 },
      { grade: 'B', value: 45 },
      { grade: 'C', value: 20 },
      { grade: 'D', value: 4 },
      { grade: 'F', value: 1 },
    ];

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalStudents,
      unreadMessages,
      enrollmentTrend,
      gradeDistribution,
    });
  } catch (error) {
    console.error('[v0] Dashboard stats error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
