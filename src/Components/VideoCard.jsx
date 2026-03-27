import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaPlay } from "react-icons/fa";

export default function VideoCard({ video, onClick }) {

      useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div
      onClick={onClick}
      data-aos="zoom-in-up"
      className="
group cursor-pointer rounded-2xl
bg-[#0b0f19]
border-3 border-orange-300/40
overflow-hidden
transition-all duration-500
flex flex-col h-full
shadow-[0_0_10px_rgba(255,140,0,0.15)]
relative

md:hover:-translate-y-2
md:hover:border-orange-400/80
md:hover:shadow-[0_0_40px_rgba(255,140,0,0.5)]
"
    >
      {/* Image Wrapper */}
      <div className="relative">
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

        <img
          src={video.thumb}
          alt={video.title}
          className="w-full h-[220px] object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(255,140,0,0.8)] transition">
            <FaPlay />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-[#0b0f19] flex-1">
        <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-500 group-hover:to-orange-600 transition">
          {video.title}
        </h3>

        <p className="text-sm text-gray-300 mt-3 leading-relaxed group-hover:text-gray-100 transition">
          {video.desc} Learn how our certified technicians deliver precision,
          quality inspections, and reliable automotive care using modern tools
          and trusted service standards.
        </p>
      </div>
    </div>
  );
}
