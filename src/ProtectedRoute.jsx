import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import SignupModalContext, { modalContext } from "./utils/signUpModalContext";

const ProtectedRoute = ({ children }) => {
  const { isUserLoggedIn } = useContext(modalContext);
  console.log("chlgya ");
  console.log("chla ", isUserLoggedIn);

  if (!isUserLoggedIn) {
    return Navigate({ to: "/" });
  }

  return children;
};

export default ProtectedRoute;
