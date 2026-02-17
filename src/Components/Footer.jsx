import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";
import PageContainer from "./PageContainer";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-10">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1.1fr_1.8fr] gap-10">

          {/* 1️⃣ LOGO + DESCRIPTION */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full border-2 border-[var(--color-orange500)] flex items-center justify-center">
                <span className="text-[var(--color-orange500)] font-bold">RD</span>
              </div>
              <h2 className="text-xl font-bold">
                Relax<span className="text-[var(--color-orange500)]">Drive</span>
              </h2>
            </div>

            <p className="text-sm text-gray-100 leading-relaxed">
              Every service is rigorously screened and constantly rated to ensure
              you get the best service experience. Every service screened and constantly rated to ensure experience.
            </p>

            <p className="mt-5 text-sm text-gray-100">Support center 24/7</p>
            <p className="mt-2 text-xl font-bold text-white flex items-center gap-2">
              <FiPhone className="text-[var(--color-orange500)]" />
              +91 98765 43210
            </p>
          </div>

          {/* 2️⃣ QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-lg font-semibold uppercase text-[var(--color-orange500)]">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-100">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Pricing", path: "/pricing" },
                { name: "Video Gallery", path: "/gallery" },
                { name: "Products", path: "/product" },
                { name: "Contact Us", path: "/contact" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-[var(--color-orange500)] transition cursor-pointer"
                  >
                    <FiChevronRight className="text-[var(--color-orange500)] text-sm" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3️⃣ CONTACT INFO */}
          <div>
            <h3 className="mb-5 text-lg font-semibold uppercase text-[var(--color-orange500)]">
              Contact Info
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <FiPhone className="mt-1 text-[var(--color-orange500)]" />
                <div>
                  <span className="block text-white font-medium">Phone</span>
                  +91 98765 43210
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FiMail className="mt-1 text-[var(--color-orange500)]" />
                <div>
                  <span className="block text-white font-medium">Email</span>
                  support@relaxdrive.com
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-[var(--color-orange500)]" />
                <div>
                  <span className="block text-white font-medium">Address</span>
                  No.12, Anna Nagar,<br />
                  Chennai, Tamil Nadu – 600040
                </div>
              </li>
            </ul>
          </div>

          {/* 4️⃣ MAP */}
          <div>
            <h3 className="mb-5 text-lg font-semibold uppercase text-[var(--color-orange500)]">
              Our Location
            </h3>

            <div className="overflow-hidden rounded-lg border border-gray-700">
              <iframe
                title="map"
                src="https://www.google.com/maps?q=Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-48 w-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RelaxDrive. All rights reserved.
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;