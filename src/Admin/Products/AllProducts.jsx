import React from "react";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Products</h1>

        <button
          onClick={() => navigate("/admin/addproducts")}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 text-gray-500">
        All products list will come here...
      </div>
    </div>
  );
};

export default AllProducts;
