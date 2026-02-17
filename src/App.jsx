import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";


import ScrollToTop from "./Components/ScrollToTop";
import ScrollNavigator from "./Components/ScrollNavigator";





function App() {
  const location = useLocation();

  // 🔐 Hide layout on auth pages
  const hideLayout = ["/login", "/register"].includes(location.pathname);




  // 3️⃣ MAIN WEBSITE
  return (
    <section>
      
      
      <ScrollToTop />
      <ScrollNavigator />
      
      <Outlet />
      {!hideLayout }
    </section>
  );
}

export default App;