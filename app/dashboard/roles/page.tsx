'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
      }
    } catch (error) {
      toast.error('Failed to fetch roles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      Admin: 'bg-red-100 text-red-800',
      Teacher: 'bg-blue-100 text-blue-800',
      Student: 'bg-green-100 text-green-800',
      Parent: 'bg-purple-100 text-purple-800',
      Staff: 'bg-gray-100 text-gray-800',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage system roles and their permissions</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading roles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      {role.name}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <Badge className={getRoleColor(role.name)}>{role.name}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.length === 1 && role.permissions[0] === 'all' ? (
                      <Badge variant="outline" className="bg-red-50">
                        All Permissions
                      </Badge>
                    ) : role.permissions.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No specific permissions</p>
                    ) : (
                      role.permissions.map((perm) => (
                        <Badge key={perm} variant="outline">
                          {perm.replace(/_/g, ' ')}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
