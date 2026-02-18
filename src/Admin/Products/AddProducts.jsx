import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { useLocation, useNavigate } from "react-router-dom";

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    id: "",
    name: "",
    slug: "",
    brand: "",
    description: "",
    mrp: "",
    offer: "",
    offerPrice: "",
    tags: "",
    warrantyAvailable: false,
    warrantyMonths: "",
    returnAvailable: false,
    returnDays: "",
    isFeatured: false,
    isActive: true,
    rating: "",
  });

  const [variants, setVariants] = useState([
    { sku: "", position: "", material: "", stock: "" },
  ]);

  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  /* AUTO SLUG */
  useEffect(() => {
    if (product.name) {
      setProduct((prev) => ({
        ...prev,
        slug: product.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      }));
    }
  }, [product.name]);

  /* AUTO OFFER PRICE */
  useEffect(() => {
    const mrp = Number(product.mrp || 0);
    const offer = Number(product.offer || 0);

    if (mrp && offer >= 0) {
      const offerPrice = mrp - (mrp * offer) / 100;
      setProduct((prev) => ({
        ...prev,
        offerPrice: offerPrice.toFixed(2),
      }));
    }
  }, [product.mrp, product.offer]);

  /* LOAD EDIT DATA */
  useEffect(() => {
    if (editData) {
      setProduct({
        ...editData,
        tags: Array.isArray(editData.tags)
          ? editData.tags.join(", ")
          : editData.tags || "",
        warrantyAvailable: editData?.warranty?.available || false,
        warrantyMonths: editData?.warranty?.months || "",
        returnAvailable: editData?.returnPolicy?.available || false,
        returnDays: editData?.returnPolicy?.days || "",
        rating: editData?.rating || "",
      });

      setVariants(editData.variants || []);
      setImages(editData.images || []);
      setThumbnail(editData.thumbnail || "");
    }
  }, [editData]);

  /* GENERATE PRODUCT ID */
  const generateProductId = async () => {
    const snap = await getDocs(collection(db, "products"));
    const count = snap.size + 1;
    return `PR${String(count).padStart(3, "0")}`;
  };

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "warrantyAvailable") {
      setProduct({
        ...product,
        warrantyAvailable: checked,
        warrantyMonths: checked ? product.warrantyMonths : "",
      });
      return;
    }

    if (name === "returnAvailable") {
      setProduct({
        ...product,
        returnAvailable: checked,
        returnDays: checked ? product.returnDays : "",
      });
      return;
    }

    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* VARIANT CHANGE */
  const handleVariantChange = (index, e) => {
    const newVariants = [...variants];
    newVariants[index][e.target.name] = e.target.value;
    setVariants(newVariants);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { sku: "", position: "", material: "", stock: "" },
    ]);

  /* IMAGE BASE64 */
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleMultipleImages = async (files) => {
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(files[i], options);
      const base64 = await convertToBase64(compressedFile);
      imageArray.push(base64);
    }

    const updatedImages = [...images, ...imageArray];
    setImages(updatedImages);

    if (!thumbnail && updatedImages.length > 0) {
      setThumbnail(updatedImages[0]);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);

    if (index === 0 && updated.length > 0) {
      setThumbnail(updated[0]);
    }
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let productId = product.id;

      if (!editData) {
        productId = await generateProductId();
      }

      const totalStock = variants.reduce(
        (sum, v) => sum + Number(v.stock || 0),
        0
      );

      const productData = {
        ...product,
        id: productId,
        mrp: Number(product.mrp),
        offer: Number(product.offer),
        offerPrice: Number(product.offerPrice),

        warranty: {
          available: product.warrantyAvailable,
          months: product.warrantyAvailable
            ? Number(product.warrantyMonths || 0)
            : 0,
        },

        returnPolicy: {
          available: product.returnAvailable,
          days: product.returnAvailable
            ? Number(product.returnDays || 0)
            : 0,
        },

        rating: product.rating || "0",

        variants: variants.map((v) => ({
          ...v,
          stock: Number(v.stock),
        })),

        images,
        thumbnail,

        /* ✅ SAFE TAG CONVERSION */
        tags: Array.isArray(product.tags)
          ? product.tags
          : product.tags
          ? product.tags.split(",").map((t) => t.trim())
          : [],

        totalStock,
        updatedAt: serverTimestamp(),
      };

      if (!editData) {
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });

        await updateDoc(docRef, { docId: docRef.id });

        toast.success(`✅ Product ${productId} Added`);
      } else {
        await updateDoc(doc(db, "products", editData.docId), productData);
        toast.success(`✏️ Product ${productId} Updated`);
      }

      navigate("/admin/allproducts");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error saving product");
    }

    setLoading(false);
  };


  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">
        {editData ? "Update Product" : "Add Car Spare Product"}
      </h2>

      {/* BASIC */}
      <div className="grid grid-cols-2 gap-4">
        <input name="name" placeholder="Product Name" onChange={handleChange} value={product.name} className="input" />
        {/* <input name="slug" value={product.slug} readOnly className="input bg-gray-100" /> */}
        <input name="brand" placeholder="Brand" onChange={handleChange} value={product.brand} className="input" />
      </div>

      <textarea name="description" placeholder="Description" onChange={handleChange} value={product.description} className="input" />

      {/* PRICE */}
      <div className="grid grid-cols-3 gap-4">
        <input name="mrp" placeholder="MRP" onChange={handleChange} value={product.mrp} className="input" />
        <input name="offer" placeholder="Offer %" onChange={handleChange} value={product.offer} className="input" />
        <input name="offerPrice" placeholder="Offer Price" value={product.offerPrice} readOnly className="input bg-gray-100" />
      </div>

   

     {/* RATING */}
<div className="grid grid-cols-2 gap-4">
  <input
    type="number"
    min="1"
    max="5"
    step="0.1"
    placeholder="Rating (1–5)"
    value={product.rating}
    onChange={(e) =>
      setProduct({ ...product, rating: e.target.value })
    }
    className="input"
  />
</div>

<div className="text-sm text-gray-600">
  ⭐ {product.rating || 0} / 5
</div>


      {/* VARIANTS */}
      <div>
        <h3 className="font-semibold">Variants</h3>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <input name="sku" placeholder="SKU" value={v.sku} onChange={(e) => handleVariantChange(i, e)} className="input" />
            <input name="position" placeholder="Position" value={v.position} onChange={(e) => handleVariantChange(i, e)} className="input" />
            <input name="material" placeholder="Material" value={v.material} onChange={(e) => handleVariantChange(i, e)} className="input" />
            <input name="stock" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, e)} className="input" />
          </div>
        ))}
        <button type="button" onClick={addVariant} className="btn">
          + Add Variant
        </button>
      </div>

      {/* IMAGES */}
      <input type="file" multiple accept="image/*" onChange={(e) => handleMultipleImages(e.target.files)} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img src={img} className="w-full h-32 object-cover rounded border" />
            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black text-white w-6 h-6 text-xs rounded-full">✕</button>
          </div>
        ))}
      </div>

      {/* WARRANTY */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="warrantyAvailable" checked={product.warrantyAvailable} onChange={handleChange} />
          Warranty Available
        </label>

        {product.warrantyAvailable && (
          <input type="number" name="warrantyMonths" placeholder="Warranty Months" value={product.warrantyMonths} onChange={handleChange} className="input" />
        )}
      </div>

      {/* RETURN */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="returnAvailable" checked={product.returnAvailable} onChange={handleChange} />
          Return Available
        </label>

        {product.returnAvailable && (
          <input type="number" name="returnDays" placeholder="Return Days" value={product.returnDays} onChange={handleChange} className="input" />
        )}
      </div>

      {/* TAGS */}
      <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} value={product.tags} className="input" />

      {/* FLAGS */}
      <div className="flex gap-6">
        <label><input type="checkbox" name="isFeatured" checked={product.isFeatured} onChange={handleChange} /> Featured</label>
        <label><input type="checkbox" name="isActive" checked={product.isActive} onChange={handleChange} /> Active</label>
      </div>

      <button disabled={loading} className="bg-black text-white px-6 py-3 rounded-lg">
        {loading ? "Saving..." : editData ? "Update Product" : "Save Product"}
      </button>
    </form>
  );
};

export default AddProduct;
