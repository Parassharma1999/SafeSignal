import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VictimForm() {
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [showLocation, setShowLocation] = useState(null);
  const [victimLocation, setVictimLocation] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    location: {
      type: "Point",
      coordinate: [],
    },
    disasterType: "",
    dateAndTime: "",
    immediateNeeds: "",
    numberOfPeople: "",
    medicalConditions: "",
    locationName: showLocation,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Your browser does not support Automatic location");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      setVictimLocation([lat, long]);
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
        setFormData((prev) => ({
          ...prev,
          locationName: response.data.display_name,
        }));
      } catch (error) {
        console.error(" Not able to fetch address: ", error);
      }
    });
  }, []);

  console.log("State = ", state);

  const sendOutRequest = async () => {
    console.log("send Email");
    try {
      const response = await axios.post(
        "`${baseURL}/emergency-request",
        {
          email: state.volunteer?.email,
          to: state.volunteer?.phone,
          message: formData,
          volunteerID: state.volunteer?.userID,
          location: {
            type: "Point",
            coordinates: victimLocation,
          },
        },
        {
          withCredentials: true,
        }
      );

      console.log("Mail send => ", response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Form Data => ", formData);

  async function PostingVictimForm() {
    try {
      const response = await axios.post("`${baseURL}/victim/form", formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
        await sendOutRequest();
        // sendOutWatsapp();
        toast.success("submitted successfully!");
        navigate("/map/volunteer");

        setFormData({
          name: "",
          location: {
            type: "Point",
            coordinates: victimLocation,
          },
          disasterType: "",
          dateAndTime: "",
          immediateNeeds: "",
          numberOfPeople: "",
          medicalConditions: "",
          locationName: "",
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
    if (
      !formData.name ||
      formData.name.trim().length < 4 ||
      formData.name.trim().length > 50 ||
      typeof formData.name !== "string"
    ) {
      countError.name = "Name should be 4-50 characters";
    }
    if (!showLocation) {
      countError.location = " Select allow to track your location ";
    }
    if (
      !formData.numberOfPeople ||
      formData.numberOfPeople < 1 ||
      formData.numberOfPeople > 100000 ||
      isNaN(formData.numberOfPeople)
    ) {
      countError.numberOfPeople = " Number of people should be 1-100000 ";
    }

    setError(countError);

    return Object.keys(countError).length === 0;
  }

  function HandleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function HandleSubmit(e) {
    e.preventDefault();
    setLoader(true);
    if (Validation()) {
      PostingVictimForm();
    } else {
      setLoader(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 overscroll-x-none min-h-screen w-full bg-gradient-to-br from-sky-50 to-blue-50 justify-center items-center p-4">
      <div className="w-full max-w-[90rem] flex flex-col lg:flex-row">
        {/* Information Section */}
        <div className="lg:w-2/5 bg-white p-8 rounded-xl shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-sky-900 mb-6">
            Emergency Assistance
          </h2>

          <div className="space-y-6">
            <div className="bg-sky-50 p-5 rounded-lg border border-sky-100">
              <h3 className="text-xl font-semibold text-sky-800 mb-3">
                How This Works
              </h3>
              <p className="text-gray-700">
                Our victim assistance program provides immediate support to
                those affected by disasters. Once you submit this form, our
                emergency response team will prioritize your request based on
                the information provided.
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                What to Expect
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Response within 2-4 hours for urgent cases</li>
                <li>Coordination with local emergency services</li>
                <li>Follow-up within 24 hours</li>
                <li>Ongoing support options</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">
                Emergency Contacts
              </h3>
              <div className="space-y-2">
                <p className="font-medium">
                  National Emergency: <span className="font-normal">911</span>
                </p>
                <p className="font-medium">
                  Disaster Hotline:{" "}
                  <span className="font-normal">1-800-985-5990</span>
                </p>
                <p className="font-medium">
                  Red Cross:{" "}
                  <span className="font-normal">1-800-RED-CROSS</span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-lg border border-green-100">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Safety Tips
              </h3>
              <p className="text-gray-700 mb-3">
                While waiting for assistance, please remember:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Stay in a safe location if possible</li>
                <li>Conserve phone battery</li>
                <li>Follow official emergency instructions</li>
                <li>Check on neighbors if safe to do so</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col flex-1 overscroll-x-none min-h-screen w-full bg-gradient-to-br from-sky-50 to-blue-50 items-center ">
          <div className="h-fit my-4 p-8 sm:p-10 w-full max-w-2xl rounded-xl shadow-xl bg-white border border-white/20 flex flex-col gap-6 backdrop-blur-sm bg-opacity-90">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl text-sky-900 font-bold mb-3 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Victim Assistance Form
              </h1>
              <p className="text-gray-600 max-w-md">
                We are here to support you. Please share your details below to
                get the help you need.
              </p>
            </div>

            <form onSubmit={HandleSubmit} className="mt-2 space-y-6">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Full Name"
                  onChange={(e) => HandleChange(e)}
                  className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                  required
                />
                {error.name && (
                  <p className="text-sm text-red-500 pl-1">{error.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName ? formData.locationName : ""}
                  onChange={(e) => HandleChange(e)}
                  placeholder="Current Location"
                  className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                  required
                />
                {error.location && (
                  <p className="text-sm text-red-500 pl-1">{error.location}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <select
                    name="disasterType"
                    value={formData.disasterType}
                    required
                    onChange={(e) => HandleChange(e)}
                    className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm appearance-none bg-white"
                  >
                    <option name="disasterType" value="" disabled selected>
                      Disaster Type
                    </option>
                    <option name="disasterType" value="Flood">
                      Flood
                    </option>
                    <option name="disasterType" value="Cyclone">
                      Cyclone
                    </option>
                    <option name="disasterType" value="Earthquake">
                      Earthquake
                    </option>
                    <option name="disasterType" value="Draught">
                      Draught
                    </option>
                    <option name="disasterType" value="Tsunami">
                      Tsunami
                    </option>
                    <option name="disasterType" value="Landslide">
                      Landslide
                    </option>
                    <option name="disasterType" value="Wildfire">
                      Wildfire
                    </option>
                    <option name="disasterType" value="Avalanche">
                      Avalanche
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="datetime-local"
                    name="dateAndTime"
                    value={formData.dateAndTime}
                    required
                    onChange={(e) => HandleChange(e)}
                    className="border border-gray-300 rounded-xl w-full py-[0.85rem] px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <select
                    name="immediateNeeds"
                    value={formData.immediateNeeds}
                    required
                    onChange={(e) => HandleChange(e)}
                    className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm appearance-none bg-white"
                  >
                    <option name="immediateNeeds" value="" disabled selected>
                      Immediate Needs
                    </option>
                    <option name="immediateNeeds" value="Food and water">
                      Food and water
                    </option>
                    <option name="immediateNeeds" value="Shelter">
                      Shelter
                    </option>
                    <option name="immediateNeeds" value="Medical assistance">
                      Medical assistance
                    </option>
                    <option name="immediateNeeds" value="Clothing">
                      Clothing
                    </option>
                    <option name="immediateNeeds" value="Hygiene kits">
                      Hygiene kits
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    required
                    onChange={(e) => HandleChange(e)}
                    placeholder="Number Of People"
                    className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm"
                  />
                  {error.numberOfPeople && (
                    <p className="text-sm text-red-500 pl-1">
                      {error.numberOfPeople}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <select
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  required
                  onChange={(e) => HandleChange(e)}
                  className="border border-gray-300 rounded-xl w-full py-3 px-4 outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition duration-200 shadow-sm appearance-none bg-white"
                >
                  <option name="medicalConditions" value="" disabled selected>
                    Medical Conditions
                  </option>
                  <option name="medicalConditions" value="Chronic illness">
                    Chronic illness
                  </option>
                  <option name="medicalConditions" value="Disabilities">
                    Disabilities
                  </option>
                  <option name="medicalConditions" value="Injuries">
                    Injuries
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
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
            {/* Additional Form Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By submitting this form, you agree to our terms of service and
                privacy policy. All information will be kept confidential and
                used only for emergency response purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
