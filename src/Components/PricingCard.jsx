import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function PricingCard({ item }) {
  const navigate = useNavigate();

  useEffect(() => {
  AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 120,
  });
}, []);

  return (
    <div
     data-aos="zoom-in-up"
  data-aos-delay={item.delay || 0}
      className="
group bg-black/80 rounded-2xl border-2 border-orange-400/40
p-6 md:p-8
flex flex-col h-full justify-between
transition-all duration-500
relative

shadow-[0_0_18px_rgba(255,140,0,0.35),inset_0_0_10px_rgba(255,140,0,0.15)]

md:hover:-translate-y-2
md:hover:border-orange-400
md:hover:shadow-[0_0_45px_rgba(255,140,0,0.6),inset_0_0_15px_rgba(255,140,0,0.25)]
"
    >
      <h3 className="text-white font-bebas tracking-widest text-xl">
        {item.name}
      </h3>

      <div className="my-6">
        <span className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
         ₹{item.price}
        </span>
      </div>

      <div className="h-[1px] bg-gray-700 my-4" />

      <ul className="space-y-3 text-gray-300 text-sm">
        {item.features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-orange-400">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/bookaservice")}
        className="mt-8 bg-orange-600 hover:bg-orange-500 transition text-white py-3 rounded-lg font-semibold cursor-pointer"
      >
        GET STARTED
      </button>
    </div>
  );
}
