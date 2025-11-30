/**
 * Mapbox Configuration
 * 
 * This file contains Mapbox settings for the live GPS tracking map.
 * Uses dark theme (dark-v11) as specified in requirements.
 */

export const MAPBOX_CONFIG = {
  // Access token from environment variables
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoia2FydGhpazAzNjkiLCJhIjoiY21nZXU2YjIxMDFlOTJqcjRmaXZzMDFpYSJ9.xQWX7u_F44C3-4sFhuibIg',
  
  // Map style - using dark theme for cyber-dark aesthetic
  style: import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/dark-v11',
  
  // Default map center (can be overridden)
  defaultCenter: {
    lng: -122.4194, // San Francisco (default)
    lat: 37.7749
  },
  
  // Default zoom level
  defaultZoom: 12,
  
  // Map bounds (optional - restrict map area)
  maxBounds: undefined,
  
  // Minimum and maximum zoom levels
  minZoom: 8,
  maxZoom: 18,
  
  // Enable 3D terrain
  terrain: false,
  
  // Enable pitch (3D tilt)
  pitch: 0,
  
  // Enable bearing (rotation)
  bearing: 0,
  
  // Animation settings
  animationDuration: 1000, // milliseconds
  
  // GPS tracking settings
  gpsTracking: {
    updateInterval: 10000, // 10 seconds (as per requirements)
    accuracyThreshold: 50, // meters
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  },
  
  // Vehicle marker settings
  vehicleMarker: {
    size: 40,
    color: '#10b981', // Neon green (theme color)
    pulseColor: '#10b981',
    pulseOpacity: 0.4,
    rotationEnabled: true // Rotate based on heading
  },
  
  // Stop marker settings
  stopMarker: {
    size: 30,
    color: '#3b82f6', // Blue
    borderColor: '#1e293b'
  },
  
  // Route line settings
  routeLine: {
    color: '#10b981',
    width: 4,
    opacity: 0.8
  },
  
  // Geofence settings (1km radius as per requirements)
  geofence: {
    radius: 1000, // meters
    color: '#10b981',
    opacity: 0.2,
    borderColor: '#10b981',
    borderWidth: 2
  },
  
  // Cluster settings for multiple vehicles
  clustering: {
    enabled: true,
    radius: 50,
    maxZoom: 14
  },
  
  // Popup settings
  popup: {
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px'
  }
};

/**
 * Map style options
 */
export const MAP_STYLES = {
  DARK: 'mapbox://styles/mapbox/dark-v11',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
  NAVIGATION_DAY: 'mapbox://styles/mapbox/navigation-day-v1',
  NAVIGATION_NIGHT: 'mapbox://styles/mapbox/navigation-night-v1'
};

/**
 * Get Mapbox access token
 */
export function getMapboxToken(): string {
  const token = MAPBOX_CONFIG.accessToken;
  
  if (!token || token === 'your_mapbox_token_here') {
    console.warn('⚠️ Mapbox access token not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in .env file.');
  }
  
  return token;
}

/**
 * Validate Mapbox token format
 */
export function isValidMapboxToken(token: string): boolean {
  return token.startsWith('pk.') && token.length > 20;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if a point is within geofence radius
 */
export function isWithinGeofence(
  pointLat: number,
  pointLon: number,
  centerLat: number,
  centerLon: number,
  radiusMeters: number = MAPBOX_CONFIG.geofence.radius
): boolean {
  const distance = calculateDistance(pointLat, pointLon, centerLat, centerLon);
  return distance <= radiusMeters;
}

/**
 * Calculate bearing between two points
 * Returns bearing in degrees (0-360)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return bearing;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lon).toFixed(6)}°${lonDir}`;
}

/**
 * Convert speed from m/s to km/h
 */
export function metersPerSecondToKmh(speed: number): number {
  return speed * 3.6;
}

/**
 * Convert speed from m/s to mph
 */
export function metersPerSecondToMph(speed: number): number {
  return speed * 2.23694;
}

/**
 * Get map bounds from array of coordinates
 */
export function getBoundsFromCoordinates(
  coordinates: Array<{ lat: number; lng: number }>
): [[number, number], [number, number]] | null {
  if (coordinates.length === 0) return null;

  let minLat = coordinates[0].lat;
  let maxLat = coordinates[0].lat;
  let minLng = coordinates[0].lng;
  let maxLng = coordinates[0].lng;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLng = Math.min(minLng, coord.lng);
    maxLng = Math.max(maxLng, coord.lng);
  });

  return [
    [minLng, minLat],
    [maxLng, maxLat]
  ];
}

export default MAPBOX_CONFIG;
