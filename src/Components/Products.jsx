import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import PageContainer from "./PageContainer";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true),
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-black py-24">
      <PageContainer>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.docId}
              onClick={() => navigate(`/products/${product.slug}`)}
              className="group relative bg-[#050b14]
border border-white/20
rounded-2xl overflow-hidden cursor-pointer
transition-all duration-500
hover:-translate-y-2
hover:border-sky-400
hover:shadow-[0_30px_90px_rgba(56,189,248,0.45)]
flex flex-col before:absolute before:inset-0 before:rounded-2xl
before:bg-gradient-to-tr before:from-sky-500/10 before:to-cyan-400/5
before:opacity-0 hover:before:opacity-100 before:transition"
            >
              {/* OFFER RIBBON */}
              {product.offer && (
                <span
                  className="absolute top-0 left-0 z-20 bg-gradient-to-r from-sky-500 to-cyan-400
        text-black text-xs font-bold px-4 py-1 rounded-br-xl"
                >
                  {product.offer}% OFF
                </span>
              )}

              {/* CART ICON (TOP RIGHT ON HOVER) */}
              <div
                className="absolute top-5 right-5 z-20
  translate-x-10 opacity-0
  group-hover:translate-x-0 group-hover:opacity-100
  transition-all duration-500 ease-out
  bg-black backdrop-blur p-3 rounded-full
  border border-sky-400 text-sky-400
  shadow-lg shadow-sky-400/40"
              >
                <FiShoppingCart size={18} />
              </div>

              {/* IMAGE */}
              <div className="relative h-[260px] overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-[0.3deg]"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-3">
                {/* BRAND */}
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                  {product.brand}
                </p>

                {/* NAME + STOCK */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-white text-lg font-bold leading-tight">
                    {product.name}
                  </h3>

                  <span
                    className={`text-[10px] px-3 py-1 rounded-full whitespace-nowrap
          ${
            product.totalStock > 0
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
                  >
                    {product.totalStock > 0 ? "In Stock" : "Out"}
                  </span>
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-3 ">
                  <span className="text-white text-2xl font-extrabold">
                    ₹{product.offerPrice}
                  </span>

                  <span className="line-through text-gray-500 font-bold text-sm">
                    ₹{product.mrp}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= Number(product.rating || 0) ? (
                      <FaStar key={star} className="text-sky-400 text-sm" />
                    ) : (
                      <FaRegStar key={star} className="text-gray-500 text-sm" />
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
