import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { attendance, courses } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const allAttendance = await db
      .select({
        id: attendance.id,
        date: attendance.date,
        status: attendance.status,
        notes: attendance.notes,
        courseName: courses.name,
      })
      .from(attendance)
      .leftJoin(courses, attendance.courseId === courses.id)
      .orderBy(attendance.date);

    // Calculate stats
    const stats = {
      present: allAttendance.filter(a => a.status === 'Present').length,
      absent: allAttendance.filter(a => a.status === 'Absent').length,
      late: allAttendance.filter(a => a.status === 'Late').length,
      excused: allAttendance.filter(a => a.status === 'Excused').length,
    };

    const records = allAttendance.map(a => ({
      id: a.id,
      courseName: a.courseName || 'Unknown Course',
      date: a.date,
      status: a.status,
      notes: a.notes,
    }));

    return NextResponse.json({
      records,
      stats,
    });
  } catch (error) {
    console.error('[v0] Fetch attendance error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
