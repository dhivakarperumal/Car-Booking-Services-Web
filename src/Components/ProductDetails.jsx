import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

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

  const handleAddToCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const cartRef = doc(db, "users", user.uid, "cart", product.docId);
    const existing = await getDoc(cartRef);

    if (existing.exists()) {
      await updateDoc(cartRef, {
        quantity: existing.data().quantity + 1,
      });
    } else {
      await setDoc(cartRef, {
        productId: product.docId,
        name: product.name,
        price: product.offerPrice,
        image: product.images?.[0],
        quantity: 1,
        addedAt: new Date(),
      });
    }

    navigate("/cart");
  };

  if (!product)
    return <div className="text-white text-center py-40">Loading...</div>;

  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT — IMAGE GALLERY */}
          <div className="lg:sticky lg:top-24">
            {/* MAIN IMAGE */}
            <div
              className="bg-[#050b14] rounded-2xl p-6 border border-white/10
          shadow-xl shadow-sky-500/10"
            >
              <img
                src={product.images?.[activeImage]}
                className="w-full h-[360px] md:h-[420px] object-contain"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {product.images?.slice(-4).map((img, i) => {
                const originalIndex = product.images.length - 4 + i;

                return (
                  <button
                    key={originalIndex}
                    onClick={() => setActiveImage(originalIndex)}
                    className={`bg-[#050b14] rounded-xl p-2 border transition
            ${
              activeImage === originalIndex
                ? "border-sky-400 shadow-md shadow-sky-400/30"
                : "border-white/10 hover:border-sky-400/50"
            }`}
                  >
                    <img src={img} className="w-full h-20 object-contain" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div className="space-y-8">
            {/* TITLE */}
            <div>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight">
                {product.name}
              </h1>

              <p className="text-gray-400 mt-2">{product.brand}</p>
            </div>

            {/* PRICE */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sky-400 text-3xl font-bold">
                ₹{product.offerPrice}
              </span>

              <span className="line-through text-gray-500">₹{product.mrp}</span>

              {product.offer && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold
              bg-green-500/20 text-green-400"
                >
                  {product.offer}% OFF
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* PRODUCT DETAILS */}
            {/* PRODUCT DETAILS */}
            <div className="mt-6 grid grid-cols-2 gap-y-3 text-xl">
              {product.variants?.[0]?.material && (
                <>
                  <span className="text-gray-400">Material</span>
                  <span className="text-sky-400 font-medium">
                    {product.variants[0].material}
                  </span>
                </>
              )}

              {product.variants?.[0]?.position && (
                <>
                  <span className="text-gray-400">Position</span>
                  <span className="text-sky-400 font-medium">
                    {product.variants[0].position}
                  </span>
                </>
              )}

              {product.variants?.[0]?.sku && (
                <>
                  <span className="text-gray-400">SKU</span>
                  <span className="text-sky-400 font-medium">
                    {product.variants[0].sku}
                  </span>
                </>
              )}

              {product.warrantyAvailable && product.warrantyMonths && (
                <>
                  <span className="text-gray-400">Warranty</span>
                  <span className="text-sky-400 font-medium">
                    {product.warrantyMonths} Months
                  </span>
                </>
              )}

              {product.returnPolicy?.available &&
                product.returnPolicy?.days && (
                  <>
                    <span className="text-gray-400">Return Policy</span>
                    <span className="text-sky-400 font-medium">
                      {product.returnPolicy.days} Days
                    </span>
                  </>
                )}
            </div>

            {/* CTA BUTTONS */}
            <div className="mt-15 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-10 py-4 rounded-full font-semibold
bg-gradient-to-r from-blue-600 to-cyan-400 text-black
hover:scale-105 transition-all duration-300
shadow-xl shadow-blue-500/40 cursor-pointer"
              >
                Add To Cart
              </button>

              <button
                className="flex-1 px-10 py-4 rounded-full font-semibold
    border border-sky-400 text-sky-400
    hover:bg-sky-400 hover:text-black
    transition-all duration-300 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
