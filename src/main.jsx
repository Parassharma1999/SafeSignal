import { StrictMode, useContext } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./navbar/index.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import VictimForm from "./forms/victimForm.jsx";
import VolunteerForm from "./forms/VolunteerForm.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpVolunteer from "./navbar/signUpModal.jsx";
import LogInModal from "./navbar/loginModal.jsx";
import ResetPassword from "./navbar/resetPassword.jsx";
import Footer from "./Footer/Footer.jsx";
import MapVolunteerComponent from "./map/mapVolunteerComponent.jsx";
import MapVictimComponent from "./map/mapVictimComponent.jsx";
import ContactUs from "./Component/ContactUs.jsx";
import Aboutus from "./Component/AboutUs.jsx";
import UserProfile from "./Component/UserProfile.jsx";
import SignupModalContext from "./utils/signUpModalContext.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import { Provider } from "react-redux";
import userStore from "./utils/userStore.jsx";

const AppLayout = () => {
  return (
    <StrictMode>
      <Provider store={userStore}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <LogInModal />
          <SignUpVolunteer />
          <Outlet />
          <ToastContainer />
        </div>
        <Footer />
      </Provider>
    </StrictMode>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/victim/form",
        element: <VictimForm />,
      },
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/volunteer/form",
        element: <VolunteerForm />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/map/volunteer",
        element: (
          // <ProtectedRoute>
          <MapVolunteerComponent />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/map/victim",
        element: (
          // <ProtectedRoute>
          <MapVictimComponent />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/about-us",
        element: <Aboutus />,
      },
      {
        path: "/user-profile",
        element: <UserProfile />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SignupModalContext>
      <RouterProvider router={router} />
    </SignupModalContext>
  </React.StrictMode>
);
