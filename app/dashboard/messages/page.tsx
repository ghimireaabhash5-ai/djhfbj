'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.senderEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (messageId: number) => {
    try {
      await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Inbox with {messages.filter(m => !m.isRead).length} unread</p>
        </div>
        <Button className="gap-2">
          <Send className="w-4 h-4" />
          Compose
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm">No messages</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedMessage?.id === msg.id
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-muted'
                    } ${!msg.isRead ? 'font-semibold' : ''}`}
                  >
                    <p className="text-sm truncate">{msg.senderEmail}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2">
          {selectedMessage ? (
            <>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{selectedMessage.subject}</CardTitle>
                  <CardDescription>{selectedMessage.senderEmail}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{selectedMessage.body}</p>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Select a message to view</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
