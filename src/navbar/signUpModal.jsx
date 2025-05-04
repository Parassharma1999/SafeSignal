import React, { useContext, useEffect, useState } from "react";
import { modalContext } from "../utils/signUpModalContext";
import volunteer1 from "../assets/images-disaster/signupvolunteer.svg";
import volunteer2 from "../assets/images-disaster/signupcall.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUpVolunteer = () => {
  const { showModal, setShowModal, setLogInContext } = useContext(modalContext);
  const [validationError, setValidationError] = useState({});
  const [loader, setLoader] = useState(false);
  const [userType, setUserType] = useState("victim");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mobileRegex = /^[0-9]{10}$/;
  const navigate = useNavigate();

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  async function SignupVolunteer() {
    try {
      const response = await axios.post(
        "http://localhost:3000/signup/volunteer",
        signupForm
      );
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
        toast.success("successfully submitted");

        setSignupForm({
          name: "",
          email: "",
          password: "",
          mobile: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoader(false);
    }
  }
  async function SignupVictim() {
    try {
      const response = await axios.post(
        "http://localhost:3000/signup/victim",
        signupForm
      );
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
        toast.success("successfully submitted");

        setSignupForm({
          name: "",
          email: "",
          password: "",
          mobile: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoader(false);
    }
  }

  let countError = {};
  function Validation() {
    if (
      !signupForm.name ||
      typeof signupForm.name !== "string" ||
      signupForm.name.trim().length < 4 ||
      signupForm.name.trim().length > 50
    ) {
      countError.name = "Enter the valid Name!";
    }
    if (!signupForm.email || !emailRegex.test(signupForm.email.trim())) {
      countError.email = "Enter the valid email!";
    }
    if (!signupForm.password || !passwordRegex.test(signupForm.password)) {
      countError.password = "Password is too weak!";
    }
    if (!signupForm.mobile || !mobileRegex.test(signupForm.mobile.trim())) {
      countError.mobile = "Enter a valid 10-digit mobile number!";
    }
    setValidationError(countError);
    return Object.keys(countError).length === 0;
  }

  const HandleOnClick = (buttonType) => {
    setUserType(buttonType);

    setSignupForm({ name: "", email: "", password: "", mobile: "" });
  };

  const HandleChange = (e) => {
    setSignupForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (Validation()) {
      if (userType === "victim") {
        await SignupVictim();
      } else {
        await SignupVolunteer();
      }
      setShowModal(false);
      setLogInContext(true);
    } else {
      setLoader(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black h-screen w-screen bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-2/3 h-[90%] flex">
        <div className="flex-1 ">
          <img
            src={userType === "volunteer" ? volunteer1 : volunteer2}
            alt="volunteer"
            className="h-full rounded-tl-xl rounded-bl-xl object-fill w-full opacity-80 "
          />
        </div>

        <div className="flex-1 flex flex-col items-center p-4 pt-2 gap-6">
          <div className="flex flex-col w-full">
            <div className="flex flex-row-reverse w-full">
              <button
                className="transition-all transform border-black bg-gray-200 h-6 w-6 rounded-full"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="h-12 flex w-full items-center justify-center  ">
              <button
                data-type="victim"
                onClick={() => HandleOnClick("victim")}
                className={`w-[40%] h-full text-lg text-slate-800 font-semibold bg-[#F5F5F5] 
                           will-change-transform duration-200 ease-out shadow-sm text-center rounded-tl-lg rounded-bl-lg 
                           ${
                             userType === "victim"
                               ? "bg-sky-400 text-white"
                               : ""
                           }`}
              >
                Victim
              </button>
              <button
                data-type="volunteer"
                onClick={() => HandleOnClick("volunteer")}
                className={`w-[40%] h-full text-lg text-slate-800 font-semibold bg-[#F5F5F5] 
                           will-change-transform duration-200 ease-out shadow-sm text-center rounded-tr-lg rounded-br-lg 
                           ${
                             userType === "volunteer"
                               ? "bg-sky-400 text-white"
                               : ""
                           }`}
              >
                Volunteer
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => HandleSubmit(e)}
            className=" flex flex-col gap-8 transition-transform h-4/5 w-[90%]"
          >
            <div className="flex flex-col h-[12%]">
              <input
                type="text"
                name="name"
                value={signupForm.name}
                onChange={(e) => HandleChange(e)}
                placeholder="Full Name"
                className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.name && (
                <p className="text-red-400 text-sm">{validationError.name}</p>
              )}
            </div>

            <div className="flex flex-col h-[12%]">
              <input
                type="email"
                name="email"
                value={signupForm.email}
                onChange={(e) => HandleChange(e)}
                placeholder="Email"
                className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.email && (
                <p className="text-red-400 text-sm">{validationError.email}</p>
              )}
            </div>

            <div className="flex flex-col h-[12%]">
              <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={(e) => HandleChange(e)}
                placeholder="Password"
                className=" w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out  hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
              ></input>
              {validationError.password && (
                <p className="text-red-400 text-sm">
                  {validationError.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between h-[14%]">
              <div className="flex flex-col h-[90%] ">
                <input
                  type="text"
                  name="mobile"
                  value={signupForm.mobile}
                  onChange={(e) => HandleChange(e)}
                  placeholder="Mobile Number"
                  className="  w-full h-[90%] bg-[#F5F5F5] text-slate-800 p-4 outline-none rounded-lg will-change-transform duration-200 ease-out hover:scale-105 focus:border-2 focus:border-sky-300 shadow-sm"
                ></input>
                {validationError.mobile && (
                  <p className="text-red-400 text-sm">
                    {validationError.mobile}
                  </p>
                )}
              </div>

              <div className="flex gap-1">
                <input type="checkbox"></input>
                <span className="text-slate-700">Remember me</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 h-[10%]">
              <button
                type="submit"
                disabled={loader}
                className="flex items-center justify-center text-lg font-semibold  w-full h-full bg-[#37B6FF] text-white p-4 outline-none rounded-full will-change-transform duration-200 ease-out hover:scale-105  shadow-sm"
              >
                {loader ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpVolunteer;
