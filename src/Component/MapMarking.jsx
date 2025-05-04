import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { UserRound, Heart } from 'lucide-react';

const createIcon = (type) => {
  const svg = type === 'victim' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    // stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    // <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    //  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`;

  const color = type === 'victim' ? '#ef4444' : '#3b82f6';
  const svgStr = svg.replace('currentColor', color);
  const svgBase64 = btoa(svgStr);

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${svgBase64}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function MapMarker({ location }) {
  const icon = createIcon(location.type);

  return (
    <Marker position={location.position} icon={icon}>
      <Popup>
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            {location.type === 'victim' ? (
              <Heart className="w-5 h-5 text-red-500" />
            ) : (
              <UserRound className="w-5 h-5 text-blue-500" />
            )}
            <h3 className="font-semibold">{location.name}</h3>
          </div>
          <p className="text-sm text-gray-600">{location.details}</p>
        </div>
      </Popup>
    </Marker>
  );
}