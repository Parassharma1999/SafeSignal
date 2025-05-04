import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function VolunteerForm() {
  const [error, setError] = useState({});
  const [showLocation, setShowLocation] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: {
      type: "Point",
      coordinates: [],
    },
    teamsize: "",
    phoneNumber: "",
    dateAndTime: "",
    expertise: "",
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Your browser does not support Automatic location");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      setFormData((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [long, lat],
        },
      }));

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`
        );
        console.log("location", response.data.display_name);

        setShowLocation(response.data.display_name);
      } catch (error) {
        console.error(" Not able to fetch address: ", error);
      }
    });
  }, []);

  async function PostingSignup() {
    console.log("Fomr Data=> ", formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/volunteer/form",
        formData,

        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("successfully submitted", response.data);
        toast.success("successfully submitted");

        navigate("/map/victim");

        setFormData({
          name: "",
          location: {
            type: "Point",
            coordinates: [],
          },
          teamsize: "",
          dateAndTime: "",
          expertise: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "You are not logged In!");
    } finally {
      setLoader(false);
    }
  }

  let countError = {};
  function Validation() {
    if (!showLocation) {
      countError.location = " Select allow to track your location ";
    }
    if (
      !formData.teamsize ||
      formData.teamsize < 1 ||
      formData.teamsize > 1000 ||
      isNaN(formData.teamsize)
    ) {
      countError.teamsize = "Enter the correct numbers of team member";
    }
    setError(countError);
    return Object.keys(countError).length === 0;
  }

  function HandleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function HandleSubmit(e) {
    e.preventDefault();
    setLoader();
    if (Validation()) {
      PostingSignup();
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 justify-center items-center p-4">
      <div className="w-full max-w-[100rem] flex flex-col lg:flex-row gap-8">
        {/* Information Section */}
        <div className="lg:w-2/5 bg-white p-8 rounded-xl shadow-lg border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-sky-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-sky-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-sky-900">
              Join Our Volunteer Network
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-sky-50 p-5 rounded-lg border border-sky-100">
              <h3 className="text-xl font-semibold text-sky-800 mb-3">
                Why Volunteer With Us?
              </h3>
              <p className="text-gray-700 mb-3">
                Your skills and time can make a real difference in emergency
                situations. Volunteers are the backbone of our disaster response
                efforts.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Directly impact lives in critical moments</li>
                <li>Receive specialized training</li>
                <li>Join a network of dedicated responders</li>
                <li>Gain valuable emergency experience</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                What We Provide
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Comprehensive orientation</li>
                <li>Safety equipment and training</li>
                <li>24/7 support during operations</li>
                <li>Recognition for your service</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">
                Commitment
              </h3>
              <p className="text-gray-700">
                We ask for a minimum 6-month commitment with availability during
                emergencies. Flexible opportunities also available for
                specialized roles.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-3/5 h-fit p-8 sm:p-10 rounded-xl shadow-xl bg-white border border-white/20">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h1 className="text-4xl text-sky-900 font-bold mb-3">
              Volunteer Registration
            </h1>
            <p className="text-gray-600 max-w-md">
              Complete this form to join our network of emergency responders.
              We'll contact you within 48 hours to discuss next steps.
            </p>
          </div>

          <form onSubmit={HandleSubmit} className="mt-2 space-y-6">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 pl-1"
              >
                Organization/Individual Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) => HandleChange(e)}
                className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                placeholder="Your name or organization"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 pl-1"
              >
                Location
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={showLocation ? showLocation : ""}
                placeholder="Your current location"
                className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                required
              />
              {error.location && (
                <p className="text-sm text-red-500 pl-1">{error.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="dateAndTime"
                  className="text-sm font-medium text-gray-700 pl-1"
                >
                  Availability Start Date
                </label>
                <input
                  type="datetime-local"
                  name="dateAndTime"
                  id="dateAndTime"
                  value={formData.dateAndTime}
                  required
                  onChange={(e) => HandleChange(e)}
                  className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="teamsize"
                  className="text-sm font-medium text-gray-700 pl-1"
                >
                  Team Size
                </label>
                <input
                  type="number"
                  name="teamsize"
                  id="teamsize"
                  value={formData.teamsize}
                  onChange={(e) => HandleChange(e)}
                  placeholder="Number of volunteers"
                  className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                  required
                />
              </div>
            </div>
            {/* 
            <div className="flex flex-col gap-1">
              <label
                htmlFor="dateAndTime"
                className="text-sm font-medium text-gray-700 pl-1"
              >
                Availability Start Date
              </label>
              <input
                type="datetime-local"
                name="dateAndTime"
                id="dateAndTime"
                value={formData.dateAndTime}
                required
                onChange={(e) => HandleChange(e)}
                className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
              />
            </div> */}

            <div className="flex flex-col gap-1">
              <label
                htmlFor="expertise"
                className="text-sm font-medium text-gray-700 pl-1"
              >
                Area of Expertise
              </label>
              <select
                name="expertise"
                id="expertise"
                value={formData.expertise}
                onChange={(e) => HandleChange(e)}
                required
                className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm appearance-none bg-white"
              >
                <option value="" disabled selected>
                  Select your primary skill area
                </option>
                <option value="Medical and Health Services">
                  Medical and Health Services
                </option>
                <option value="Search and Rescue">Search and Rescue</option>
                <option value="Shelter support">Shelter support</option>
                <option value="Food and Water">Food and Water</option>
                <option value="Communication and IT">
                  Communication and IT
                </option>
              </select>
            </div>

            <div className="pt-4">
              <button
                disabled={loader}
                className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-50 flex justify-center items-center"
                type="submit"
              >
                {loader ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Become a Volunteer
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              By submitting, you agree to our{" "}
              <a href="#" className="text-sky-600 hover:underline">
                Terms of Service
              </a>{" "}
              and
              <a href="#" className="text-sky-600 hover:underline">
                {" "}
                Privacy Policy
              </a>
              .
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All volunteers undergo background checks and basic training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
