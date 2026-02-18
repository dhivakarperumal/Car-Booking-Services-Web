import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ServiceCard from "./ServiceCard";

export default function ServiceSwiper() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-24">
        Loading services...
      </p>
    );
  }

  if (!services.length) {
    return (
      <p className="text-center text-gray-400 py-24">
        No services available.
      </p>
    );
  }

  return (
    <section className="bg-black py-24">

      <div className="container mx-auto px-6">

        {/* TITLE */}
        <div className="text-center mb-16">
          <span className="text-sky-400 uppercase tracking-widest text-sm">
            Our Services
          </span>

          <h2 className="text-white text-4xl md:text-5xl font-extrabold mt-4">
            What We Offer
          </h2>
        </div>

        {/* SWIPER */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          grabCursor
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {services.map((service) => (
            <SwiperSlide key={service.id} className="mt-5 mb-8 h-auto">
              <ServiceCard service={service} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  );
}
