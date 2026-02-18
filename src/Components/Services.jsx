import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ServiceCard from "./ServiceCard";
import PageContainer from "./PageContainer";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const snapshot = await getDocs(collection(db, "services"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(data);
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-black py-24">
      <PageContainer>
      <div className="">

        {/* Heading */}
        <h2 className="text-white text-3xl font-bold text-center tracking-widest mb-16">
          OUR SERVICES
        </h2>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
      </PageContainer>
    </section>
  );
};

export default Services;