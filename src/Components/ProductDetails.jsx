import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function ProductDetails() {
    const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {

      const q = query(collection(db, "products"), where("slug", "==", slug));

      const snap = await getDocs(q);

      if (!snap.empty) {
        setProduct({ docId: snap.docs[0].id, ...snap.docs[0].data() });
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product)
    return <div className="text-white text-center py-40">Loading...</div>;

  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
        {/* IMAGES */}
        <div>
          <img
            src={product.images?.[activeImage]}
            className="w-full h-[420px] object-contain rounded-xl bg-[#0b0f14]"
          />

          <div className="flex gap-4 mt-4">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border
                ${activeImage === i ? "border-sky-400" : "border-white/10"}`}
              />
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold">{product.name}</h1>

          <p className="text-gray-400">{product.brand}</p>

          <div className="flex items-center gap-4">
            <span className="text-sky-400 text-3xl font-bold">
              ₹{product.offerPrice}
            </span>

            <span className="line-through text-gray-500">₹{product.mrp}</span>

            <span className="text-green-400">{product.offer}% OFF</span>
          </div>

          <p className="text-gray-300 leading-relaxed">{product.description}</p>

          {product.variants?.[0] && (
            <div className="text-gray-400 space-y-1">
              <p>Material: {product.variants[0].material}</p>
              <p>Position: {product.variants[0].position}</p>
              <p>SKU: {product.variants[0].sku}</p>
            </div>
          )}

          {product.warrantyAvailable && (
            <p className="text-gray-400">
              Warranty: {product.warrantyMonths} Months
            </p>
          )}

          {product.returnPolicy?.available && (
            <p className="text-gray-400">
              Return within {product.returnPolicy.days} days
            </p>
          )}

          <button
            className="mt-6 px-10 py-4 rounded-full font-semibold
            bg-gradient-to-r from-blue-600 to-cyan-400
            hover:scale-105 transition shadow-lg shadow-blue-500/40"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </section>
  );
}
