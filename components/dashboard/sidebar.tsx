'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Users, MessageSquare, BarChart3, Settings, GraduationCap, Clock, FileText, X } from 'lucide-react';

interface SidebarProps {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ user, open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: BarChart3,
      },
    ];

    if (user.roleId === 1) {
      // Admin
      return [
        ...baseItems,
        {
          href: '/dashboard/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: '/dashboard/roles',
          label: 'Roles & Permissions',
          icon: Settings,
        },
        {
          href: '/dashboard/announcements',
          label: 'Announcements',
          icon: FileText,
        },
        {
          href: '/dashboard/activity',
          label: 'Activity Logs',
          icon: Clock,
        },
      ];
    } else if (user.roleId === 2) {
      // Teacher
      return [
        ...baseItems,
        {
          href: '/dashboard/courses',
          label: 'My Courses',
          icon: BookOpen,
        },
        {
          href: '/dashboard/students',
          label: 'Students',
          icon: GraduationCap,
        },
        {
          href: '/dashboard/grades',
          label: 'Grades',
          icon: FileText,
        },
        {
          href: '/dashboard/messages',
          label: 'Messages',
          icon: MessageSquare,
        },
      ];
    } else if (user.roleId === 3) {
      // Student
      return [
        ...baseItems,
        {
          href: '/dashboard/courses',
          label: 'My Courses',
          icon: BookOpen,
        },
        {
          href: '/dashboard/grades',
          label: 'My Grades',
          icon: FileText,
        },
        {
          href: '/dashboard/attendance',
          label: 'Attendance',
          icon: Clock,
        },
        {
          href: '/dashboard/messages',
          label: 'Messages',
          icon: MessageSquare,
        },
      ];
    } else if (user.roleId === 4) {
      // Parent
      return [
        ...baseItems,
        {
          href: '/dashboard/child-progress',
          label: 'Child&apos;s Progress',
          icon: GraduationCap,
        },
        {
          href: '/dashboard/announcements',
          label: 'Announcements',
          icon: FileText,
        },
        {
          href: '/dashboard/messages',
          label: 'Messages',
          icon: MessageSquare,
        },
      ];
    } else {
      // Staff
      return [
        ...baseItems,
        {
          href: '/dashboard/announcements',
          label: 'Announcements',
          icon: FileText,
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">EduSystem</span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="lg:hidden p-1 hover:bg-muted rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border space-y-2">
            <p className="text-sm font-medium truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
