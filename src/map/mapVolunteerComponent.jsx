import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";
import logo from "../assets/images-disaster/Logo.png";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../baseurl";

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

// Custom Icons for Victim & Volunteers
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

const MapVolunteerComponent = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const markersRef = useRef([]);
  const [allVolunteers, setAllVolunteers] = useState([]);
  // const [routeInfo, setRouteInfo] = useState(null);
  const [victimCords, setVictimCords] = useState({});
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    distanceRange: searchParams.get("distanceRange") || 100, // in km
    services: searchParams.get("services")
      ? searchParams.get("services").split(",")
      : ["food and water"],
    availability: searchParams.get("availability") || "All",
  });

  const availableServices = [
    "food and water",
    "shelter support",
    "medical and health services",
    "search and rescue",
    "communication and it",
    "logistics and transportation",
  ];

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    console.log("cal - ", dLat, dLon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.ceil(R * c); // Distance in km
  }

  useEffect(() => {
    if (allVolunteers.length > 0 || victimCords.lat) {
      if (!mapRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current).setView(
        [victimCords.lat, victimCords.lng],
        13
      );

      // Add base layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      markersRef.current.mapInstance = map;

      // Add victim marker
      const victimMarker = L.marker([victimCords.lat, victimCords.lng], {
        icon: victimIcon,
      })
        .bindPopup("<b>You</b><br>Click on a volunteer to get more details.")
        .addTo(map);
      markersRef.current.push(victimMarker);

      // Add volunteer markers
      allVolunteers.forEach((volunteer) => {
        const popupContent = `
              <div style="font-family: Arial, sans-serif; padding: 5px;">
                <h3 style="margin: 0; font-size: 16px; color: #333;">${volunteer?.name}</h3>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Services:</strong> ${volunteer?.expertise}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Team Size:</strong> ${volunteer?.teamsize}</p>
                <!-- <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${volunteer.phone}">${volunteer.phone}</a></p>-->
              </div>
            `;

        const marker = L.marker(
          [
            volunteer.location.coordinates[1],
            volunteer.location.coordinates[0],
          ],
          {
            icon: volunteerIcon,
          }
        )
          .bindPopup(popupContent)
          .addTo(map)
          .on("click", () => setSelectedVolunteer(volunteer));

        markersRef.current.push(marker);
      });

      return () => {
        map.remove();
      };
    }
  }, [allVolunteers]);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Your browser does not support Automatic location");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setVictimCords({ lat, lng });

      if (lat && lng) {
        findVolunteers(lat, lng);
      }
    });
  }, []);

  const findVolunteers = async (lat, long) => {
    try {
      const volunteers = await axios.post(`${baseURL}/search-volunteers`, {
        lat,
        long,
      });
      setAllVolunteers(volunteers.data?.data);
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  useEffect(() => {
    const map = markersRef.current.mapInstance;
    if (!map || !selectedVolunteer) return;

    // Remove existing route if any
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    // Add route from victim to selected volunteer
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(victimCords.lat, victimCords.lng),
        L.latLng(
          selectedVolunteer.location.coordinates[1],
          selectedVolunteer.location.coordinates[0]
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
  }, [selectedVolunteer]);

  useEffect(() => {
    setSearchParams(filters);
  }, [filters, searchParams]);

  const handleFilterSearch = async () => {
    setAllVolunteers([]);
    searchParams.set("lat", victimCords.lat);
    searchParams.set("lng", victimCords.lng);

    const params = {
      ...filters,
      lat: victimCords.lat,
      lng: victimCords.lng,
    };

    try {
      const res = await axios.get(`${baseURL}/search-volunteers`, {
        params,
      });
      setAllVolunteers(res.data?.data);
    } catch (error) {
      console.log("Error while fetching volunteers => ", error);
    }
  };

  const raiseRequestHandler = (volunteer) => {
    navigate("/victim/form", { state: { volunteer } });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Filter Sidebar - Improved */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-80 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Filter Volunteers
          </h2>
          <button
            // onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset All
          </button>
        </div>

        <div className="space-y-6">
          {/* Distance Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Distance
              </label>
              <span className="text-sm font-medium text-blue-600">
                {filters.distanceRange} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              value={filters.distanceRange}
              onChange={(e) =>
                setFilters({ ...filters, distanceRange: e.target.value })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>500 km</span>
            </div>
          </div>

          {/* Services Filter - Improved Multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Needed
            </label>
            <div className="space-y-2">
              {availableServices.map((service) => (
                <div key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service)}
                    onChange={(e) => {
                      const services = e.target.checked
                        ? [...filters.services, service]
                        : filters.services.filter((s) => s !== service);
                      console.log("services selected = ", services);
                      setFilters({ ...filters, services });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`service-${service}`}
                    className="ml-2 text-sm text-gray-700 capitalize"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["All", "Available", "Busy"].map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setFilters({ ...filters, availability: option })
                  }
                  className={`py-1 px-3 rounded-full text-sm ${
                    filters.availability === option
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleFilterSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-5 flex-1">
        {/* Map Section */}
        <div
          ref={mapRef}
          className="flex flex-1 z-0  min-h-[40vh] max-h-[50vh] md:min-h-[60vh] md:max-h-[70vh] w-full rounded-lg shadow-md border border-gray-200"
        />

        {/* Volunteers List */}
        {allVolunteers.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Available Volunteers ({allVolunteers.length})
            </h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-[40vh] overflow-y-auto p-2">
              {allVolunteers.map((volunteer, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedVolunteer(volunteer)}
                  className={`border rounded-lg p-3 hover:shadow-md transition-shadow ${
                    selectedVolunteer === volunteer &&
                    `border-2 border-blue-400`
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={volunteer.image || logo}
                        alt={volunteer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {volunteer.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {volunteer.expertise.slice(0, 3).map((skill, id) => (
                          <span
                            key={id}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {volunteer.expertise.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            +{volunteer.expertise.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        {victimCords.lat &&
                          victimCords.lng &&
                          volunteer.location?.coordinates[0] &&
                          volunteer.location?.coordinates[1] && (
                            <span className="text-sm text-gray-500">
                              {calculateDistance(
                                victimCords.lat,
                                victimCords.lng,
                                volunteer.location?.coordinates[1],
                                volunteer.location?.coordinates[0]
                              )}
                              km away approx. (use Map for precise location)
                            </span>
                          )}
                        <button
                          onClick={() => raiseRequestHandler(volunteer)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition"
                        >
                          Request Help
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 font-medium">
              No volunteers found matching your criteria. Try adjusting your
              filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapVolunteerComponent;
