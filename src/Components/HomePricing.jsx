import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import SectionHeading from "./SectionHeading";
import PricingCard from "./PricingCard";
import PageContainer from "./PageContainer";

import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePricing() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      disableMutationObserver: true,
    });

    fetch("/Pricing.json")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);

        setTimeout(() => {
          AOS.refresh();
        }, 400);
      })
      .catch(console.error);
  }, []);

  return (
    <section className=" pt-10 bg-[#0b0f19]">
      <PageContainer>
      <div className="">
        <div data-aos="fade-up">
          <SectionHeading
            title="PRICING PLANS"
            subtitle="Flexible service packages designed for you"
          />
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500 }}
          loop
          spaceBetween={25}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {services.map((item, i) => (
            <SwiperSlide
              key={i}
              className="h-full mt-5"
              data-aos="zoom-in-up"
              data-aos-delay={i * 120}
            >
              <PricingCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </PageContainer>
    </section>
  );
}
