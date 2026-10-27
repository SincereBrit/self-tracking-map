'use client';

import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const createMarkerIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:9999px;border:3px solid white;box-shadow:0 0 0 4px rgba(255,255,255,0.12);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

function CenterMap({ position }) {
  const map = useMap();

  if (position) {
    map.setView([position.lat, position.lng], 16, { animate: true });
  }

  return null;
}

export default function TrackingMap({ route, latestPosition }) {
  const defaultCenter = [20.5937, 78.9629];
  const polylinePoints = route.map((point) => [point.lat, point.lng]);

  return (
    <div className="map-container">
      <MapContainer center={defaultCenter} zoom={3} scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {polylinePoints.length > 1 && (
          <Polyline positions={polylinePoints} pathOptions={{ color: '#38bdf8', weight: 6 }} />
        )}

        {latestPosition && (
          <Marker position={[latestPosition.lat, latestPosition.lng]} icon={createMarkerIcon('#22c55e')} />
        )}

        <CenterMap position={latestPosition} />
      </MapContainer>
    </div>
  );
}
