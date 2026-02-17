import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    "HOME",
    "SERVICES",
    "PRICING",
    "PRODUCTS",
    "ABOUT",
    "CONTACT US",
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Glow line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse" />

      <div className="bg-black backdrop-blur-md border-b border-sky-400/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <img
                src="/logo.png"
                alt="DucatiBox Logo"
                className="h-12 w-auto object-contain transition
                           group-hover:scale-105
                           drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
              />
            </div>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="relative text-gray-300 text-[14px] font-bold tracking-[0.2em]
                             transition-all duration-300
                             hover:text-sky-400
                             hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]
                             after:absolute after:left-1/2 after:-bottom-2
                             after:h-[2px] after:w-0 after:-translate-x-1/2
                             after:bg-gradient-to-r after:from-sky-400 after:to-cyan-300
                             after:transition-all after:duration-300
                             hover:after:w-full"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA BUTTON */}
            <div className="hidden md:block">
              <button
                className="relative cursor-pointer px-6 py-2.5 rounded-md font-bold text-xs tracking-[0.2em]
                           text-sky-400 border border-sky-400/60
                           transition-all duration-300
                           hover:text-black hover:bg-sky-400
                           hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]
                           before:absolute before:inset-0 before:rounded-md
                           before:border before:border-sky-400/40
                           before:opacity-0 hover:before:opacity-100"
              >
                BOOK SERVICE
              </button>
            </div>

            {/* HAMBURGER */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col gap-1"
            >
              <span className={`w-6 h-[2px] bg-white transition ${isOpen && "rotate-45 translate-y-2"}`} />
              <span className={`w-6 h-[2px] bg-white transition ${isOpen && "opacity-0"}`} />
              <span className={`w-6 h-[2px] bg-white transition ${isOpen && "-rotate-45 -translate-y-2"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-black/95 backdrop-blur transition-all duration-300 overflow-hidden
        ${isOpen ? "max-h-[420px] border-t border-sky-400/20" : "max-h-0"}`}
      >
        <nav className="flex flex-col px-6 py-6 gap-6">
          {links.map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-300 text-xs font-bold tracking-[0.2em]
                         hover:text-sky-400 transition"
            >
              {item}
            </a>
          ))}

          <button
            className="mt-4 px-5 py-2.5 rounded-md font-bold text-xs tracking-[0.2em]
                       text-black bg-sky-400
                       shadow-[0_0_25px_rgba(56,189,248,0.6)]"
          >
            BOOK SERVICE
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;