// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import TopBar from "./Components/TopBar";
// import Navbar from "./Components/Navbar";
// import ScrollToTop from "./Components/ScrollToTop";
// import ScrollNavigator from "./Components/ScrollNavigator";
// import Footer from "./Components/Footer";
// import Loader from "./Components/Loader";

// function App() {
//   const [loading, setLoading] = useState(true);

//     useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <Loader />;
//   }

//   // 🔐 Hide layout on auth pages
//   const hideLayout = ["/login", "/register"].includes(location.pathname);

//   return (
//     <section>
//       {!hideLayout && <Navbar />}
//       <ScrollToTop />
//       <ScrollNavigator />
//       <Outlet />
//       {!hideLayout && <Footer />}
//     </section>
//   );
// }

// export default App;


import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./Components/TopBar";
import Navbar from "./Components/Navbar";
import ScrollToTop from "./Components/ScrollToTop";
import ScrollNavigator from "./Components/ScrollNavigator";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import IntroAnimation from "./Components/IntroAnimation";
import PageWrapper from "./Components/PageWrapper";
import CurtainTransition from "./Components/CurtainTransition";

function App() {
  const [step, setStep] = useState("loading");
  const location = useLocation();

  // 🔐 Hide layout on auth pages
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  // 1️⃣ LOADER
  if (step === "loading") {
    return <Loader onComplete={() => setStep("intro")} />;
  }

  // 2️⃣ INTRO ANIMATION
  if (step === "intro") {
    return <IntroAnimation onFinish={() => setStep("site")} />;
  }

  // 3️⃣ MAIN WEBSITE
  return (
    <section>
      {!hideLayout && <Navbar />}
      
      <ScrollToTop />
      <ScrollNavigator />
      <CurtainTransition />
      <Outlet />
      {!hideLayout && <Footer />}
    </section>
  );
}

export default App;