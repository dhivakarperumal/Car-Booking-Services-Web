import { useEffect } from "react";

export default function IntroAnimation({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white animate-intro">
      <h1 className="text-5xl font-extrabold tracking-wide">
        Relax<span className="text-orange-500">Drive</span>
      </h1>
    </div>
  );
}