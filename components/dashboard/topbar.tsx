'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

interface TopBarProps {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
  };
  onMenuClick: () => void;
}

export function TopBar({ user, onMenuClick }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    }
  };

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-muted rounded"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-5 h-5 text-primary" />
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
}
