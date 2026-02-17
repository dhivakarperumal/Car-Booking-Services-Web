import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import SectionHeading from "./SectionHeading";
import PageContainer from "./PageContainer";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const brands = [
  { name: "Honda", logo: "/images/Honda.png" },
  { name: "BMW", logo: "/images/BMW.png" },
  { name: "Jaguar", logo: "/images/Jaguar.png" },
  { name: "Dodge", logo: "/images/Dodge.png" },
  { name: "Ford", logo: "/images/Ford.png" },
  { name: "Toyota", logo: "/images/Toyota.png" },
];

export default function Brands() {

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
  }, []);

  return (
    <section className="py-6  bg-black">
      <PageContainer>
      <div data-aos="fade-up" className="container ">
        {/* Heading */}
        <div data-aos="fade-down">
  <SectionHeading
    title="Trusted by Leading Auto Brands"
    subtitle="Premium service across all major manufacturers"
  />
</div>


        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {brands.map((brand, i) => (
            <SwiperSlide key={i}>
              <div className="group bg-white rounded-2xl h-[130px] mt-3 mb-10 flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <span className="absolute inset-0 rounded-2xl border-4 border-orange-400 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-16 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </PageContainer>
    </section>
  );
}
