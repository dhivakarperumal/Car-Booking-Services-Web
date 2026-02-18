import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

const PricingForm = () => {
  const [packages, setPackages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState([""]);
  const [editId, setEditId] = useState(null);

  const pricingRef = collection(db, "pricingPackages");

  // 🔹 Fetch packages
  const fetchPackages = async () => {
    const snap = await getDocs(pricingRef);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setPackages(list);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // 🔹 Feature change
  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  // 🔹 Add new feature field
  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  // 🔹 Remove feature field
  const removeFeatureField = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };

  // 🔹 Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      toast.error("Title & Price required");
      return;
    }

    const data = {
      title,
      price: Number(price),
      features: features.filter((f) => f.trim() !== ""),
      createdAt: new Date(),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "pricingPackages", editId), data);
        toast.success("Package updated");
      } else {
        await addDoc(pricingRef, data);
        toast.success("Package added");
      }

      resetForm();
      fetchPackages();
    } catch (err) {
      console.error(err);
      toast.error("Error saving package");
    }
  };

  // 🔹 Edit
  const handleEdit = (pkg) => {
    setTitle(pkg.title);
    setPrice(pkg.price);
    setFeatures(pkg.features);
    setEditId(pkg.id);
  };

  // 🔹 Reset
  const resetForm = () => {
    setTitle("");
    setPrice("");
    setFeatures([""]);
    setEditId(null);
  };

  return (
   <div className="p-6 max-w-6xl mx-auto">
  <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100">

    {/* 🔹 Title */}
    <h2 className="text-2xl font-bold mb-6 text-gray-800">
      {editId ? "Update Package" : "Add Package"}
    </h2>

    {/* 🔹 FORM */}
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 🔹 Top Fields */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-gray-600">Package Title</label>
          <input
            type="text"
            placeholder="Enter package title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
            required
          />
        </div>
      </div>

      {/* 🔹 Features Full Width */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">Features</h3>

          <button
            type="button"
            onClick={addFeatureField}
            className="mt-3 text-sm bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition"
          >
            + Add Feature
          </button>
        </div>

        {features.map((f, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Feature ${i + 1}`}
              value={f}
              onChange={(e) =>
                handleFeatureChange(i, e.target.value)
              }
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
            />

            <button
              type="button"
              onClick={() => removeFeatureField(i)}
              className="bg-red-600 text-white px-4 rounded-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 🔹 Buttons */}
      <div className="flex justify-end gap-3">
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}

        <button className="bg-gradient-to-r from-black to-gray-800 hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition">
          {editId ? "Update Package" : "Save Package"}
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default PricingForm;