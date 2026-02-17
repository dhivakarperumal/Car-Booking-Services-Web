import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

const categories = [
  "Periodic Maintenance",
  "Brake Service",
  "AC Service",
  "Electrical Service",
  "Tyre & Wheel Service",
  "Detailing & Cleaning",
  "Inspection",
  "Additional Services",
];

const AddCarService = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    estimatedTime: "",
    gst: "",
    hsn: "",
    description: "",
    image: "",
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

  /* 🔧 Handle Change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value < 0) return;
    setForm({ ...form, [name]: value });
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

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6); // 60% quality
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

    if (!form.name || !form.category || !form.price) {
      toast.error("Fill required fields");
      return;
    }

    try {
      setLoading(true);

      const serviceCode = await generateServiceCode();

      const docRef = await addDoc(collection(db, "services"), {
        code: serviceCode,
        ...form,
        price: Number(form.price),
        gst: Number(form.gst || 0),
        createdAt: serverTimestamp(),
      });

      /* 🔹 Save docRefId inside document */
      await updateDoc(docRef, { docRefId: docRef.id });

      toast.success("Service added");

      setForm({
        name: "",
        category: "",
        price: "",
        estimatedTime: "",
        gst: "",
        hsn: "",
        description: "",
        image: "",
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Car Service</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Service Name *"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Category *</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price ₹ *"
            value={form.price}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            name="estimatedTime"
            placeholder="Estimated Time"
            value={form.estimatedTime}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            name="gst"
            placeholder="GST %"
            value={form.gst}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            name="hsn"
            placeholder="HSN Code"
            value={form.hsn}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <div className="md:col-span-3">
            <label className="block text-sm mb-1">Service Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-2 w-24 h-24 object-cover rounded-lg border"
              />
            )}
          </div>

          <textarea
            name="description"
            placeholder="Service Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 md:col-span-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-lg py-2"
          >
            {loading ? "Saving..." : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarService;


