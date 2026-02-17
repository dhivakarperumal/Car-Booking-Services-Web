import React, { useEffect, useState } from "react";
import PricingCard from "./PricingCard";
import AOS from "aos";
import "aos/dist/aos.css";
import SectionHeading from "./SectionHeading";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";

export default function Pricing() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    fetch("/Pricing.json")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
    <PageHeader title="OUR PRICING"/>
    <section className="py-24 bg-[#0b0f19]">
      <PageContainer>
      <div className="">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((item, i) => (
            <PricingCard
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 150}
              item={item}
            />
          ))}
        </div>
      </div>
      </PageContainer>
    </section>
    </>
  );
}
