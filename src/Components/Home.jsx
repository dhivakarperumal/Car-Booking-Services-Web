import react from "react";
import Hero from "./Hero";
import Services from "./Services";
import About from "./About";
import Pricing from "./Pricing";

export default function Home() {

  return (
    <>
     <h1>
      <Hero />
      <About />
      <Services/>
      <Pricing/>
     </h1>
    </>
  );
}
