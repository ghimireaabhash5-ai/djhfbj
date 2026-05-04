import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { announcements, users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const allAnnouncements = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        priority: announcements.priority,
        publishedAt: announcements.publishedAt,
        expiresAt: announcements.expiresAt,
        createdByFirstName: users.firstName,
        createdByLastName: users.lastName,
      })
      .from(announcements)
      .leftJoin(users, announcements.createdById === users.id)
      .orderBy(announcements.publishedAt);

    const formattedAnnouncements = allAnnouncements.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      priority: a.priority,
      publishedAt: a.publishedAt || Math.floor(Date.now() / 1000),
      expiresAt: a.expiresAt,
      createdByName: `${a.createdByFirstName || ''} ${a.createdByLastName || ''}`.trim(),
    }));

    return NextResponse.json({
      announcements: formattedAnnouncements,
    });
  } catch (error) {
    console.error('[v0] Fetch announcements error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
