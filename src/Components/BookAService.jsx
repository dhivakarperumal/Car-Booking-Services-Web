import React from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";

const BookAService = () => {
  return (
    <>
      <PageHeader title="Book a Service" />

      <section className="min-h-screen bg-gray-800 py-20">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT – FORM */}
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-10 leading-tight">
                Schedule an online <br /> appointment
              </h1>

              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white placeholder-gray-400 outline-none focus:border-[var(--color-orange500)]"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Phone"
                    className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white placeholder-gray-400 outline-none focus:border-[var(--color-orange500)]"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white placeholder-gray-400 outline-none focus:border-[var(--color-orange500)]"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Appointment Reason"
                  className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white placeholder-gray-400 outline-none focus:border-[var(--color-orange500)]"
                />

                <input
                  type="text"
                  placeholder="Vehicle Information"
                  className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white placeholder-gray-400 outline-none focus:border-[var(--color-orange500)]"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="date"
                    className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white outline-none focus:border-[var(--color-orange500)]"
                  />
                  <select className="w-full bg-gray-900 border border-gray-600 px-5 py-4 text-sm text-white outline-none focus:border-[var(--color-orange500)]">
                    <option>9 AM</option>
                    <option>10 AM</option>
                    <option>11 AM</option>
                    <option>12 PM</option>
                    <option>2 PM</option>
                    <option>3 PM</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-8 inline-flex items-center gap-4 bg-[var(--color-orange500)] px-10 py-4 text-sm font-semibold text-white hover:bg-[var(--color-orange600)] transition"
                >
                  BOOK AN APPOINTMENT
                  <FiArrowRight className="text-lg" />
                </button>
              </form>
            </div>

            {/* RIGHT – CONTENT */}
            <div className="bg-black text-white p-12 rounded-lg shadow-xl">
              <h2 className="text-3xl font-bold mb-6">
                Why Choose{" "}
                <span className="text-[var(--color-orange500)]">RelaxDrive</span>?
              </h2>

              <p className="text-gray-400 mb-8 leading-relaxed">
                We provide reliable, transparent, and professional auto care
                services. Book your appointment online and let our experts take
                care of your vehicle.
              </p>

              <ul className="space-y-5">
                {[
                  "Certified & experienced technicians",
                  "Transparent pricing – no hidden costs",
                  "Quick service & on-time delivery",
                  "24/7 customer support",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FiCheckCircle className="text-[var(--color-orange500)] text-lg" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-gray-700 pt-6">
                <p className="text-sm text-gray-400">Need help?</p>
                <p className="text-xl font-bold text-white">
                  Call us:{" "}
                  <span className="text-[var(--color-orange500)]">
                    +91 98765 43210
                  </span>
                </p>
              </div>
            </div>

          </div>
        </PageContainer>
      </section>
    </>
  );
};

export default BookAService;