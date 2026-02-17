import React, { useEffect, useState } from "react";

const Loader = ({ duration = 2000, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          // 🔔 Tell App loader is finished
          setTimeout(() => {
            onComplete && onComplete();
          }, 400); // small pause after 100%

          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  const radius = 70;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative flex flex-col items-center">

        {/* SVG Circle */}
        <svg width="220" height="220">
          {/* Background ring */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#2a2a2a"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress ring */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#f97316"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
          />
        </svg>

        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-xl md:text-3xl font-bold">
          {Math.round(progress)}%
        </div>

        {/* Text */}
        <p className="mt-6 font-bold text-orange-500 tracking-[0.3em] text-xl md:text-3xl">
          DRIVE RELAX
        </p>
      </div>
    </div>
  );
};

export default Loader;