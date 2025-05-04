import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import image1 from "../assets/images-disaster/collage1.jpeg";
import image2 from "../assets/images-disaster/collage2.jpeg";
import image3 from "../assets/images-disaster/collage3.jpeg";
import Alerts from "../assets/Icons/Alerts.png";
import Help from "../assets/Icons/Help.png";
import Map from "../assets/Icons/Map.png";
import Volunteer from "../assets/Icons/volunteer.png";
import axios from "axios";
import "react-multi-carousel/lib/styles.css";
import BackgroundSlideshow from "../background/background";
import { useEffect } from "react";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const sliderImageUrl = [image1, image2, image3];

export default function HeroSection() {
  return (
    <div>
      <BackgroundSlideshow />
      <div className="absolute inset-0 h-[80vh] bg-black opacity-75"></div>
      <div className="inset-0 flex flex-col items-center justify-center h-[80vh] gap-5 absolute w-full">
        <div className="flex flex-col text-white top-20 h-full flex-0.5 justify-end gap-1 items-center">
          <p className="text-3xl text-white md:text-4xl lg:md:text-5xl font-bold text-center">
            Real-Time Disaster Assistance at Your Fingertips
          </p>
          <p className="text-lg text-white md:text-xl text-center">
            Join hands to provide shelter, food, and medical aid to families
            impacted by floods, earthquakes, and cyclones.
          </p>
        </div>

        <div className="text-lg flex text-white md:text-xl flex-0.5 h-full">
          <div className="flex mt-4 justify-center gap-16 h-[50px]">
            <Link
              to="/victim/form"
              className="text-white bg-red-500 shadow-lg rounded-md md:px-4 md:py-1 px-2 lg:px-4 lg:py-1 flex justify-center items-center"
            >
              Get Help Now
            </Link>
            <Link
              to="/volunteer/form"
              className="text-white rounded-md bg-[#37B6FF] shadow-lg md:px-4 md:py-1 lg:px-4 lg:py-1 px-2 flex justify-center items-center"
            >
              Become Volunteer
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col gap-10 p-10">
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold">
          How Safe Signal Helps
        </p>
        <div className="flex justify-evenly gap-10 flex-col md:flex-row">
          <div className="flex-1 flex justify-center flex-col items-center gap-5 ">
            <img src={Map} alt="Map" className="w-[5rem] h-[5rem]" />
            <div className="flex flex-col gap-4 item-center justify-center text-center">
              <p className="flex justify-center text-xl font-bold">
                Live Disaster Map
              </p>
              <p>Track real-time disaster updates and affected areas.</p>
            </div>
          </div>
          <div className="flex-1  flex justify-center flex-col items-center gap-5">
            <img src={Alerts} alt="Alerts" className="w-[5rem] h-[5rem]" />
            <div className="flex flex-col gap-4 item-center justify-center text-center">
              <p className="flex justify-center text-xl font-bold">
                Emergency Alerts
              </p>
              <p>Get SMS notifications for urgent</p>
            </div>
          </div>
          <div className="flex-1  flex justify-center flex-col items-center gap-5">
            <img src={Help} alt="Help" className="w-[5rem] h-[5rem]" />
            <div className="flex flex-col gap-4 item-center justify-center text-center">
              <p className="flex justify-center text-xl font-bold">
                Report & Request Help
              </p>
              <p>Instantly report incidents or request aid.</p>
            </div>
          </div>
          <div className="flex-1  flex justify-center flex-col items-center gap-5">
            <img
              src={Volunteer}
              alt="Volunteer"
              className="w-[5rem] h-[5rem]"
            />
            <div className="flex flex-col gap-4 item-center justify-center text-center">
              <p className="flex justify-center text-xl font-bold">
                Volunteer & Help
              </p>
              <p>Join relief efforts and connect with those in need.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-[#44abe7] text-white lg:text-lg">
        <div className="flex flex-col justify-center gap-10 p-10 w-[90%]">
          <p className="text-3xl font-bold md:text-4xl lg:text-5xl flex justify-center">
            Why It Matters
          </p>
          <div className="flex justify-center items-center flex-col gap-5">
            <p className="flex justify-center m">
              In times of crisis, access to accurate information and swift
              response saves lives. Our platform bridges the gap between
              victims, rescuers, and relief organizations—ensuring no one is
              left behind. India is one of the most disaster prone countries in
              the world, 23 out of 28 states are multi-disaster prone regions.
              Every year millions of Indians were affected by natural disasters.
              These disasters leave people traumatised by the death of family,
              friends and their lives devastated by their loss of livelihood.
              The impact is high and it has been increasing dramatically in the
              last few decades in terms of number of people affected and the
              length of time they are affected for. This trend is expected to
              keep rising in coming years. To deal with disasters, there is an
              urgent need of local institution, which can play a pro-active role
              in disaster management. This resulted in the establishment of
              Rapid Response, a registered Indian charity dedicated to provide
              disaster response and preparedness activities across India.
            </p>
            <p>
              <b>Join the Movement. Make a Difference. </b>
              Be a part of the change. Sign up, volunteer, or donate today.
              Together, we can build a safer future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
