import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Stops() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Stops</h1>
        <p className="text-muted-foreground mt-1">Manage bus stop locations</p>
      </div>

      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Stop Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Bus Stops</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add and manage bus stop locations along routes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
