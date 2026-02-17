import React from "react";
import PageContainer from "./PageContainer";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HowToService = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
  }, []);

  return (
    <section className="bg-[#0f0f0f] py-24 text-white">
      <PageContainer>
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* LEFT CONTENT */}
            <div data-aos="fade-right">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-wide">
                HOW TO SERVICE <br /> YOUR CAR
              </h2>

              <p className="mt-8 text-gray-400 leading-relaxed max-w-sm">
                Rather than letting your services go by, take these steps to
                keep your car in good shape until you can afford a full service.
              </p>
            </div>

            {/* RIGHT STEPS */}
            <div
              data-aos="fade-up"
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16"
            >
              {/* STEP 01 */}
              <div
                data-aos="fade-up"
                data-aos-delay="0"
                className="border-t border-gray-700 hover:border-[var(--color-orange500)] transition-colors duration-300 border-t-2 pt-8"
              >
                <h4 className="flex items-center gap-4 text-xl font-bold">
                  <span className="text-orange-500">01</span>
                  MAKE AN APPOINTMENT
                </h4>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  Promotors has made it easy to schedule an appointment online
                  at a location near you in a few simple steps, easy schedule
                  for customers.
                </p>
              </div>

              {/* STEP 02 */}
              <div
                data-aos-delay="150"
                className="border-t border-gray-700 hover:border-[var(--color-orange500)] transition-colors duration-300 border-t-2 pt-8"
              >
                <h4 className="flex items-center gap-4 text-xl font-bold">
                  <span className="text-orange-500">02</span>
                  SELECT SERVICE
                </h4>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  We specialize in car services and have more than 20 years of
                  experience in cars. We are car guys from day one. We love and
                  respect cars.
                </p>
              </div>

              {/* STEP 03 */}
              <div
                data-aos-delay="300"
                className="border-t border-gray-700 hover:border-[var(--color-orange500)] transition-colors duration-300 border-t-2 pt-8"
              >
                <h4 className="flex items-center gap-4 text-xl font-bold">
                  <span className="text-orange-500">03</span>
                  CONFIRM REQUEST
                </h4>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  Has your request been confirmed? Reduce no-shows, save time,
                  and focus on serving clients is our top criterion.
                </p>
              </div>

              {/* STEP 04 */}
              <div
                data-aos-delay="450"
                className="border-t border-gray-700 hover:border-[var(--color-orange500)] transition-colors duration-300 border-t-2 pt-8"
              >
                <h4 className="flex items-center gap-4 text-xl font-bold">
                  <span className="text-orange-500">04</span>
                  GET YOUR CAR
                </h4>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  It is a vehicle inspection that keeps your car in a reliable,
                  safe and fully-functioning condition based on guidelines set
                  out by the vehicle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default HowToService;
