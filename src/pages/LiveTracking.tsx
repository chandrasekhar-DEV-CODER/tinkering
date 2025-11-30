import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, Navigation, Activity } from 'lucide-react';
import { vehiclesApi, tripsApi } from '@/db/api';
import type { VehicleWithDriver, TripWithDetails } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function LiveTracking() {
  const [vehicles, setVehicles] = useState<VehicleWithDriver[]>([]);
  const [activeTrips, setActiveTrips] = useState<TripWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesData, tripsData] = await Promise.all([
        vehiclesApi.getByStatus('active'),
        tripsApi.getActive(),
      ]);
      setVehicles(vehiclesData);
      setActiveTrips(tripsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tracking data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64 bg-muted" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="h-[600px] xl:col-span-2 bg-muted" />
          <Skeleton className="h-[600px] bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Live Tracking</h1>
        <p className="text-muted-foreground mt-1">Real-time location of all active vehicles</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px] bg-secondary/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center space-y-4">
                <Bus className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Map Integration</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time map tracking will be displayed here
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Integrate with Mapbox, Google Maps, or OpenStreetMap
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <Badge key={vehicle.id} variant="outline" className="gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                      {vehicle.plate_number}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active vehicles
                </div>
              ) : (
                vehicles.map((vehicle) => {
                  const trip = activeTrips.find(t => t.vehicle_id === vehicle.id);
                  return (
                    <div
                      key={vehicle.id}
                      className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bus className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{vehicle.plate_number}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.model || 'Unknown model'}</p>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                      </div>
                      
                      {trip && (
                        <div className="mt-3 pt-3 border-t border-border space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Driver:</span>
                            <span className="font-medium">{trip.driver?.full_name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Route:</span>
                            <span className="font-medium">{trip.route?.name || 'No route'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                              In Progress
                            </Badge>
                          </div>
                        </div>
                      )}

                      {!trip && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground">No active trip</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="text-lg">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{vehicles.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Currently on the road</p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="text-lg">Active Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{activeTrips.length}</div>
            <p className="text-sm text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="text-lg">Average Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">45 km/h</div>
            <p className="text-sm text-muted-foreground mt-1">Fleet average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
