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
        <header className="bg-black border-b border-sky-400/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* ✅ LOGO IMAGE */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="DucatiBox Logo"
                            className="h-15 w-auto object-contain"
                        />
                    </div>

                    {/* DESKTOP MENU */}
                    <nav className="hidden md:flex items-center gap-7">
                        {links.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="relative text-gray-300 text-sm font-semibold tracking-widest
                           hover:text-sky-400 transition font-bold
                           after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0
                           after:bg-gradient-to-r after:from-sky-400 after:to-cyan-300
                           hover:after:w-full after:transition-all"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <button className="relative overflow-hidden px-6 py-2.5 rounded-md font-bold tracking-widest
                               text-black bg-gradient-to-r from-sky-400 to-cyan-300
                               hover:shadow-xl hover:shadow-sky-400/40 transition">
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

            {/* MOBILE MENU */}
            <div className={`md:hidden bg-black transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[420px] border-t border-sky-400/20" : "max-h-0"}`}>
                <nav className="flex flex-col px-6 py-6 gap-5">
                    {links.map((item) => (
                        <a key={item} href="#" className="text-gray-300 text-sm font-semibold tracking-widest hover:text-sky-400">
                            {item}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;