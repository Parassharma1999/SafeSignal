import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import VictimRequestCard from "../Component/VictimRequestCard";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const victimIcon = L.divIcon({
  html: '<div class="bg-red-500 rounded-full p-2 border-2 border-white shadow-lg"><div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div></div>',
  className: "victim-marker",
  iconSize: [20, 20],
});

const volunteerIcon = L.divIcon({
  html: '<div class="bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>',
  className: "volunteer-marker",
  iconSize: [32, 32],
});

const MapVictimComponent = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const markersRef = useRef([]);
  const [allVictims, setAllVictims] = useState([]);
  const [volunteerCords, setVolunteerCords] = useState({});
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [trigger, setTrigger] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    distanceRange: searchParams.get("distanceRange") || 100,
    needs: searchParams.get("needs")
      ? searchParams.get("needs").split(",")
      : ["food and water"],
    disasters: searchParams.get("disasters")
      ? searchParams.get("disasters").split(",")
      : ["flood"],
  });

  const availableNeeds = [
    "food and water",
    "shelter",
    "medical assistance",
    "clothing",
    "hygiene kits",
  ];

  const disasterType = [
    "flood",
    "cyclone",
    "Earthquake",
    "tsunami",
    "draught",
    "landslide",
    "wildfire",
    "avalanche",
  ];

  useEffect(() => {
    if (allVictims.length > 0 || volunteerCords.lat) {
      if (!mapRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current).setView(
        [volunteerCords.lat, volunteerCords.lng],
        13
      );

      // Add base layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      markersRef.current.mapInstance = map;

      // Add victim marker
      const volunteerMarker = L.marker(
        [volunteerCords.lat, volunteerCords.lng],
        {
          icon: volunteerIcon,
        }
      )
        .bindPopup(
          "<b>You</b><br>Click on red dot markers to get more details about raised requests."
        )
        .addTo(map);
      markersRef.current.push(volunteerMarker);

      // Add volunteer markers
      allVictims.forEach((victim) => {
        console.log("Victim => ", victim);
        const popupContent = `
              <div style="font-family: Arial, sans-serif; padding: 5px;">
                <h3 style=" font-size: 16px; color: #333;">${victim?.victimInfo?.name}</h3>
                <h3 style="font-size: 12px; color: #333;">${victim?.victimInfo?.email}</h3>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Needs:</strong> ${victim?.requestDetails?.immediateNeeds}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Disaster:</strong> ${victim?.requestDetails?.numberOfPeople}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Number of people:</strong> ${victim?.requestDetails?.numberOfPeople}</p>
                <p style="margin: 4px 0; color:blue; display:flex; justify-content:center; font-size: 14px;">${victim?.status}</p>
                <!--<p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${victim?.victimInfo?.phone}">${victim?.victimInfo?.phone}</a></p>-->
              </div>
            `;

        const marker = L.marker(
          [victim.location.coordinates[0], victim.location.coordinates[1]],
          {
            icon: victimIcon,
          }
        )
          .bindPopup(popupContent)
          .addTo(map)
          .on("click", () => setSelectedVictim(victim));

        markersRef.current.push(marker);
      });

      return () => {
        map.remove();
      };
    }
  }, [allVictims]);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setVolunteerCords({ lat: latitude, lng: longitude });
        const lat = latitude;
        const lng = longitude;
        if (lat && lng) {
          findVictims(lat, lng);
        }
      },
      (error) => {
        alert("Error getting location: " + error.message);
      }
    );
  }, [trigger]);

  const findVictims = async (lat, long) => {
    try {
      const volunteers = await axios.post(
        "http://localhost:3000/search-victims",
        { lat, long }
      );
      setAllVictims(volunteers.data?.data);
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  useEffect(() => {
    const map = markersRef.current.mapInstance;
    if (!map || !selectedVictim) return;

    // Remove existing route if any
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    // Add route from volunteer to selected victim
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(volunteerCords.lat, volunteerCords.lng),
        L.latLng(
          selectedVictim.location.coordinates[0],
          selectedVictim.location.coordinates[1]
        ),
      ],
      routeWhileDragging: true,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      lineOptions: {
        styles: [{ color: "#007bff", weight: 6 }],
      },
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }
    };
  }, [selectedVictim]);

  const handleFilterSearch = async () => {
    const params = {
      ...filters,
      lat: volunteerCords.lat,
      lng: volunteerCords.lng,
    };

    setSearchParams(params);

    try {
      const res = await axios.get("http://localhost:3000/search-victims", {
        params,
      });
      if (res.data?.success) {
        const victims = res.data?.data;
        console.log("victoms - ", victims);
        setAllVictims(victims);
      }
    } catch (error) {
      console.error("Error filtering victims:", error);
    }
  };

  useEffect(() => {
    setSearchParams(filters);
  }, [filters, searchParams]);

  return (
    <div className="flex min-h-[100vh]">
      {/* Sidebar */}
      <div className="w-80 bg-white p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Filter Help Requests</h2>

        <div className="space-y-6">
          {/* Distance Filter */}
          <div>
            <label className="block mb-2">
              Distance (km): {filters.distanceRange}
            </label>
            <input
              type="range"
              min="1"
              max="500"
              value={filters.distanceRange}
              onChange={(e) =>
                setFilters({ ...filters, distanceRange: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Needs Filter */}
          <div>
            <h3 className="font-semibold mb-2">Essential Needs</h3>
            {availableNeeds.map((need) => (
              <label key={need} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={filters.needs.includes(need)}
                  onChange={(e) => {
                    const needs = e.target.checked
                      ? [...filters.needs, need]
                      : filters.needs.filter((s) => s !== need);
                    console.log("needs selected = ", needs);
                    setFilters({ ...filters, needs });
                  }}
                />
                <span className="capitalize">{need}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Disaster Type</h3>
            {disasterType.map((disaster) => (
              <label
                key={disaster}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  checked={filters.disasters.includes(disaster)}
                  onChange={(e) => {
                    const disasters = e.target.checked
                      ? [...filters.disasters, disaster]
                      : filters.disasters.filter((s) => s !== disaster);
                    console.log("needs selected = ", disaster);
                    setFilters({ ...filters, disasters });
                  }}
                />
                <span className="capitalize">{disaster}</span>
              </label>
            ))}
          </div>

          {/* Search Button */}
          <button
            onClick={handleFilterSearch}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Search Victims
          </button>

          {/* Results Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Search Results</h3>
            <p className="text-lg">
              Total Victims Found:{" "}
              <span className="font-bold">
                {allVictims.filter((item) => item.status == "pending").length}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Map */}
        <div ref={mapRef} className="flex-1 h-[60vh] z-0" />

        {/* Victims List */}
        <div className=" p-4 bg-white border-t">
          <h3 className="text-xl font-bold mb-4">Help Requests Nearby you</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[30vh] md:max-h-[40vh] overflow-y-auto">
            {allVictims.filter((item) => item.status == "pending").length > 0 ||
            allVictims.length === 0 ? (
              allVictims.map(
                (victim) =>
                  victim.status == "pending" && (
                    <VictimRequestCard
                      key={victim.id}
                      request={victim}
                      allVictims={allVictims}
                      setAllVictims={setAllVictims}
                      setSelectedVictim={setSelectedVictim}
                      selectedVictim={selectedVictim}
                      setTrigger={setTrigger}
                    />
                  )
              )
            ) : (
              <p className="text-gray-500">
                No Help Request found in your area
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVictimComponent;
