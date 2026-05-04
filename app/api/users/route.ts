import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const allUsers = await db.select().from(users);

    return NextResponse.json({
      users: allUsers.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        status: user.status,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('[v0] Fetch users error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
