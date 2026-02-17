import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({
  title = "Page Title",
  bgImage = "/images/Home4.webp",
}) => {
  return (
    <section className="relative h-[45vh] min-h-[300px] w-full">
      {/* Background Image */}
      <img
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Title Content (CENTER) */}
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold px-6">
          {title}
        </h1>
      </div>

      {/* Breadcrumbs (BOTTOM) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-300 bg-black/40 px-3 py-2 md:px-4 md:py-2 rounded-full backdrop-blur">
          <Link
            to="/"
            className="hover:text-orange-400 transition"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-orange-400">{title}</span>
        </nav>
      </div>
    </section>
  );
};

export default PageHeader;