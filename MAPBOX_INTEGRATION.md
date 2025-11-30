# 🗺️ Mapbox Integration Guide

## Overview

This document explains the Mapbox integration for real-time GPS tracking and live map features in the My School Ride system.

---

## 🎯 Features

### Map Features
- ✅ Dark theme map (cyber-dark aesthetic)
- ✅ Real-time vehicle tracking
- ✅ Vehicle markers with rotation based on heading
- ✅ Pulse animation for moving vehicles
- ✅ Route visualization
- ✅ Bus stop markers
- ✅ Geofencing (1km radius)
- ✅ Distance and bearing calculations
- ✅ Smooth animations

### GPS Tracking Features
- ✅ 10-second update interval
- ✅ High accuracy mode
- ✅ Speed calculation
- ✅ Heading/bearing tracking
- ✅ Location history (breadcrumbs)
- ✅ Geofence notifications

---

## 📦 Installation

### Step 1: Install Mapbox GL JS

```bash
npm install mapbox-gl react-map-gl
npm install --save-dev @types/mapbox-gl
```

### Step 2: Install Additional Dependencies

```bash
# For map controls and utilities
npm install @mapbox/mapbox-gl-geocoder
npm install @turf/turf
```

### Step 3: Verify Environment Variables

Check `.env` file contains:

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoia2FydGhpazAzNjkiLCJhIjoiY21nZXU2YjIxMDFlOTJqcjRmaXZzMDFpYSJ9.xQWX7u_F44C3-4sFhuibIg
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/dark-v11
```

---

## 🚀 Quick Start

### Basic Map Component

```typescript
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG, getMapboxToken } from '@/config/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function LiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(MAPBOX_CONFIG.defaultCenter.lng);
  const [lat, setLat] = useState(MAPBOX_CONFIG.defaultCenter.lat);
  const [zoom, setZoom] = useState(MAPBOX_CONFIG.defaultZoom);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = getMapboxToken();

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: [lng, lat],
      zoom: zoom,
      pitch: MAPBOX_CONFIG.pitch,
      bearing: MAPBOX_CONFIG.bearing
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Update state on map move
    map.current.on('move', () => {
      if (!map.current) return;
      setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
      setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(map.current.getZoom().toFixed(2)));
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map info overlay */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
  );
}
```

### Adding Vehicle Markers

```typescript
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/mapbox';

interface Vehicle {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  status: 'moving' | 'stopped' | 'idle';
}

function addVehicleMarker(
  map: mapboxgl.Map,
  vehicle: Vehicle
): mapboxgl.Marker {
  // Create custom marker element
  const el = document.createElement('div');
  el.className = 'vehicle-marker';
  el.style.width = `${MAPBOX_CONFIG.vehicleMarker.size}px`;
  el.style.height = `${MAPBOX_CONFIG.vehicleMarker.size}px`;
  el.style.backgroundImage = 'url(/bus-icon.svg)';
  el.style.backgroundSize = 'contain';
  el.style.transform = `rotate(${vehicle.heading}deg)`;
  
  // Add pulse animation for moving vehicles
  if (vehicle.status === 'moving') {
    el.classList.add('pulse-animation');
  }

  // Create popup
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div class="p-2">
      <h3 class="font-bold">${vehicle.name}</h3>
      <p class="text-sm">Speed: ${vehicle.speed.toFixed(1)} km/h</p>
      <p class="text-sm">Status: ${vehicle.status}</p>
    </div>
  `);

  // Create and return marker
  return new mapboxgl.Marker(el)
    .setLngLat([vehicle.longitude, vehicle.latitude])
    .setPopup(popup)
    .addTo(map);
}

// Update marker position with animation
function updateVehicleMarker(
  marker: mapboxgl.Marker,
  vehicle: Vehicle
) {
  const el = marker.getElement();
  
  // Animate rotation
  el.style.transform = `rotate(${vehicle.heading}deg)`;
  
  // Animate position
  marker.setLngLat([vehicle.longitude, vehicle.latitude]);
  
  // Update popup
  const popup = marker.getPopup();
  if (popup) {
    popup.setHTML(`
      <div class="p-2">
        <h3 class="font-bold">${vehicle.name}</h3>
        <p class="text-sm">Speed: ${vehicle.speed.toFixed(1)} km/h</p>
        <p class="text-sm">Status: ${vehicle.status}</p>
      </div>
    `);
  }
}
```

### Drawing Routes

```typescript
function addRoute(
  map: mapboxgl.Map,
  routeId: string,
  coordinates: [number, number][]
) {
  // Add route source
  map.addSource(routeId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    }
  });

  // Add route layer
  map.addLayer({
    id: routeId,
    type: 'line',
    source: routeId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': MAPBOX_CONFIG.routeLine.color,
      'line-width': MAPBOX_CONFIG.routeLine.width,
      'line-opacity': MAPBOX_CONFIG.routeLine.opacity
    }
  });
}
```

### Adding Geofences

```typescript
function addGeofence(
  map: mapboxgl.Map,
  center: [number, number],
  radiusMeters: number = MAPBOX_CONFIG.geofence.radius
) {
  // Convert radius to degrees (approximate)
  const radiusDegrees = radiusMeters / 111320;

  map.addSource('geofence', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: center
      }
    }
  });

  // Add circle layer
  map.addLayer({
    id: 'geofence-circle',
    type: 'circle',
    source: 'geofence',
    paint: {
      'circle-radius': {
        stops: [
          [0, 0],
          [20, radiusDegrees * 111320]
        ],
        base: 2
      },
      'circle-color': MAPBOX_CONFIG.geofence.color,
      'circle-opacity': MAPBOX_CONFIG.geofence.opacity,
      'circle-stroke-color': MAPBOX_CONFIG.geofence.borderColor,
      'circle-stroke-width': MAPBOX_CONFIG.geofence.borderWidth
    }
  });
}
```

---

## 🎨 Styling

### CSS for Vehicle Markers

Add to your global CSS:

```css
/* Vehicle marker pulse animation */
.vehicle-marker {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.vehicle-marker.pulse-animation::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Mapbox popup styling */
.mapboxgl-popup-content {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 0;
}

.mapboxgl-popup-close-button {
  color: hsl(var(--foreground));
  font-size: 20px;
  padding: 4px;
}

.mapboxgl-popup-close-button:hover {
  background: hsl(var(--accent));
}
```

---

## 🔧 Configuration

### Map Styles

Available map styles in `MAPBOX_CONFIG`:

```typescript
import { MAP_STYLES } from '@/config/mapbox';

// Use different styles
const darkStyle = MAP_STYLES.DARK;           // Default
const lightStyle = MAP_STYLES.LIGHT;
const satelliteStyle = MAP_STYLES.SATELLITE;
const navigationStyle = MAP_STYLES.NAVIGATION_NIGHT;
```

### GPS Tracking Settings

Configure in `MAPBOX_CONFIG.gpsTracking`:

```typescript
{
  updateInterval: 10000,      // Update every 10 seconds
  accuracyThreshold: 50,      // 50 meters
  enableHighAccuracy: true,   // Use GPS
  timeout: 5000,              // 5 second timeout
  maximumAge: 0               // Don't use cached position
}
```

### Geofence Settings

Configure in `MAPBOX_CONFIG.geofence`:

```typescript
{
  radius: 1000,              // 1km radius
  color: '#10b981',          // Neon green
  opacity: 0.2,
  borderColor: '#10b981',
  borderWidth: 2
}
```

---

## 📊 Utility Functions

### Calculate Distance

```typescript
import { calculateDistance } from '@/config/mapbox';

const distance = calculateDistance(
  37.7749, -122.4194,  // San Francisco
  34.0522, -118.2437   // Los Angeles
);

console.log(`Distance: ${(distance / 1000).toFixed(2)} km`);
```

### Calculate Bearing

```typescript
import { calculateBearing } from '@/config/mapbox';

const bearing = calculateBearing(
  37.7749, -122.4194,  // From
  34.0522, -118.2437   // To
);

console.log(`Bearing: ${bearing.toFixed(2)}°`);
```

### Check Geofence

```typescript
import { isWithinGeofence } from '@/config/mapbox';

const isInside = isWithinGeofence(
  37.7749, -122.4194,  // Point to check
  37.7750, -122.4195,  // Geofence center
  1000                 // Radius in meters
);

console.log(`Inside geofence: ${isInside}`);
```

### Format Coordinates

```typescript
import { formatCoordinates } from '@/config/mapbox';

const formatted = formatCoordinates(37.7749, -122.4194);
console.log(formatted); // "37.774900°N, 122.419400°W"
```

### Convert Speed

```typescript
import { metersPerSecondToKmh, metersPerSecondToMph } from '@/config/mapbox';

const speedMs = 15; // 15 m/s
const speedKmh = metersPerSecondToKmh(speedMs);
const speedMph = metersPerSecondToMph(speedMs);

console.log(`Speed: ${speedKmh.toFixed(1)} km/h (${speedMph.toFixed(1)} mph)`);
```

---

## 🔄 Real-time Updates

### Using Firebase Realtime Database

```typescript
import { realtimeDb } from '@/config/firebase';
import { ref, onValue } from 'firebase/database';

function subscribeToVehicleUpdates(
  vehicleId: string,
  callback: (location: any) => void
) {
  const locationRef = ref(realtimeDb, `gps_tracking/${vehicleId}`);
  
  return onValue(locationRef, (snapshot) => {
    const location = snapshot.val();
    if (location) {
      callback(location);
    }
  });
}

// Usage
const unsubscribe = subscribeToVehicleUpdates('vehicle-123', (location) => {
  console.log('Vehicle location updated:', location);
  // Update marker on map
  updateVehicleMarker(marker, {
    id: 'vehicle-123',
    name: 'Bus 001',
    latitude: location.latitude,
    longitude: location.longitude,
    heading: location.heading,
    speed: location.speed,
    status: location.speed > 0 ? 'moving' : 'stopped'
  });
});

// Cleanup
unsubscribe();
```

---

## 🧪 Testing

### Test Map Initialization

```typescript
import { getMapboxToken, isValidMapboxToken } from '@/config/mapbox';

// Check token
const token = getMapboxToken();
console.log('Token valid:', isValidMapboxToken(token));
```

### Test Geospatial Functions

```typescript
import { 
  calculateDistance, 
  calculateBearing,
  isWithinGeofence 
} from '@/config/mapbox';

// Test distance calculation
const dist = calculateDistance(0, 0, 0, 1);
console.log('Distance (0,0) to (0,1):', dist, 'meters');

// Test bearing calculation
const bearing = calculateBearing(0, 0, 1, 1);
console.log('Bearing (0,0) to (1,1):', bearing, 'degrees');

// Test geofence
const inside = isWithinGeofence(0, 0, 0, 0, 1000);
console.log('Point inside geofence:', inside);
```

---

## 📚 Resources

### Mapbox Documentation
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/example/)

### Tutorials
- [Getting Started with Mapbox](https://docs.mapbox.com/help/tutorials/get-started-mapbox-gl-js/)
- [Add Custom Markers](https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/)
- [Animate Markers](https://docs.mapbox.com/mapbox-gl-js/example/animate-marker/)

---

## 🐛 Troubleshooting

### Map Not Loading

**Issue:** Map container is blank

**Solutions:**
1. Check Mapbox token is valid
2. Verify `mapbox-gl.css` is imported
3. Ensure map container has height set
4. Check browser console for errors

### Markers Not Appearing

**Issue:** Vehicle markers don't show on map

**Solutions:**
1. Verify coordinates are valid (lat: -90 to 90, lng: -180 to 180)
2. Check marker is added after map loads
3. Verify marker element has size set
4. Check z-index of marker

### Performance Issues

**Issue:** Map is slow with many markers

**Solutions:**
1. Enable clustering for multiple markers
2. Use GeoJSON sources instead of individual markers
3. Limit number of visible markers
4. Use map bounds to filter markers
5. Implement marker recycling

---

## ✅ Checklist

### Setup
- [x] Mapbox token added to `.env`
- [x] Mapbox configuration file created
- [ ] Install `mapbox-gl` package
- [ ] Install `react-map-gl` package
- [ ] Import Mapbox CSS

### Implementation
- [ ] Create LiveMap component
- [ ] Add vehicle markers
- [ ] Implement GPS tracking
- [ ] Add route visualization
- [ ] Add geofencing
- [ ] Add realtime updates

### Testing
- [ ] Test map initialization
- [ ] Test marker placement
- [ ] Test GPS updates
- [ ] Test geofence calculations
- [ ] Test on mobile devices

---

**Status:** Configuration Complete ✅  
**Next Step:** Install Mapbox packages  
**Command:** `npm install mapbox-gl react-map-gl @types/mapbox-gl`

---

**Last Updated:** 2025-11-30  
**Version:** 1.0.0
