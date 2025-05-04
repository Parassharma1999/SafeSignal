import { IoMdMenu } from "react-icons/io";
import { useContext, useState, useEffect } from "react";
import Logo from "../assets/images-disaster/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { modalContext } from "../utils/signUpModalContext.jsx";
import LogInModal from "./loginModal.jsx";
import LogOut from "./logOut.jsx";
import axios from "axios";
import NotificationPopup from "./NotificationPopup.jsx";
import ProfileMenu from "./ProfileMenu.jsx";
import { useSelector } from "react-redux";

export default function Navbar() {
  const {
    setShowModal,
    logInAndOutButton,
    userInfo,
    setLogInContext,
    isUserLoggedIn,
    userRole,
  } = useContext(modalContext);
  const user = useSelector((state) => state.user);
  console.log("MY USER => ", user);

  console.log("userInfo = ", userInfo);

  const [onClickMenu, setOnClickMenu] = useState(false);
  const navigate = useNavigate();
  const [showLogOutBox, setShowLogOutBox] = useState(false); // State to control logout box
  console.log("showLogOutBox on top", showLogOutBox);
  const { pathname } = useLocation();
  const location =
    pathname !== "/" ? "bg-black relative" : "bg-transparent absolute";

  function HandleClick() {
    setOnClickMenu(!onClickMenu);
  }
  function handleLogInLogout() {
    if (logInAndOutButton === "Log Out") {
      console.log("Toggling logout box");
      setShowLogOutBox((prev) => !prev);
    } else if (logInAndOutButton === "Log In") {
      setLogInContext((prev) => !prev);
    }
  }

  console.log("showLogOutBox at bottom", userRole);
  return (
    <div
      className={`${location} md:pl-4 pl-4 lg:pl-6 p-2 flex justify-between items-center sm:items-center pr-4 z-50 h-[6rem] w-[100%] lg:max-w-screen`}
    >
      <img
        src={Logo}
        className="h-full flex-[0.07] cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Mobile Navbar */}
      <div className="relative md:hidden">
        <button onClick={HandleClick} className="relative">
          <IoMdMenu className="min-h-10 min-w-10 shadow-white fill-white" />
        </button>
        {onClickMenu && (
          <div className="text-sm absolute right-40 top-12 font-bold border border-white">
            <div className="absolute text-white bg-[#62c4fd] transition-transform shadow-md h-[12rem] w-[9rem] flex-col rounded-sm">
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                <Link to="/">Home</Link>
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                <Link to="/about-us">About us</Link>
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                <Link to="/contact-us">Contact Us</Link>
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                Register
              </div>
              <div className="border-b-[0.5px] pl-2 pt-2 pb-2 hover:bg-[#a1c8df]">
                LogIn
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <div className="relative flex justify-around flex-[0.75] md:flex md:flex-[0.6] lg:flex lg:flex-[0.5] md:font-semibold md:items-center lg:items-center hidden sm:hidden">
        <Link
          to="/"
          className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
        >
          Home
        </Link>
        <Link
          to="/about-us"
          className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
        >
          About us
        </Link>
        <Link
          to="/contact-us"
          className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
        >
          Contact Us
        </Link>
        {!isUserLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
          >
            Register
          </button>
        ) : null}

        {isUserLoggedIn ? <NotificationPopup /> : null}

        {isUserLoggedIn && userInfo?.role === 2 ? (
          <Link
            // to="/map/victim/"
            to="/map/victim/"
            className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
          >
            See Victims
          </Link>
        ) : null}

        {isUserLoggedIn && userInfo?.role === 1 ? (
          <Link
            to="/map/volunteer/"
            className="hover:text-blue-400 text-white font-[400] transition-transform text-center"
          >
            See Volunteers
          </Link>
        ) : null}

        {/* LogIn / LogOut */}
        {isUserLoggedIn ? (
          <ProfileMenu />
        ) : (
          <div className="relative">
            <button
              onClick={handleLogInLogout}
              className="hover:text-blue-400 relative text-white font-[400] transition-transform text-center"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
