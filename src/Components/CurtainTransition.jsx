import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CurtainTransition() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="curtain">
      <span />
      <span />
    </div>
  );
}