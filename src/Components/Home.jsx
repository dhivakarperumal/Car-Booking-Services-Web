import { useEffect, useState } from "react";
import About from "./About";
import Services from "./Services";
import Brands from "./Brands";
import HomeVideoSlider from "./HomeVideoSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import HomePricing from "./HomePricing";
import TeamSwiper from "./TeamSwiper";

export default function HomeHeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/homeHeroData.json")
      .then((res) => res.json())
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="h-screen w-full bg-black flex items-center justify-center">
        <span className="text-white text-lg"></span>
      </section>
    );
  }

  return (
    <>
      {/* HERO SLIDER */}
      <section className="relative h-screen overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-screen">
                <img
                  src={slide.image}
                  className="w-full h-full object-cover"
                  alt={slide.title}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange500/20 via-orange500/15 to-orange500/20" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="px-6">
                    <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
                      {slide.title} <br />
                      <span className="font-light italic">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="text-gray-300 max-w-xl mx-auto mt-6 hidden md:block">
                      {slide.desc}
                    </p>

                    <button
                      className="mt-6 bg-orange700 hover:bg-orange400 transition text-white
                      px-5 py-2 text-sm md:px-8 md:py-4 md:text-base rounded-full cursor-pointer"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div>
        <Services />
      </div>
      <div>
        <HomePricing />
      </div>
      <div>
        <About />
      </div>
      <div>
        <HomeVideoSlider />
      </div>
      <div>
        <TeamSwiper />
      </div>
      <div>
        <Brands />
      </div>
    </>
  );
}
