import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { roles } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const allRoles = await db.select().from(roles);

    const formattedRoles = allRoles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: role.permissions ? JSON.parse(role.permissions) : [],
    }));

    return NextResponse.json({
      roles: formattedRoles,
    });
  } catch (error) {
    console.error('[v0] Fetch roles error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
