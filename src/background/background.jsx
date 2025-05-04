import React from "react";
import image1 from "../assets/images-disaster/collage1.jpeg";
import image2 from "../assets/images-disaster/collage2.jpeg";
import image3 from "../assets/images-disaster/collage3.jpeg";
import "../App.css"; // For keyframes animation

const BackgroundSlideshow = () => {
  return (
    <div
      className="w-full h-[80vh] md:h-[80vh] lg:h-[80vh] object-contain bg-cover bg-center animate-background-swap -z-10 relative"
      style={{
        "--image1": `url(${image1})`,
        "--image2": `url(${image2})`,
        "--image3": `url(${image3})`,
      }}
    ></div>
  );
};

export default BackgroundSlideshow;
