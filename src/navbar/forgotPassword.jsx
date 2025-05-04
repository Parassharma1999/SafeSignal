import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const ForgotPassword = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [emailForForgotPassword, setEmailForForgotPassword] = useState({
    email: "",
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

  async function ForgotPasswordAPI() {
    try {
      const response = await axios.post(
        "http://localhost:3000/forgot-password",
        emailForForgotPassword,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("successfully submitted", response.data);
        setLoader(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.error);
      console.error(error);
    }
  }
  let countError = {};
  function Validation() {
    if (
      !emailForForgotPassword.email ||
      !emailRegex.test(emailForForgotPassword.email.trim())
    ) {
      countError.email = "Enter the valid email!";
    }

    setError(countError);
    setLoader(false);
    return Object.keys(countError).length === 0;
  }

  function HandleChange(e) {
    setEmailForForgotPassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  async function HandleSubmit(e) {
    e.preventDefault();
    setLoader(true);
    if (Validation()) {
      try {
        await ForgotPasswordAPI();
        setEmailForForgotPassword({
          email: "",
        });
      } catch (error) {
        console.error(" Forgort password request failed ", error.message);
      }
    }
  }

  return (
    <div className="h-[40%] w-full flex flex-col items-center rounded-lg justify-evenly">
      <form
        onSubmit={(e) => HandleSubmit(e)}
        className=" h-full w-full flex flex-col items-center justify-evenly"
      >
        <div className="h-[25%] w-full flex flex-col items-center">
          <input
            type="email"
            name="email"
            value={emailForForgotPassword.email}
            placeholder="Email"
            onChange={(e) => HandleChange(e)}
            className="h-full w-[90%] outline-none rounded-lg p-4 bg-[#F5F5F5] text-slate-900 will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
          ></input>
          {error.email && <p className="text-red-400 text-sm">{error.email}</p>}
        </div>

        <button
          type="submit"
          disabled={loader}
          className="h-[25%] w-[90%] outline-none rounded-full bg-[#37B6FF] flex justify-center items-center font-semibold text-white will-change-transform duration-100 ease-out hover:scale-105 shadow-sm"
        >
          {loader ? (
            <div className="h-5 w-5 rounded-full border-2 flex justify-center border-white border-t-transparent animate-spin"></div>
          ) : (
            "Request password change"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
