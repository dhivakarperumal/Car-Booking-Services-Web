import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import PageContainer from "./PageContainer";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map(doc => ({
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

          {products.map(product => (
            <div
              key={product.docId}
              onClick={() => navigate(`/products/${product.slug}`)}
              className="group bg-[#0b0f14] border border-white/10 rounded-xl
              overflow-hidden cursor-pointer
              hover:border-sky-400 transition h-full flex flex-col"
            >

              {/* IMAGE */}
              <img
                src={product.thumbnail}
                alt={product.name}
                className="h-[200px] w-full object-cover group-hover:scale-105 transition"
              />

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-1">

                <p className="text-sky-400 text-xs uppercase">
                  {product.brand}
                </p>

                <h3 className="text-white font-bold text-lg mt-1 line-clamp-2">
                  {product.name}
                </h3>

                {/* PRICE */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-white font-bold text-lg">
                    ₹{product.offerPrice}
                  </span>

                  <span className="text-gray-400 line-through text-sm">
                    ₹{product.mrp}
                  </span>
                </div>

                {/* RATING */}
                <p className="text-yellow-400 text-sm mt-2">
                  ⭐ {product.rating}/5
                </p>

                {/* STOCK */}
                <span className={`mt-auto text-xs px-3 py-1 rounded-full w-fit
                  ${product.totalStock > 0
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"}
                `}>
                  {product.totalStock > 0 ? "In Stock" : "Out of Stock"}
                </span>

              </div>

            </div>
          ))}

        </div>

      </PageContainer>
    </section>
  );
}
