import { useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <section className="bg-[#0b0f19] py-20 overflow-hidden">
      <PageContainer>
        <div data-aos="fade-up" className="container grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <div data-aos="fade-right" className="text-white space-y-6">
            <h2 className="text-2xl md:text-5xl font-extrabold uppercase">
              We Make Auto Repair <br />
              <span className="text-orange-500">More Convenient</span>
            </h2>

            <p className="text-gray-400 max-w-lg">
              We operate across multiple locations delivering professional
              maintenance and repair services with certified technicians and
              modern equipment wherever you are.
            </p>

            {/* Progress Bars */}

            {/* Experts */}
            <div>
              <div className="flex justify-between mb-2">
                <span>Highly Qualified Experts</span>
                <span>90%</span>
              </div>

              <div className="h-3 bg-gray-700 rounded">
                <div
                  className={`h-3 bg-orange-500 rounded transition-all duration-1000 ${
                    loaded ? "w-[90%]" : "w-0"
                  }`}
                />
              </div>
            </div>

            {/* Facility */}
            <div>
              <div className="flex justify-between mb-2">
                <span>Clean, Modern Facility</span>
                <span>99%</span>
              </div>

              <div className="h-3 bg-gray-700 rounded">
                <div
                  className={`h-3 bg-orange-500 rounded transition-all duration-1000 ${
                    loaded ? "w-[99%]" : "w-0"
                  }`}
                />
              </div>
            </div>

            <button className="mt-6 bg-gradient-to-r from-orange-300 to-orange-500 px-8 py-3 rounded-full hover:opacity-90 transition cursor-pointer">
              Learn More
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div data-aos="zoom-in" data-aos-delay="200" className="relative">
            <img
              src="/images/About.jpg"
              alt="about"
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
