import React, { useState, useRef, useEffect, useContext } from "react";
import LogOut from "./logOut";
import { modalContext } from "../utils/signUpModalContext.jsx";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useContext(modalContext);
  const dropdownRef = useRef(null); // Ref for the dropdown container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <IoMdMenu className="min-h-10 min-w-10 shadow-white fill-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Profile Info */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-800">
              {userInfo?.name}
            </p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>

          {/* Menu Items */}
          <ul className="py-2">
            <li>
              <Link
                to="/user-profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Notifications
              </a>
            </li>
          </ul>

          {/* Logout Button */}
          <div className="p-2 border-t border-gray-200">
            <LogOut setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
