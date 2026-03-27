// import React from "react";
// import PageContainer from "./PageContainer";
// import PageHeader from "./PageHeader";

// const products = [
//   {
//     id: 1,
//     name: "Car AC Air Vent",
//     price: "₹850",
//     image: "/images/products1.jpg",
//   },
//   {
//     id: 2,
//     name: "AC Evaporator Coil",
//     price: "₹4,500",
//     image: "/images/products2.webp",
//   },
//   {
//     id: 3,
//     name: "Car AC Compressor (New)",
//     price: "₹18,000",
//     image: "/images/products3.jpg",
//   },
//   {
//     id: 4,
//     name: "AC Compressor – Cut Section",
//     price: "₹22,000",
//     image: "/images/products4.avif",
//   },
//   {
//     id: 5,
//     name: "Car AC System Diagram",
//     price: "₹3,049",
//     image: "/images/products5.png",
//   },
//   {
//     id: 6,
//     name: "Reconditioned AC Compressor",
//     price: "₹9,500",
//     image: "/images/products6.gif",
//   },
//   {
//     id: 7,
//     name: "Engine Air Filter",
//     price: "₹650",
//     image: "/images/products7.jpg",
//   },
//   {
//     id: 8,
//     name: "Disc Brake & Caliper Assembly",
//     price: "₹3,200",
//     image: "/images/products8.jpg",
//   },
//   {
//     id: 9,
//     name: "Car Battery",
//     price: "₹5,500",
//     image: "/images/products9.jpg",
//   },
//   {
//     id: 10,
//     name: "Car Battery Installation Service",
//     price: "₹499",
//     image: "/images/products10.jpg",
//   },
// ];

// const Product = () => {
//   return (
// <>
//     <PageHeader title="Products"/>
//     <section className="bg-gray-900 py-20">

//         <PageContainer>
//       <div className="">
//         <h2 className="text-4xl font-bold text-center mb-14">
//           Car Care Products
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-500"
//             >
//               {/* IMAGE */}
//               <div className="relative overflow-hidden">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="h-64 w-full object-cover transform group-hover:scale-110 transition duration-700"
//                 />

//                 {/* HOVER OVERLAY */}
//                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
//                   <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition">
//                     View Details
//                   </button>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="p-5 text-center">
//                 <h3 className="text-lg font-semibold mb-2">
//                   {product.name}
//                 </h3>
//                 <p className="text-orange-500 font-bold text-xl">
//                   {product.price}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       </PageContainer>
//     </section>
//     </>
//   );
// };

// export default Product;

import React from "react";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";
import SectionHeading from "./SectionHeading";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const products = [
  {
    id: 1,
    name: "Car AC Air Vent",
    price: "₹850",
    image: "/images/products1.jpg",
  },
  {
    id: 2,
    name: "AC Evaporator Coil",
    price: "₹4,500",
    image: "/images/products2.webp",
  },
  {
    id: 3,
    name: "Car AC Compressor (New)",
    price: "₹18,000",
    image: "/images/products3.jpg",
  },
  {
    id: 4,
    name: "AC Compressor – Cut Section",
    price: "₹22,000",
    image: "/images/products4.avif",
  },
  {
    id: 5,
    name: "Car AC System Diagram",
    price: "₹3,049",
    image: "/images/products5.png",
  },
  {
    id: 6,
    name: "Reconditioned AC Compressor",
    price: "₹9,500",
    image: "/images/products6.gif",
  },
  {
    id: 7,
    name: "Engine Air Filter",
    price: "₹650",
    image: "/images/products7.jpg",
  },
  {
    id: 8,
    name: "Disc Brake & Caliper Assembly",
    price: "₹3,200",
    image: "/images/products8.jpg",
  },
  {
    id: 9,
    name: "Car Battery",
    price: "₹5,500",
    image: "/images/products9.jpg",
  },
  {
    id: 10,
    name: "Car Battery Installation Service",
    price: "₹499",
    image: "/images/products10.jpg",
  },
];

const Product = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <>
      <PageHeader title="Products" />

      <section className="bg-black py-24">
        <PageContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              <div
                data-aos="fade-up"
                data-aos-delay={product.id * 100}
                key={product.id}
                className="group relative rounded-3xl overflow-hidden
          bg-gradient-to-br from-[#141414] to-[#0b0b0b]
          border-2 border-orange-500
          shadow-[0_20px_40px_rgba(0,0,0,0.6)]
          hover:shadow-orange-500/70
          hover:-translate-y-2 transition-all duration-500"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover
              group-hover:scale-110 transition duration-700"
                  />

                  {/* subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">
                    {product.name}
                  </h3>

                  {/* animated underline */}
                  <div className="mx-auto mb-3 h-[2px] w-0 bg-orange-500 group-hover:w-12 transition-all duration-500" />

                  <p className="text-orange-400 font-bold text-xl">
                    {product.price}
                  </p>
                </div>

                {/* premium glow border */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none
          border border-orange-500/0 group-hover:border-orange-500/40 transition duration-500"
                />
              </div>
            ))}
          </div>
        </PageContainer>
      </section>
    </>
  );
};

export default Product;
