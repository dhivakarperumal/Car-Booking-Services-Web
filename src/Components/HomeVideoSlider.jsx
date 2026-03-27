import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaTimes } from "react-icons/fa";
import "swiper/css";

import SectionHeading from "./SectionHeading";
import VideoCard from "./VideoCard";
import PageContainer from "./PageContainer";

import AOS from "aos";
import "aos/dist/aos.css";

const videos = [
  {
    title: "Car Service Overview",
    thumb: "/images/Home1.webp",
    src: "https://www.youtube.com/embed/nteAVSJhnW8",
  },
  {
    title: "Engine Diagnostics",
    thumb: "/images/Home2.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_2",
  },
  {
    title: "Brake Inspection",
    thumb: "/images/Home3.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_3",
  },
  {
    title: "Premium Car Care",
    thumb: "/images/Home4.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    title: "Workshop Tour",
    thumb: "/images/Home1.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_5",
  },
  {
    title: "Customer Experience",
    thumb: "/images/Home2.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_6",
  },
];

export default function HomeVideoSlider() {
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className="bg-[#0b0f19]">
      <PageContainer>
        <div className="container ">
          <div data-aos="fade-up">
            <SectionHeading
              title="Watch Our Work"
              subtitle="Real service. Real results. Real expertise."
            />
          </div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            spaceBetween={25}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {videos.map((video, i) => (
              <SwiperSlide key={i} className="h-full mt-5" >
                <VideoCard
                  video={video}
                  onClick={() => setActiveVideo(video)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Modal */}
          {activeVideo && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
              <div className="relative bg-black rounded-xl max-w-4xl w-full overflow-hidden">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 text-white text-xl z-10"
                >
                  <FaTimes />
                </button>

                <iframe
                  src={activeVideo.src}
                  className="w-full h-[300px] md:h-[500px]"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </section>
  );
}
