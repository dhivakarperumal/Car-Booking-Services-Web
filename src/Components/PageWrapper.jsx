import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function PageWrapper() {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [location.pathname]);

  return (
    <div key={key} className="page-book">
      <Outlet />
    </div>
  );
}