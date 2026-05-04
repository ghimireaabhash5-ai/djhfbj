'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Grade {
  id: number;
  studentName: string;
  assignmentTitle: string;
  score: number;
  maxPoints: number;
  feedback: string;
  gradedAt: number;
  gradedByName: string;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await fetch('/api/grades');
      if (response.ok) {
        const data = await response.json();
        setGrades(data.grades);
        
        if (data.grades.length > 0) {
          const avg = data.grades.reduce((sum: number, g: Grade) => sum + (g.score / g.maxPoints * 100), 0) / data.grades.length;
          setAverageScore(Math.round(avg));
        }
      }
    } catch (error) {
      toast.error('Failed to fetch grades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grades</h1>
        <p className="text-muted-foreground">View your grades and assignments</p>
      </div>

      {/* Average Score Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getGradeColor(averageScore)}`}>
            {averageScore}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">Based on {grades.length} assignments</p>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Grades</CardTitle>
          <CardDescription>Your scores and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading grades...</div>
          ) : grades.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No grades available yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Graded By</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => {
                    const percentage = Math.round((grade.score / grade.maxPoints) * 100);
                    return (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.assignmentTitle}</TableCell>
                        <TableCell>
                          {grade.score} / {grade.maxPoints}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getGradeColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {grade.gradedByName}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {grade.feedback || '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
