import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import Logo from "../assets/images-disaster/Logo.png";
const Footer = () => {
  return (
    <div className="bg-black flex-col text-white">
      <div className="flex justify-center w-full text-white p-10">
        <div className="flex flex-row justify-between md:w-[90%] lg:w-[90%]">
          <div className="hidden md:flex md:flex-[0.3]">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="flex flex-[0.7] justify-around flex-row gap-x-16">
            <div className="flex flex-col gap-4 ">
              <p className="text-lg font-bold">Know More About Us</p>
              <div className="flex gap-x-16">
                <div className="flex flex-col gap-3">
                  <Link className="hover:text-[#38B6FF]">Home</Link>
                  <Link className="hover:text-[#38B6FF]">Our Journey</Link>
                  <Link className="hover:text-[#38B6FF]">Testinomials</Link>
                  <Link className="hover:text-[#38B6FF]">Blogs</Link>
                </div>
                <div className="flex flex-col gap-3">
                  <Link className="hover:text-[#38B6FF]">
                    Disaster Management
                  </Link>
                  <Link className="hover:text-[#38B6FF]">Contact Us</Link>
                  <Link className="hover:text-[#38B6FF]">Privacy Policy</Link>
                  <Link className="hover:text-[#38B6FF]">
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-lg font-bold">Get In Touch</p>
              <p className="">
                We are available 24X7 for you help, please contact:
              </p>
              <p className="font-bold">safesignal@gmail.com</p>
              <p className="flex gap-5 flex-wrap">
                <Link className="rounded-[50%] border-2 p-2 hover:border-[#38B6FF]">
                  <FaFacebookF className="hover:fill-[#38B6FF]" />
                </Link>
                <Link className="rounded-[50%] border-2 p-2 hover:border-[#38B6FF]">
                  <FaInstagram className="hover:fill-[#38B6FF]" />
                </Link>
                <Link className="rounded-[50%] border-2 p-2 hover:border-[#38B6FF]">
                  <FaLinkedin className="hover:fill-[#38B6FF]" />
                </Link>
                <Link className="rounded-[50%] border-2 p-2 hover:border-[#38B6FF]">
                  <FaTwitter className="hover:fill-[#38B6FF]" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <hr className="border-white border w-full" />
        <p className="text-center p-2">
          Copyright 2025 - Safe Signal. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
