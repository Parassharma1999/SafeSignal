import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { modalContext } from "../utils/signUpModalContext";
import NoData from "../assets/Icons/No Data.svg";
import { toast } from "react-toastify";

const ProfilePage = () => {
  // State for user data
  const { userRole } = useContext(modalContext);
  const [userData, setUserData] = useState({});
  const [allRequest, setAllRequest] = useState([]);
  const { setUserInfo } = useContext(modalContext);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getUserProfile();
  }, []);
  const getUserProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user-profile", {
        withCredentials: true,
      });
      if (res.data?.success) {
        setUserData(res.data?.data?.user);
        setAllRequest(res.data?.data?.requests);
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again! " + error.message);
    }
  };
  console.log("All req - ", allRequest);

  const handleCancelRequest = async (request) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/cancel-help-request/${request._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        toast.warn("Request has been canceled !");
        setAllRequest(
          allRequest.map((item) =>
            item._id === request._id ? { ...item, status: "canceled" } : item
          )
        );
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again! " + error.message);
    }
  };

  const handleCompleteRequest = async (request) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/complete-help-request/${request._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        toast.success("Request has been marked as completed !");
        setAllRequest(
          allRequest.map((item) =>
            item._id === request._id ? { ...item, status: "completed" } : item
          )
        );
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again! " + error.message);
    }
  };

  const updateUserProfile = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:3000/update-user-profile",
        {
          name: userData?.name,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        setUserData(res.data?.data);
        setUserInfo(res.data?.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  console.log(" all req = ", allRequest);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAcceptRequest = async (request) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/accept-help-request/${request._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        toast.success("Request has been accepted !");
        setAllRequest(
          allRequest.map((item) =>
            item._id === request._id ? { ...item, status: "in progress" } : item
          )
        );
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/reject-help-request/${request._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        toast.info("Request has been rejected !");
        setAllRequest(
          allRequest.map((item) =>
            item._id === request._id ? { ...item, status: "rejected" } : item
          )
        );
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* User Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Details
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={updateUserProfile}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{userData.name}</p>
              )}
            </div>

            {/* Address Field */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{user.address}</p>
              )}
            </div> */}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  disabled
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{userData.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  disabled
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{userData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Request Cards Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {userRole == 1 ? "Your Requests" : "Requests"}
          </h2>
          <div className="space-y-4">
            {allRequest.length > 0 ? (
              allRequest.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div
                    className={`font-bold ${
                      request.status == "completed"
                        ? "text-green-600"
                        : request?.status == "pending"
                        ? "text-orange-600"
                        : request?.status == "in progress"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {request?.status.slice(0, 1).toUpperCase() +
                      request?.status.slice(1)}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.requestDetails.immediateNeeds}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.requestDetails.disasterType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {request.requestDetails.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  {userRole === 1 && request?.status == "pending" && (
                    <div className="flex justify-between flex-row-reverse">
                      <button
                        onClick={() => handleCancelRequest(request)}
                        className="py-1 px-4 bg-red-500 text-white text-base rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {userRole === 2 && request?.status == "in progress" && (
                    <div className="flex justify-between flex-row-reverse">
                      <button
                        onClick={() => handleCompleteRequest(request)}
                        className="py-1 px-4 bg-green-500 text-white text-base rounded-md"
                      >
                        Mark as Complete
                      </button>
                    </div>
                  )}

                  {userRole === 2 && request?.status == "pending" && (
                    <div className="flex flex-row-reverse gap-6 py-2">
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="py-1 px-6 bg-blue-600 text-white text-base rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request)}
                        className="py-1 px-4 bg-red-500 text-white text-base rounded-md"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center flex-col">
                <img src={NoData} alt="No Data" className="w-20 h-20" />
                <p className="text-xl font-bold">No Requests to show</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
