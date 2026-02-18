import react from "react";
import Hero from "./Hero";
import AboutHome from "./AboutHome"
import Pricing from "./Pricing";
import ServiceSwiper from "./SeviceSwiper";

export default function Home() {

  return (
    <>
     <h1>
      <Hero />
      <AboutHome />
      <ServiceSwiper />
      <Pricing/>
     </h1>
    </>
  );
}
