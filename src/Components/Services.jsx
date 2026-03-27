import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import PageContainer from "./PageContainer";
import SectionHeading from "./SectionHeading";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });

    fetch("/serviceData.json")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);

        // Refresh after data loads
        setTimeout(() => {
          AOS.refresh();
        }, 300);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-10 bg-gray-800">
      <PageContainer>
        <div data-aos="fade-up">
        <SectionHeading
          title="Exceptional Service"
          subtitle="Premium automotive care built on trust and performance"
        />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((item) => (
            <div
            data-aos="zoom-in-up"
              key={item.id}
              className="group relative bg-black rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              {/* Top Border */}
              <span className="absolute top-0 left-0 w-full h-[4px] bg-white group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-500" />

              {/* Glow */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 via-transparent to-transparent opacity-100" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {item.title}
                </h3>

                <p className="text-gray-300 leading-relaxed mb-8">
                  {item.shortDesc}
                </p>

                {/* Bottom */}
                <div className="mt-auto flex items-center justify-between">
                  {/* Icon (fallback safe) */}
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center group-hover:bg-orange-400 transition">
                    <img
                      src={item.icon || "/images/default-service.svg"}
                      className="w-10 brightness-0 invert"
                      alt={item.title}
                    />
                  </div>

                  {/* Book Now */}
                  <div
                    onClick={() => navigate(`/service/${item.id}`)}
                    className="flex items-center gap-2 text-orange-400 font-semibold tracking-wide cursor-pointer hover:text-orange-300 transition"
                  >
                    LEARN MORE <FaArrowRight />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}