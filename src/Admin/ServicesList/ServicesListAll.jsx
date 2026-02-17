// import React from 'react'

// const ServicesListAll = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default ServicesListAll


import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesListAll = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setServices(list);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    await deleteDoc(doc(db, "services", id));
    toast.success("Service deleted");
  };

  return (
    <div className="p-6 space-y-6">

      {/* ADD BUTTON */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Car Service List</h2>
        <button
          onClick={() => navigate("/admin/addservices")}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div key={srv.docId} className="border rounded-xl p-4 shadow-sm">

            {srv.image && (
              <img
                src={srv.image}
                alt={srv.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}

            <h3 className="font-semibold">{srv.name}</h3>
            <p className="text-sm text-gray-500">{srv.category}</p>
            <p className="text-sm">₹{srv.price} • GST {srv.gst}%</p>
            <p className="text-xs text-gray-400">{srv.estimatedTime}</p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => navigate(`/admin/edit-car-service/${srv.docId}`)}
              >
                <Pencil size={16} />
              </button>

              <button onClick={() => handleDelete(srv.docId)}>
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ServicesListAll;
