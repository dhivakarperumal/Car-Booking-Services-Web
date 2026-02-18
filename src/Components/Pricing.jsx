import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PageContainer from "./PageContainer";

export default function Pricing() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPricingPackages = async () => {
      const snapshot = await getDocs(collection(db, "pricingPackages"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackages(data);
    };

    fetchPricingPackages();
  }, []);

  return (
    <section className="relative py-24 bg-black text-white overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAJ3Ai3tu58SWAJ2mK_EhozE-OIgQXcLXNg&s)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />

      <PageContainer>
        <div className="relative">

          {/* Heading */}
          <div className="text-center mb-20">
            <span className="uppercase tracking-widest text-sky-400 text-sm">
              Transparent Pricing
            </span>

            <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold mt-4">
              Choose Your Perfect <br /> Service Package
            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto mt-6">
              Premium car care plans designed for every need, every vehicle,
              every journey.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

/* PRICING CARD – SAME GLASS EFFECT AS STATS */
function PricingCard({ pkg }) {
  return (
    <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-sky-500/40 to-transparent hover:from-sky-400 transition-all duration-300">
      
      {/* Inner Card */}
      <div className="relative h-full rounded-3xl bg-black/70 backdrop-blur-xl p-10
        border border-white/10 hover:border-sky-400/40
        transition-all duration-300">

        {/* Plan Title */}
        <h3 className="text-sm uppercase tracking-widest text-sky-400 mb-3">
          {pkg.title}
        </h3>

        {/* Price */}
        <div className="flex items-end gap-2 mb-8">
          <span className="text-5xl font-extrabold text-white">
            ₹{pkg.price}
          </span>
          <span className="text-gray-400 text-sm mb-1">
            /service
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/40 to-transparent mb-8" />

        {/* Features */}
        <ul className="space-y-4 text-gray-300 mb-10">
          {pkg.features?.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full
                bg-sky-500/20 text-sky-400 text-xs">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="w-full py-4 rounded-xl font-semibold text-black
          bg-gradient-to-r from-sky-400 to-cyan-300
          hover:from-sky-300 hover:to-cyan-200
          transition-all duration-300 shadow-lg shadow-sky-500/30"
        >
          Book Now →
        </button>

      </div>
    </div>
  );
}