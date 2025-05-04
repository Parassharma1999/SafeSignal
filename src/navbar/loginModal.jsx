import React, { useContext, useEffect, useState } from "react";
import { modalContext } from "../utils/signUpModalContext";
import Logo from "../assets/images-disaster/Logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import ForgotPassword from "./forgotPassword";
import { IoIosArrowBack } from "react-icons/io";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const LogInModal = () => {
  const {
    logInContext,
    setLogInContext,
    setUserInfo,
    setIsUserLoggedIn,
    setShowModal,
  } = useContext(modalContext);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  console.log("login", logInContext);
  const [validationError, setValidationError] = useState({});
  const dispatch = useDispatch();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let countError = {};

  const [logInForm, setLogInForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (logInContext) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [logInContext]);

  async function LogInPosting() {
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        logInForm,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("successfully submitted", response);
        setLogInForm({
          email: "",
          password: "",
        });
        toast.success("LogIn Successfully");
        setLogInContext(false);
        setUserInfo(response.data?.data);
        dispatch(addUser(response.data?.data));
        setIsUserLoggedIn(true);
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoader(false);
    }
  }

  function Validation() {
    if (!logInForm.email || !emailRegex.test(logInForm.email.trim())) {
      countError.email = "Enter the valid email!";
    }
    if (!logInForm.password.trim()) {
      countError.password = "Invalid Credentials";
    }
    setValidationError(countError);

    return Object.keys(countError).length === 0;
  }

  const HandleChange = (e) => {
    setLogInForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const HandleAccount = () => {
    setLogInContext(false);
    setShowModal(true);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (Validation()) {
      LogInPosting();
    } else {
      setLoader(false);
    }
  };

  if (!logInContext) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md xl:max-w-3xl xl:min-w-[50rem] xl:min-h-[40rem] overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
        {/* Modal Header */}
        <div className="relative p-6 xl:p-10 pb-0">
          <div className="flex justify-between items-start">
            {forgotPassword && (
              <button
                onClick={() => setForgotPassword(false)}
                className="flex items-center text-sm xl:text-lg text-[#37B6FF] hover:text-[#2a8acc] transition-colors"
              >
                <IoIosArrowBack className="mr-1 xl:mr-2" /> Back to login
              </button>
            )}

            <button
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl xl:text-2xl"
              onClick={() => {
                setLogInContext(false);
                setForgotPassword(false);
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {!forgotPassword && (
            <div className="flex justify-center mt-4 mb-6 xl:mt-8 xl:mb-10">
              <img
                src={Logo}
                className="h-16 xl:h-24 w-auto"
                alt="SafeSignal Logo"
              />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 xl:p-10 pt-0">
          {/* Title */}
          <h1 className="text-2xl xl:text-4xl font-bold text-center text-gray-800 mb-6 xl:mb-10">
            {!forgotPassword ? "Welcome Back" : "Reset Your Password"}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-center mb-8 xl:mb-12 text-sm xl:text-lg">
            {!forgotPassword
              ? "Sign in to access your SafeSignal account"
              : "Enter your email to receive a password reset link"}
          </p>

          {/* Form or Forgot Password Component */}
          {!forgotPassword ? (
            <form
              onSubmit={HandleSubmit}
              className="space-y-6 xl:space-y-10 w-full max-w-md mx-auto xl:max-w-xl"
            >
              {/* Email Field */}
              <div className="space-y-2 xl:space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-3 xl:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 xl:text-xl" />
                  <input
                    type="email"
                    name="email"
                    value={logInForm.email}
                    onChange={HandleChange}
                    placeholder="Email address"
                    className="w-full pl-10 xl:pl-12 pr-4 py-3 xl:py-5 text-sm xl:text-base bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#37B6FF] focus:ring-2 focus:ring-[#37B6FF]/20"
                  />
                </div>
                {validationError.email && (
                  <p className="text-red-500 text-sm xl:text-base mt-1 xl:mt-2">
                    {validationError.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2 xl:space-y-4">
                <div className="relative">
                  <FiLock className="absolute left-3 xl:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 xl:text-xl" />
                  <input
                    type="password"
                    name="password"
                    value={logInForm.password}
                    onChange={HandleChange}
                    placeholder="Password"
                    className="w-full pl-10 xl:pl-12 pr-4 py-3 xl:py-5 text-sm xl:text-base bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#37B6FF] focus:ring-2 focus:ring-[#37B6FF]/20"
                  />
                </div>
                {validationError.password && (
                  <p className="text-red-500 text-sm xl:text-base mt-1 xl:mt-2">
                    {validationError.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-sm xl:text-lg text-[#37B6FF] hover:text-[#2a8acc] underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loader}
                className="w-full py-3 xl:py-5 bg-[#37B6FF] hover:bg-[#2a8acc] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 flex justify-center items-center text-sm xl:text-lg"
              >
                {loader ? (
                  <div className="h-5 w-5 xl:h-6 xl:w-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4 xl:my-8">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm xl:text-lg">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-sm xl:text-lg text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={HandleAccount}
                  className="text-[#37B6FF] hover:text-[#2a8acc] font-medium flex items-center justify-center mx-auto underline transition-colors"
                >
                  <FiUserPlus className="mr-1 xl:mr-2" /> Create account
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full max-w-md mx-auto xl:max-w-xl">
              <ForgotPassword />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogInModal;
