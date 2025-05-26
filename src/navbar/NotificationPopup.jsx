import { useContext, useEffect, useRef, useState } from "react";
import { modalContext } from "../utils/signUpModalContext";
import NoData from "../assets/Icons/No Data.svg";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { baseURL } from "../../baseurl";

const NotificationPopup = () => {
  const { allNotifications, setAllNotifications } = useContext(modalContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isNtfRead, setIsNtfRead] = useState(false);
  const popupRef = useRef();

  async function getAllNotifications() {
    try {
      const response = await axios.get(`${baseURL}/get-notifications`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        setAllNotifications(response.data?.data);
      }
    } catch (error) {
      console.log(
        "Error while fetching Notifications :",
        error.response?.data?.error
      );
    }
  }

  useEffect(() => {
    getAllNotifications();
  }, [isNtfRead, isOpen]);

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} years ago`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  async function handleAllNotifcationRead() {
    try {
      const res = await axios.patch(
        `${baseURL}/mark-all-notification-read`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        setIsNtfRead((prev) => !prev);
        allNotifications.map((item) => ({ ...item, isRead: true }));
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  }

  async function MarkNotificationRead(noti) {
    if (noti.isRead === false) {
      try {
        const res = await axios.get(
          `${baseURL}/mark-notification-read/${noti._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data?.success) {
          setIsNtfRead((prev) => !prev);
          allNotifications.map((item) =>
            item._id === noti._id ? { ...item, isRead: true } : item
          );
        }
      } catch (error) {
        console.log("Error => ", error);
      }
    }
  }

  const handleDeleteNotification = async (noti) => {
    try {
      const res = await axios.get(
        `${baseURL}/delete-notification/${noti._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        setIsNtfRead((prev) => !prev);
        allNotifications.map((item) => item._id !== noti._id);
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  console.log("All Notifications => ", allNotifications);

  return (
    <div className="relative" ref={popupRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <p className="hover:text-blue-400 text-white font-[400] transition-transform text-center">
          Notifications
        </p>
        {/* Notification Badge */}
        <span className="absolute top-1 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {allNotifications.filter((item) => item?.isRead == false).length}
        </span>
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg ">
          {allNotifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {allNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 group cursor-pointer"
                >
                  <div className="flex">
                    <p
                      onClick={() => MarkNotificationRead(notification)}
                      className={`text-sm flex flex-[0.95] text-gray-700 ${
                        notification?.isRead ? "font-normal" : "font-bold"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex flex-[0.05] items-center w-full  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <MdDelete
                        className="w-7 h-7  fill-red-500 hover:scale-110 hover:fill-red-700"
                        onClick={() => handleDeleteNotification(notification)}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {timeAgo(notification.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center gap-4 flex-col py-5">
              <img src={NoData} alt="No Notifications" className="w-10 h-10" />
              <p className="text-md font-semibold"> No Notifications</p>
            </div>
          )}
          {allNotifications.length != 0 && (
            <button
              onClick={handleAllNotifcationRead}
              className="p-4 text-center text-sm text-blue-600 w-full hover:bg-gray-50 cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
