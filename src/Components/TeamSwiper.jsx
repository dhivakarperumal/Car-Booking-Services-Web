// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";

// import TeamCard from "./TeamCard";
// import PageContainer from "./PageContainer";
// import SectionHeading from "./SectionHeading";

// const TeamSwiper = ({
//   autoplay = false,
//   loop = true,
//   showNavigation = true,
// }) => {
//   const [team, setTeam] = useState([]);

//   useEffect(() => {
//     fetch("/teamData.json")
//       .then((res) => res.json())
//       .then((data) => setTeam(data));
//   }, []);

//   return (
//     <div className="bg-black py-10">
//       <PageContainer>
//         <SectionHeading
//           title="Meet Our Expert Team"
//           subtitle="Certified professionals dedicated to keeping your vehicle in perfect condition"
//         />

//         <Swiper
//           modules={[Navigation, Autoplay]}
//           navigation
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           loop={true}
//           spaceBetween={24}
//           slidesPerView={1}
//           breakpoints={{
//             640: {
//               slidesPerView: 1,
//             },
//             768: {
//               slidesPerView: 2,
//             },
//             1024: {
//               slidesPerView: 4,
//             },
//           }}
//         >
//           {team.map((member, index) => (
//             <SwiperSlide key={index}>
//               <TeamCard member={member} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </PageContainer>
//     </div>
//   );
// };

// export default TeamSwiper;

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import TeamCard from "./TeamCard";
import PageContainer from "./PageContainer";
import SectionHeading from "./SectionHeading";

import AOS from "aos";
import "aos/dist/aos.css";

export default function TeamSwiper() {
  const [team, setTeam] = useState([]);
  const [swiperKey, setSwiperKey] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });

    fetch("/teamData.json")
      .then((res) => res.json())
      .then((data) => {
        setTeam(data);
        setSwiperKey((k) => k + 1);
      });
  }, []);

  // Prevent Swiper mounting with empty data
  if (!team.length) return null;

  return (
    <div className="bg-black py-10">
      <PageContainer className="overflow-x-hidden">
        <div data-aos="fade-up">
          <SectionHeading
            title="Meet Our Expert Team"
            subtitle="Certified professionals dedicated to keeping your vehicle in perfect condition"
          />
        </div>

        <Swiper
          key={swiperKey}
          modules={[Navigation, Autoplay]}
          navigation
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {team.map((member, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <TeamCard member={member} />
            </SwiperSlide>
          ))}
        </Swiper>
      </PageContainer>
    </div>
  );
}
