import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";

export const modalContext = createContext(false);

export default function SignupModalContext({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [logInContext, setLogInContext] = useState(false);
  const [logInAndOutButton, setLogInAndOutButton] = useState("Log In");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  useEffect(() => {
    CheckUserLoggedIn();
  }, []);

  async function CheckUserLoggedIn() {
    try {
      const response = await axios.get("http://localhost:3000/", {
        withCredentials: true,
      });
      if (response.data?.success) {
        setLogInContext(false);
        setIsUserLoggedIn(true);
        setUserInfo(response.data?.data);
        setUserRole(response.data?.data?.role);
        await getAllNotifications();
      }
    } catch (error) {
      console.log("User is not logged in:", error.response?.data?.error);
      setIsUserLoggedIn(false);
    }
  }

  async function getAllNotifications() {
    try {
      const response = await axios.get(
        "http://localhost:3000/get-notifications",
        {
          withCredentials: true,
        }
      );
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

  console.log("All notif - ", allNotifications);

  return (
    <modalContext.Provider
      value={{
        showModal,
        setShowModal,
        logInContext,
        setLogInContext,
        logInAndOutButton,
        setLogInAndOutButton,
        isUserLoggedIn,
        setIsUserLoggedIn,
        userInfo,
        setUserInfo,
        userRole,
        setUserRole,
        allNotifications,
        setAllNotifications,
      }}
    >
      {children}
    </modalContext.Provider>
  );
}
