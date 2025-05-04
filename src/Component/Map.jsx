import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapMarker from "./MapMarking";

// Mock data - replace with actual API calls
const mockLocations = [
  {
    id: "1",
    type: "victim",
    position: [30.7128, 76.006],
    name: "John Doe",
    details: "Needs medical assistance and food supplies",
  },
  {
    id: "2",
    type: "volunteer",
    position: [33.715, 76.008],
    name: "Jane Smith",
    details: "Medical professional, available 24/7",
  },
  {
    id: "3",
    type: "victim",
    position: [28.714, 76.003],
    name: "Mike Johnson",
    details: "Requires evacuation assistance",
  },
];

export default function Map() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchLocations = () => {
      setLocations(mockLocations);
    };

    fetchLocations();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchLocations, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" border-y-[0.5px] border-gray-400 p-1 pt-4 w-[50vw] h-[400px] overflow-hidden shadow-lg z-0">
      <MapContainer
        center={[30.7128, 76.006]}
        zoom={9}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <MapMarker key={location.id} location={location} />
        ))}
      </MapContainer>
    </div>
  );
}
