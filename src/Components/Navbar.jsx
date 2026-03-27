import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import PageContainer from "./PageContainer";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [services, setServices] = useState([]);
  const location = useLocation();
  const isServiceActive = location.pathname.startsWith("/service");

  useEffect(() => {
    fetch("/serviceData.json")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => { });
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header
  key={location.pathname}
  className="fixed top-4 left-0 w-full z-50"
>
      <PageContainer>
        <div className="">
          {/* Gradient Border */}
          <div
            className="rounded-full bg-gradient-to-r 
          from-[var(--color-orange400)] 
          via-[var(--color-orange500)] 
          to-[var(--color-red500)] p-[2px] shadow-xl"
          >
            <div className="flex items-center justify-between rounded-full bg-white px-6 py-3">
              {/* LEFT MENU (DESKTOP) */}
              <nav className="hidden  lg:flex items-center gap-8 text-sm font-medium text-[var(--color-DarkGray)]">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-base transition font-semibold
                    ${isActive
                      ? "text-[var(--color-orange500)] "
                      : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `text-base transition font-semibold
                    ${isActive
                      ? "text-[var(--color-orange500)] "
                      : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}`
                  }
                >
                  About Us
                </NavLink>

                {/* SERVICES (HOVER FIXED) */}
                <div className="relative">
                  <div className="group inline-block">
                    {/* Trigger */}
                    <button
                      className={`flex items-center gap-1 text-base transition font-semibold
                        ${isServiceActive
                          ? "text-[var(--color-orange500)] "
                          : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}
                      `}
                    >
                      Services <FiChevronDown className="mt-[1px]" />
                    </button>

                    {/* Dropdown */}
                    <div
                      className="absolute left-0 top-full mt-3 w-56
                 rounded-xl bg-[var(--color-LightGray)]
                 border-2 border-orange-500
                 p-2 shadow-2xl
                 opacity-0 invisible 
                 group-hover:opacity-100 group-hover:visible
                 transition-all duration-200"
                    >
                      {services.map((service) => (
                        <NavLink
                          key={service.id}
                          to={`/service/${service.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className={({ isActive }) =>
                            `block  rounded-lg px-4 py-2 text-base transition
     hover:bg-[var(--color-orange100)] hover:text-[var(--color-orange500)]
     ${isActive ? "bg-[var(--color-orange100)] text-[var(--color-orange-500)]" : ""}`
                          }
                        >
                          {service.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PRICING (FIXED HOVER) */}
                <NavLink
                  to="/pricing"
                  className={({ isActive }) =>
                    `text-base transition font-semibold
                    ${isActive
                      ? "text-[var(--color-orange500)] "
                      : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}`
                  }
                >
                  Pricing
                </NavLink>
              </nav>

              {/* LOGO */}
              {/* <NavLink to="/" className="flex flex-col leading-none text-center">
              <span className="text-2xl font-extrabold text-[var(--color-DarkGray)]">
                Relax<span className="text-[var(--color-orange500)]">Drive</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[var(--color-gray500]">
                Care Beyond Clean
              </span>
            </NavLink> */}

            

              {/* LOGO */}
              <NavLink to="/" className="flex items-center">
                <img
                  src="/images/logomain.png" // place logo in public folder
                  alt="RelaxDrive Logo"
                  className="h-10 w-45 object-contain"
                />
              </NavLink>

             
              {/* RIGHT MENU (DESKTOP) */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-DarkGray)]">
                <NavLink
                  to="/gallery"
                  className={({ isActive }) =>
                    `text-base transition font-semibold
                    ${isActive
                      ? "text-[var(--color-orange500)] "
                      : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}`
                  }
                >
                  Video Gallery
                </NavLink>

                 <NavLink
                  to="/product"
                  className={({ isActive }) =>
                    `text-base transition font-semibold
                    ${isActive
                      ? "text-[var(--color-orange500)] "
                      : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}`
                  }
                >
                  Products
                </NavLink>


                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `text-base transition font-semibold
                    ${isActive
                      ? "text-[var(--color-orange500)] "
                      : "text-[var(--color-DarkGray)] hover:text-[var(--color-orange500)]"}`
                  }
                >
                  Contact Us
                </NavLink>

                <NavLink
                  to="/bookaservice"
                  className="ml-2 rounded-full bg-orange600 px-6 py-2 text-sm font-semibold text-white hover:bg-orange500 transition"
                >
                  Book Service
                </NavLink>
              </nav>

              {/* HAMBURGER */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-2xl text-[var(--color-DarkGray)]"
              >
                <FiMenu />
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-xl font-bold">
                  Relax
                  <span className="text-[var(--color-orange500)]">Drive</span>
                </p>
                <p className="text-xs text-[var(--color-gray500] uppercase tracking-widest">
                  Care Beyond Clean
                </p>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-5 text-sm font-medium text-[var(--color-DarkGray)]">
              <NavLink
                to="/"
                className="block"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className="block"
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </NavLink>

              {/* SERVICES MOBILE */}
              <div>
                <button
                  onClick={() => toggleDropdown("services")}
                  className="flex w-full items-center justify-between"
                >
                  Services <FiChevronDown />
                </button>

                {openDropdown === "services" && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 space-y-2">
                    {services.map((service) => (
                      <NavLink
                        key={service.id}
                        to={`/service/${service.id}`}
                        className="block pl-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        {service.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICING MOBILE */}
              <NavLink to="/pricing" className="block" onClick={() => setMobileOpen(false)} >
                Pricing
              </NavLink>
              {/* <div>
                <button
                  onClick={() => toggleDropdown("pricing")}
                  className="flex w-full items-center justify-between"
                >
                  Pricing <FiChevronDown />
                </button>

                {openDropdown === "pricing" && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 space-y-2">
                    <NavLink to="/pricing/basic" className="block pl-2">
                      Basic Plan
                    </NavLink>
                    <NavLink to="/pricing/premium" className="block pl-2">
                      Premium Plan
                    </NavLink>
                  </div>
                )}
              </div> */}

              <NavLink to="/gallery" className="block" onClick={() => setMobileOpen(false)}>
                Video Gallery
              </NavLink>

              <NavLink to="/product" className="block" onClick={() => setMobileOpen(false)}>
                Products
              </NavLink>

              <NavLink to="/contact" className="block" onClick={() => setMobileOpen(false)}>
                Contact Us
              </NavLink>

              <NavLink
                to="/bookaservice" onClick={() => setMobileOpen(false)}
                className="mt-6 block rounded-full bg-orange600 px-5 py-3 text-center text-white font-semibold hover:bg-orange500"
              >
                Book Service
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
