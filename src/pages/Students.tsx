import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Students() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Students</h1>
        <p className="text-muted-foreground mt-1">Manage student profiles and assignments</p>
      </div>

      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Student Profiles</p>
            <p className="text-sm text-muted-foreground mt-2">
              Manage student information and bus assignments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
