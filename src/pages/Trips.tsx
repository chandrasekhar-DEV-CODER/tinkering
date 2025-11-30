import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Trips() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Trip History</h1>
        <p className="text-muted-foreground mt-1">View past trips and analytics</p>
      </div>

      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Trip Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Trip History</p>
            <p className="text-sm text-muted-foreground mt-2">
              View completed trips and replay routes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
