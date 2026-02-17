import React from "react";

export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center mb-20">

      {/* Title */}
      <h2 className="text-2xl md:text-5xl font-extrabold bg-white bg-clip-text text-transparent">
        {title}
      </h2>

      {/* Accent Line */}
      <div className="flex justify-center mt-1 md:mt-4 mb-5">
        <span className="w-20 h-[3px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-400 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}

    </div>
  );
}
