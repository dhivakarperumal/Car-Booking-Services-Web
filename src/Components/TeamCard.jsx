import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const TeamCard = ({ member }) => {

  useEffect(() => {
  AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 120,
  });
}, []);

  return (
    <div data-aos="fade-up" className="group relative overflow-hidden">
      {/* IMAGE */}
      <img
        src={member.image}
        alt={member.name}
        className="h-[290px] md:h-[330px] w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-between ">
        {/* TOP ORANGE BORDER */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-orange-500" />

        {/* CONTENT */}
        <div className="p-6 pt-10">
          <h3 className="text-white text-xl font-semibold uppercase">
            {member.name}
          </h3>
          <p className="text-gray-300 mt-1">{member.role}</p>
        </div>

        {/* SOCIAL ICONS */}
        <div className="pb-8 flex justify-center gap-4 cursor-pointer">
          <SocialIcon icon={<FaFacebookF />} />
          <SocialIcon icon={<FaInstagram />} />
          <SocialIcon icon={<FaTwitter />} />
          <SocialIcon icon={<FaWhatsapp />} />
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <div className="w-8 h-8 bg-orange-500 flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition cursor-pointer">
    {icon}
  </div>
);

export default TeamCard;