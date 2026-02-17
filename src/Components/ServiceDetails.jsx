import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "./PageHeader";
import PageContainer from "./PageContainer";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import TeamSwiper from "./TeamSwiper";

import AOS from "aos";
import "aos/dist/aos.css";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 900,
      easing: "ease-out-cubic",
    });

    fetch("/serviceData.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.id === id);
        setService(found);
      });
  }, [id]);

  if (!service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-800">
        <PageContainer>
          <div className="bg-black w-full rounded-2xl shadow-xl p-10 text-center">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-orange-100 px-6 py-2 text-orange-600 font-semibold text-sm">
                Service Unavailable
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100">
              This Service Was Not Found
            </h1>

            <p className="text-gray-300 mb-8 leading-relaxed">
              The service you are trying to view may have been removed, renamed,
              or is temporarily unavailable. Please explore our available
              services or return to the homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/"
                className="rounded-full bg-orange600 px-6 py-3 text-white font-semibold hover:bg-orange500 transition"
              >
                Go to Home
              </NavLink>

              <NavLink
                to="/"
                onClick={() => window.history.back()}
                className="rounded-full border border-orange-500 px-6 py-3 text-orange-600 font-semibold hover:bg-orange-50 transition"
              >
                Go Back
              </NavLink>
            </div>
          </div>
        </PageContainer>
      </section>
    );
  }

  return (
    <>
      <PageHeader title={service.title} />

      <section className="py-20 bg-[#0f0f0f] text-gray-300">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ================= LEFT CONTENT ================= */}
            <div className="lg:col-span-2 space-y-10">
              {/* Main Image */}
              {/* Main Image Swiper */}
              <Swiper
                data-aos="zoom-in"
                modules={[Navigation]}
                navigation
                loop={true}
                className="rounded-xl overflow-hidden"
              >
                {service.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`${service.title} ${index + 1}`}
                      className="w-full h-[420px] object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Description */}
              <ul
                data-aos="fade-up"
                className="space-y-6 text-sm leading-relaxed list-disc list-inside text-gray-300 marker:text-orange-500"
              >
                <li className="text-justify">{service.details.paragraph1}</li>
                <li className="text-justify">{service.details.paragraph2}</li>
                <li className="text-justify">{service.details.paragraph3}</li>
              </ul>
              {/* Reviews */}
              <div data-aos="fade-up">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Recent Review & Rating
                </h2>

                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  {service.reviews.map((review, index) => (
                    <SwiperSlide
                      className="h-auto"
                      data-aos="fade-up"
                      data-aos-delay={index * 120}
                      key={index}
                    >
                      <div
                        className="bg-[#151515] border border-orange500 p-6 rounded-xl border border-white/10
                          h-[155px] flex flex-col"
                      >
                        <div
                          className="text-sm italic leading-normal text-white/90
                          overflow-y-auto pr-2 mb-4 flex-1 hide-scrollbar"
                        >
                          “{review.comment}”
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-semibold text-white">
                            {review.name}
                          </span>
                          <span className="text-orange-500">
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="space-y-8 lg:sticky lg:top-24 self-start">
              {/* GET SERVICE */}
              <div data-aos="fade-left" className="bg-[#111] p-8 rounded-xl border border-white/10">
                <h3 className="text-2xl font-extrabold tracking-widest uppercase text-white mb-4">
                  Get Service
                </h3>

                <p className="text-base leading-relaxed text-gray-300 mb-8">
                  With quality parts to meet every budget and friendly staff
                  trained to make your visit informative and hassle free.
                </p>

                <NavLink
                  to="/bookaservice"
                  className="inline-flex items-center justify-center bg-orange600 text-white font-extrabold uppercase tracking-wider px-8 py-4 clip-path-btn hover:bg-orange500 transition"
                >
                  Get Service
                </NavLink>
              </div>

              {/* CONTACT US */}
              <div className="bg-[#111] p-8 rounded-xl border border-white/10">
                <h3 className="text-2xl font-extrabold tracking-widest uppercase text-white mb-6">
                  Contact Us
                </h3>

                <p className="text-base text-gray-300 mb-2">+1 123 456 7890</p>
                <p className="text-base text-gray-300">
                  support@relaxdrive.com
                </p>
              </div>

              {/* ADDRESS */}
              <div className="bg-[#111] p-8 rounded-xl border border-white/10">
                <h3 className="text-2xl font-extrabold tracking-widest uppercase text-white mb-6">
                  Address
                </h3>

                <p className="text-base leading-relaxed text-gray-300">
                  19 First Drive, Middletown,
                  <br />
                  New York, United States
                </p>
              </div>

              {/* OPEN HOURS */}
              <div className="bg-[#111] p-8 rounded-xl border border-white/10">
                <h3 className="text-2xl font-extrabold tracking-widest uppercase text-white mb-6">
                  Open Hours
                </h3>

                <p className="text-base text-gray-300 mb-1">
                  Mon – Fri: 8am – 6pm
                </p>
                <p className="text-base text-gray-300 mb-1">
                  Saturday: 9am – 4pm
                </p>
                <p className="text-base text-gray-300">Sunday: Closed</p>
              </div>
            </aside>
          </div>
        </PageContainer>
      </section>
      {/* <TeamSwiper /> */}
    </>
  );
};

export default ServiceDetails;
