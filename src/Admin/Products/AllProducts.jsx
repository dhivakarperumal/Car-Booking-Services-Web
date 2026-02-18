import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

const AllProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  /* REALTIME FETCH */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* DELETE */
  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", docId));
      toast.success("🗑️ Product deleted");
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  /* EDIT */
  const handleEdit = (product) => {
    navigate("/admin/addproducts", { state: { editData: product } });
  };

  /* TOGGLE ACTIVE */
  const toggleStatus = async (product) => {
    try {
      await updateDoc(doc(db, "products", product.docId), {
        isActive: !product.isActive,
      });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* FILTER + SEARCH */
  const filteredProducts = products
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => {
      if (filter === "active") return p.isActive;
      if (filter === "inactive") return !p.isActive;
      if (filter === "featured") return p.isFeatured;
      return true;
    });

  /* PAGINATION */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>

        <div className="flex flex-wrap gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
          </select>

          {/* VIEW TOGGLE */}
          <button
            onClick={() => setView(view === "table" ? "card" : "table")}
            className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
          >
            {view === "table" ? "Card View" : "Table View"}
          </button>

          {/* ADD BUTTON */}
          <button
            onClick={() => navigate("/admin/addproducts")}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-gray-500">
          No products found
        </div>
      ) : view === "table" ? (
        /* ================= TABLE VIEW ================= */
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((p) => (
                <tr key={p.docId} className="border-t">
                  <td className="p-3">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="p-3 font-medium">
                    {p.name}
                    {p.isFeatured && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    ₹ {p.offerPrice || p.mrp}
                    {p.offerPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        ₹ {p.mrp}
                      </div>
                    )}
                  </td>

                  <td className="p-3">{p.totalStock || 0}</td>

                  <td className="p-3">
                    ⭐ {p.rating || 0}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`px-3 py-1 rounded text-xs ${
                        p.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.docId)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ================= CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((p) => (
            <div
              key={p.docId}
              className="bg-white rounded-xl shadow p-4 flex flex-col"
            >
              <img
                src={p.thumbnail || ""}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-semibold text-lg">{p.name}</h3>

              <div className="text-sm text-gray-500 mb-2">
                ⭐ {p.rating || 0}
              </div>

              <div className="text-green-600 font-bold">
                ₹ {p.offerPrice || p.mrp}
              </div>

              <div className="text-xs text-gray-400 mb-2">
                Stock: {p.totalStock || 0}
              </div>

              <div className="flex justify-between mt-auto">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.docId)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded ${
                page === num
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;

