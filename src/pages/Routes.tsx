import { Route as RouteIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Routes() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Routes</h1>
        <p className="text-muted-foreground mt-1">Manage bus routes and schedules</p>
      </div>

      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Route Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <RouteIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Routes Management</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create and manage bus routes with multiple stops
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
