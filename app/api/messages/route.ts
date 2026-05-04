import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const allMessages = await db
      .select({
        id: messages.id,
        subject: messages.subject,
        body: messages.body,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        senderEmail: users.email,
        senderFirstName: users.firstName,
        senderLastName: users.lastName,
      })
      .from(messages)
      .leftJoin(users, messages.senderId === users.id)
      .orderBy(messages.createdAt);

    const formattedMessages = allMessages.map(m => ({
      id: m.id,
      subject: m.subject,
      body: m.body,
      isRead: m.isRead === 1,
      createdAt: m.createdAt,
      senderEmail: m.senderEmail || 'Unknown',
      senderName: `${m.senderFirstName || ''} ${m.senderLastName || ''}`.trim(),
    }));

    return NextResponse.json({
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('[v0] Fetch messages error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json(
        { message: 'Message ID is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.delete(messages).where(eq(messages.id, Number(messageId)));

    return NextResponse.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('[v0] Delete message error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
