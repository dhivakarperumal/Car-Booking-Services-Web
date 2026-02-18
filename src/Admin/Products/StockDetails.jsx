import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StockDetails = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [stockInputs, setStockInputs] = useState({});
  const [view, setView] = useState("table");

  /* FETCH PRODUCTS */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    });

    return () => unsub();
  }, []);

  /* HANDLE STOCK INPUT */
  const handleStockChange = (productId, index, value) => {
    setStockInputs((prev) => ({
      ...prev,
      [`${productId}-${index}`]: value,
    }));
  };

  /* UPDATE STOCK */
  const updateStock = async (product) => {
    try {
      const updatedVariants = product.variants.map((v, i) => {
        const key = `${product.docId}-${i}`;
        const addedStock = Number(stockInputs[key] || 0);

        return {
          ...v,
          stock: Number(v.stock) + addedStock,
        };
      });

      const totalStock = updatedVariants.reduce(
        (sum, v) => sum + Number(v.stock || 0),
        0
      );

      await updateDoc(doc(db, "products", product.docId), {
        variants: updatedVariants,
        totalStock,
      });

      toast.success("Stock updated");
      setStockInputs({});
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-bold">Stock Details</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1 rounded ${
              view === "table" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setView("card")}
            className={`px-3 py-1 rounded ${
              view === "card" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Card
          </button>

          <button
            onClick={() => navigate("/admin/addstock")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Stock
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Product</th>
                <th className="p-3">Variants</th>
                <th className="p-3">Total Stock</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <React.Fragment key={p.docId}>
                  <tr className="border-t">
                    {/* IMAGE */}
                    <td className="p-3">
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    {/* NAME */}
                    <td className="p-3 font-medium">{p.name}</td>

                    {/* VARIANTS */}
                    <td className="p-3">
                      {p.variants?.length || 0}
                    </td>

                    {/* TOTAL STOCK */}
                    <td className="p-3">
                      <span
                        className={
                          p.totalStock < 5
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {p.totalStock || 0}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-3">
                      <button
                        onClick={() =>
                          setExpanded(
                            expanded === p.docId ? null : p.docId
                          )
                        }
                        className="bg-gray-200 px-3 py-1 rounded text-xs"
                      >
                        {expanded === p.docId ? "Hide" : "Manage"}
                      </button>
                    </td>
                  </tr>

                  {/* VARIANT MANAGER */}
                  {expanded === p.docId && (
                    <tr>
                      <td colSpan="5" className="p-4 bg-gray-50">
                        <div className="space-y-3">
                          {p.variants?.map((v, i) => {
                            const key = `${p.docId}-${i}`;

                            return (
                              <div
                                key={i}
                                className="grid grid-cols-5 gap-3 items-center"
                              >
                                <div className="text-sm">
                                  {v.position} | {v.material}
                                </div>

                                <div className="text-sm">
                                  SKU: {v.sku}
                                </div>

                                <div className="text-sm">
                                  Current:{" "}
                                  <span className="font-semibold">
                                    {v.stock}
                                  </span>
                                </div>

                                <input
                                  type="number"
                                  placeholder="Add qty"
                                  value={stockInputs[key] || ""}
                                  onChange={(e) =>
                                    handleStockChange(
                                      p.docId,
                                      i,
                                      e.target.value
                                    )
                                  }
                                  className="border px-2 py-1 rounded text-sm"
                                />

                                <div className="text-sm font-semibold text-green-600">
                                  New:{" "}
                                  {Number(v.stock) +
                                    Number(stockInputs[key] || 0)}
                                </div>
                              </div>
                            );
                          })}

                          <button
                            onClick={() => updateStock(p)}
                            className="bg-black text-white px-4 py-2 rounded text-sm"
                          >
                            Update Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.docId}
              className="bg-white rounded-xl shadow border p-4"
            >
              {/* IMAGE */}
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}

              <h3 className="font-semibold">{p.name}</h3>

              <p className="text-sm text-gray-500">
                Variants: {p.variants?.length || 0}
              </p>

              <p className="text-sm">
                Total Stock:{" "}
                <span
                  className={
                    p.totalStock < 5
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {p.totalStock || 0}
                </span>
              </p>

              <button
                onClick={() =>
                  setExpanded(
                    expanded === p.docId ? null : p.docId
                  )
                }
                className="mt-2 bg-gray-200 px-3 py-1 rounded text-xs"
              >
                {expanded === p.docId ? "Hide" : "Manage"}
              </button>

              {expanded === p.docId && (
                <div className="mt-3 space-y-2">
                  {p.variants?.map((v, i) => {
                    const key = `${p.docId}-${i}`;

                    return (
                      <div
                        key={i}
                        className="border p-2 rounded text-sm"
                      >
                        <div>
                          {v.position} | {v.material}
                        </div>
                        <div>Stock: {v.stock}</div>

                        <input
                          type="number"
                          placeholder="Add qty"
                          value={stockInputs[key] || ""}
                          onChange={(e) =>
                            handleStockChange(
                              p.docId,
                              i,
                              e.target.value
                            )
                          }
                          className="border px-2 py-1 rounded w-full mt-1"
                        />

                        <div className="text-green-600 font-semibold">
                          New:{" "}
                          {Number(v.stock) +
                            Number(stockInputs[key] || 0)}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => updateStock(p)}
                    className="bg-black text-white px-4 py-2 rounded text-sm w-full"
                  >
                    Update Stock
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockDetails;



