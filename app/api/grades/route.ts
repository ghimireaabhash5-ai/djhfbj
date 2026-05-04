import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { grades, assignments, students, users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const allGrades = await db
      .select({
        id: grades.id,
        score: grades.score,
        maxPoints: assignments.maxPoints,
        feedback: grades.feedback,
        gradedAt: grades.gradedAt,
        assignmentTitle: assignments.title,
        studentName: students.id,
        gradedByName: users.firstName,
      })
      .from(grades)
      .leftJoin(assignments, grades.assignmentId === assignments.id)
      .leftJoin(students, grades.studentId === students.id)
      .leftJoin(users, grades.gradedBy === users.id);

    const formattedGrades = allGrades.map(g => ({
      id: g.id,
      studentName: '',
      assignmentTitle: g.assignmentTitle || 'Unknown Assignment',
      score: g.score || 0,
      maxPoints: g.maxPoints || 100,
      feedback: g.feedback || '',
      gradedAt: g.gradedAt || 0,
      gradedByName: g.gradedByName || 'Unknown',
    }));

    return NextResponse.json({
      grades: formattedGrades,
    });
  } catch (error) {
    console.error('[v0] Fetch grades error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
