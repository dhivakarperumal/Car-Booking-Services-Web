import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

const AddCarService = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    supportedBrands: [""],
    sparePartsIncluded: [""],
    status: "active",
  });

  /* 🔢 Generate SE001 Counter */
  const generateServiceCode = async () => {
    const counterRef = doc(db, "counters", "serviceCounter");

    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      const next = (snap.exists() ? snap.data().current : 0) + 1;
      tx.set(counterRef, { current: next }, { merge: true });
      return `SE${String(next).padStart(3, "0")}`;
    });
  };

  /* 🔧 Basic Change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value < 0) return;
    setForm({ ...form, [name]: value });
  };

  /* 🔁 Dynamic Array Change */
  const handleArrayChange = (index, field, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addField = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeField = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm({ ...form, [field]: updated });
  };

  /* 🖼️ Compress Image */
  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (event) => {
        img.src = event.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 600;
        const scaleSize = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        resolve(compressedBase64);
      };
    });

  /* 🖼️ Image Upload */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setForm({ ...form, image: compressed });
    setImagePreview(compressed);
  };

  /* ➕ SUBMIT */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.price) {
    toast.error("Fill required fields");
    return;
  }

  try {
    setLoading(true);

    const serviceCode = await generateServiceCode();

    // 🔹 Create empty doc reference first
    const docRef = doc(collection(db, "services"));

    // 🔹 Save data with docRefId inside
    await setDoc(docRef, {
      docRefId: docRef.id,
      code: serviceCode,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image || "",
      supportedBrands: form.supportedBrands.filter((b) => b.trim() !== ""),
      sparePartsIncluded: form.sparePartsIncluded.filter(
        (p) => p.trim() !== ""
      ),
      status: form.status,
      createdAt: serverTimestamp(),
    });

    toast.success("Service added");

    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      supportedBrands: [""],
      sparePartsIncluded: [""],
      status: "active",
    });

    setImagePreview("");
  } catch (err) {
    console.error(err);
    toast.error("Error adding service");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
  <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100">
    
    {/* Header */}
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Add Car Service</h2>
      <p className="text-gray-500 text-sm">
        Create a new service package with supported brands and spare parts
      </p>
    </div>

    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

      {/* Service Name */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600 mb-1">
          Service Name *
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Full Car Service"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
        />
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600 mb-1">
          Price ₹ *
        </label>
        <input
          type="number"
          name="price"
          placeholder="e.g. 2999"
          value={form.price}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
        />
      </div>

     
      {/* Supported Brands */}
      <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-300">
        <h3 className="font-semibold text-gray-700 mb-2">Supported Brands</h3>

        {form.supportedBrands.map((brand, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              type="text"
              value={brand}
              onChange={(e) =>
                handleArrayChange(i, "supportedBrands", e.target.value)
              }
              className="border border-gray-300 rounded-md px-3 py-3 w-full focus:ring-2 focus:ring-black outline-none"
              placeholder="Enter brand"
            />
            <button
              type="button"
              onClick={() => removeField("supportedBrands", i)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-full"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addField("supportedBrands")}
          className="mt-3 text-sm bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Brand
        </button>
      </div>

      {/* Spare Parts */}
      <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-300">
        <h3 className="font-semibold text-gray-700 mb-2">
          Spare Parts Included
        </h3>

        {form.sparePartsIncluded.map((part, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              type="text"
              value={part}
              onChange={(e) =>
                handleArrayChange(i, "sparePartsIncluded", e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-3 w-full focus:ring-2 focus:ring-black outline-none"
              placeholder="Enter spare part"
            />
            <button
              type="button"
              onClick={() => removeField("sparePartsIncluded", i)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-full"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addField("sparePartsIncluded")}
          className="mt-3 text-sm bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Spare Part
        </button>
      </div>

      {/* Description */}
      <div className="md:col-span-3 flex flex-col">
        <label className="text-sm font-semibold text-gray-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Explain what is included in this service..."
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
        />
      </div>

     {/* Image Upload */}
<div className="flex flex-col md:col-span-3">
  <label className="text-sm font-semibold text-gray-600 mb-2">
    Service Image
  </label>

  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl h-36 cursor-pointer hover:border-black hover:bg-gray-50 transition">
    <span className="text-gray-500 text-sm">📁 Click to upload service image</span>
    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>

  {imagePreview && (
    <div className="mt-4 flex items-center gap-4">
      <img
        src={imagePreview}
        alt="preview"
        className="w-28 h-28 object-cover rounded-xl border shadow-sm"
      />

      <button
        type="button"
        onClick={() => setImagePreview(null)}
        className="text-red-500 text-sm font-medium hover:underline"
      >
        Remove
      </button>
    </div>
  )}
</div>


{/* Submit Button */}
<div className="md:col-span-3 flex justify-end">
  <button
    type="submit"
    disabled={loading}
    className="bg-gradient-to-r from-black to-gray-800 hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition"
  >
    {loading ? "Saving..." : "Add Service"}
  </button>
</div>

    </form>
  </div>
</div>

  );
};

export default AddCarService;

