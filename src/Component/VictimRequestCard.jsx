import { toast } from "react-toastify";
import logo from "../assets/images-disaster/Logo.png";
import axios from "axios";

const VictimRequestCard = ({
  request,
  allVictims,
  setAllVictims,
  setSelectedVictim,
  selectedVictim,
  setTrigger,
}) => {
  const handleAcceptRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/accept-help-request/${request._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        toast.success("Thanks our Hero for accepting the request !");
        setTrigger((prev) => !prev);
        setAllVictims(
          allVictims.map((item) =>
            item._id === request._id ? { ...item, status: "in progress" } : item
          )
        );
      } else {
        toast.error(res.data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again! " + error.message);
    }
  };

  console.log(request);

  const handleRejectRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/reject-help-request/${request._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        toast.info("Request has been rejected !");
        setTrigger((prev) => !prev);
        setAllVictims(
          allVictims.map((item) =>
            item._id === request._id ? { ...item, status: "rejected" } : item
          )
        );
      } else {
        toast.error(res.data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again!");
    }
  };

  return (
    <div
      className={`w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${
        selectedVictim === request && `border-2 border-blue-400`
      }`}
    >
      {/* Card Header with User Info */}
      <div
        className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        onClick={() => setSelectedVictim(request)}
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
          <img
            src={logo}
            alt="Logo"
            className="absolute w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">
            {request?.victimInfo?.name}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {request?.requestDetails?.disasterType}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 overflow-y-scroll h-20 md:h-[7rem]">
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Phone</p>
            <p className="text-sm text-gray-800">
              {request?.victimInfo?.phone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Email</p>
            <p className="text-sm text-gray-800 truncate">
              {request?.victimInfo?.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-medium">No of People</p>
            <p className="text-sm text-gray-800 mt-1 capitalize">
              {request?.requestDetails?.numberOfPeople}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-medium">Location</p>
            <p className="text-sm text-gray-800 mt-1 capitalize">
              {request?.requestDetails?.location}
            </p>
          </div>
        </div>

        {/* Immediate Needs */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 font-medium">Immediate Needs</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {request?.requestDetails?.immediateNeeds
              .split(",")
              .map((need, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                >
                  {need.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* Additional Notes */}
        {request?.additionalInfo && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-medium">Additional Info</p>
            <p className="text-sm text-gray-800 mt-1">
              {request?.additionalInfo}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-200">
        <button
          onClick={handleRejectRequest}
          className="flex-1 py-3 px-4 text-red-600 font-medium hover:bg-red-50 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={handleAcceptRequest}
          className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default VictimRequestCard;
