import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const params = useParams("");
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [newPassword, setNewPassword] = useState({
    updatePassword: "",
  });
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    async function GetResetPasswordToken() {
      try {
        const response = await axios.get(
          "http://localhost:3000/reset-password/" + `${params.token}`
        );
        const token = response.data;
        console.log("token", token);

        if (response.status === 200) {
          console.log("successfully submitted", response.data);
          toast.success("Email verified successfully");
        }
      } catch (error) {
        console.error(error.response.data.error);
        toast.error(error.response.data.error);
      }
    }
    GetResetPasswordToken();
  }, []);

  async function UpdateNewPassword() {
    try {
      const response = await axios.post(
        `http://localhost:3000/reset-password/${params.token}`,
        newPassword,
        { withCredentials: true }
      );

      console.log("response", response);
      if (response.status === 200) {
        console.log("successfully updated", response.data);
        toast.success(response.data.message);
        setLoader(false);

        navigate("/");
      }
    } catch (error) {
      console.error(error.message);
      setLoader(false);
      toast.error("The Link is expired, create new Link to update Password.");
    }
  }

  let countError = {};
  function Validation() {
    if (
      !newPassword.updatePassword ||
      !passwordRegex.test(newPassword.updatePassword)
    ) {
      countError.password =
        "Password must be at least 8 characters with uppercase, lowercase, a number, and a special character.";
    }
    setError(countError);
    setLoader(false);
    return Object.keys(countError).length === 0;
  }

  async function HandleSubmit(e) {
    e.preventDefault();
    setLoader(true);
    if (Validation()) {
      try {
        await UpdateNewPassword();
        setNewPassword({
          updatePassword: "",
        });
      } catch (error) {
        console.error("New password failed", error.message);
      }
    }
  }

  return (
    <form
      onSubmit={(e) => HandleSubmit(e)}
      className=" h-screen  w-screen flex flex-col justify-center items-center gap-8"
    >
      <div className=" h-1/5 w-full flex flex-col items-center justify-center">
        {" "}
        <input
          type="password"
          name="updatePassword"
          value={newPassword.updatePassword}
          onChange={(e) =>
            setNewPassword((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          placeholder="Enter New Password"
          className="w-[60%] h-[40%] outline-none rounded-lg p-4 bg-[#F5F5F5] text-slate-900 will-change-transform duration-200 ease-out hover:scale-105 focus:border-2  focus:border-sky-300 shadow-sm "
        ></input>
        {error.password && (
          <p className="text-red-400 text-sm ">{error.password}</p>
        )}
      </div>
      <button
        disabled={loader}
        type="submit"
        className="w-[30%] bg-[#37B6FF] h-[8%] rounded-full font-semibold text-center text-white will-change-transform duration-100 ease-out hover:scale-105 shadow-sm"
      >
        {loader ? (
          <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        ) : (
          "Request Password change"
        )}
      </button>
    </form>
  );
}
