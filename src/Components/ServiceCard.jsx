import React from 'react'

const ServiceCard = ({ service }) => {
  return (
    <div
      className="group relative bg-[#0b0f14]
                 border border-white/10
                 transition-all duration-500
                 hover:scale-105
                 hover:border-sky-400
                 hover:shadow-[0_25px_70px_rgba(56,189,248,0.35)]"
    >
      <div className="p-8 text-center">

        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-4">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {service.description}
        </p>

        {/* Image */}
        <div className="relative mb-10">
          <img
            src={service.image}
            alt={service.title}
            className="mx-auto rounded-md"
          />

          {/* Floating Icon */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2
                       w-14 h-14 bg-sky-400 rounded-full
                       flex items-center justify-center
                       border-4 border-black
                       shadow-[0_0_25px_rgba(56,189,248,0.6)]"
          >
            <span className="text-black text-xl font-bold">⚙</span>
          </div>
        </div>

        {/* Button */}
        <button
          className="w-full py-3 text-xs font-bold tracking-[0.25em]
                     text-gray-300 border border-white/20
                     transition-all duration-300
                     group-hover:bg-sky-400
                     group-hover:text-black
                     group-hover:border-sky-400
                     group-hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]"
        >
          READ MORE
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;