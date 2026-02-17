import { useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";
import SectionHeading from "./SectionHeading";
import VideoCard from "./VideoCard";

const videos = [
  {
    title: "Car Service Overview",
    desc: "Behind-the-scenes look at our professional car servicing process.professional car servicing process.",
    thumb: "/images/Home1.webp",
    src: "https://www.youtube.com/embed/nteAVSJhnW8",
  },
  {
    title: "Engine Diagnostics",
    desc: "Advanced tools helping us identify engine issues faster.",
    thumb: "/images/Home2.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_2",
  },
  {
    title: "Brake Inspection",
    desc: "Complete inspection process ensuring braking safety.",
    thumb: "/images/Home3.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_3",
  },
  {
    title: "Premium Car Care",
    desc: "Premium detailing and vehicle care services.",
    thumb: "/images/Home4.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
  {
    title: "Workshop Tour",
    desc: "Guided tour of our modern automotive workshop.",
    thumb: "/images/Home1.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_5",
  },
  {
    title: "Customer Experience",
    desc: "Real stories from customers who trust our service.",
    thumb: "/images/Home2.webp",
    src: "https://www.youtube.com/embed/VIDEO_ID_6",
  },
];

export default function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      <PageHeader title="Video Gallery" />

      <section className="py-15 bg-[#0b0f19]">
        <PageContainer>
          <div>
            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, i) => (
                <VideoCard
                  key={i}
                  video={video}
                  onClick={() => setActiveVideo(video)}
                />
              ))}
            </div>

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
    </>
  );
}
