import React, { useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import SectionHeading from "./SectionHeading";
import TeamCard from "./TeamCard";
import AOS from "aos";
import "aos/dist/aos.css";

const Team = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });

    fetch("/teamData.json")
      .then((res) => res.json())
      .then((data) => setTeam(data));
  }, []);

  return (
    <div className="bg-black py-10">
      <PageContainer>
        <div data-aos="fade-up">
          <SectionHeading
            title="Expert Team Members"
            subtitle="Our Professionals"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <TeamCard key={index} data-aos="fade-up"
      data-aos-delay={index * 150} member={member} />
          ))}
        </div>
      </PageContainer>
    </div>
  );
};

export default Team;
