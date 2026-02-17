import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddServiceParts = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [search, setSearch] = useState("");

  const [parts, setParts] = useState([
    { partName: "", qty: 1, price: 0 },
  ]);

  /* =======================
     FETCH SERVICES
  ======================= */
  useEffect(() => {
    const fetchServices = async () => {
      const snap = await getDocs(collection(db, "carServices"));
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchServices();
  }, []);

  /* =======================
     FILTER SERVICES
  ======================= */
  const filteredServices = services.filter(s => {
    const text = `${s.carServiceId} ${s.customerName} ${s.mobileNumber} ${s.mechanic}`
      .toLowerCase();
    return text.includes(search.toLowerCase());
  });

  /* =======================
     PART HANDLERS
  ======================= */
  const handlePartChange = (i, field, value) => {
    const copy = [...parts];
    copy[i][field] = value;
    setParts(copy);
  };

  const addPartRow = () => {
    setParts([...parts, { partName: "", qty: 1, price: 0 }]);
  };

  const removePartRow = (i) => {
    setParts(parts.filter((_, idx) => idx !== i));
  };

  const totalPartsCost = parts.reduce(
    (sum, p) => sum + Number(p.qty) * Number(p.price),
    0
  );

  /* =======================
     SAVE PARTS
  ======================= */
  const handleSave = async () => {
    if (!selectedService) {
      toast.error("Select a service");
      return;
    }

    try {
      const partsRef = collection(
        db,
        "carServices",
        selectedService.id,
        "parts"
      );

      for (let p of parts) {
        if (!p.partName) continue;

        await addDoc(partsRef, {
          ...p,
          total: Number(p.qty) * Number(p.price),
          createdAt: serverTimestamp(),
        });
      }

      await updateDoc(doc(db, "carServices", selectedService.id), {
        estimatedCost:
          Number(selectedService.estimatedCost || 0) + totalPartsCost,
        updatedAt: serverTimestamp(),
      });

      toast.success("Parts added successfully");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to save parts");
    }
  };

  return (
    <div className="p-6 max-w-6xl bg-white shadow rounded-lg mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Add Service Parts</h2>

      {/* SEARCH SERVICE */}
      <div className="bg-white p-4 rounded-xl  space-y-3">
        <input
          placeholder="Search Service ID customer mobile mechanic"
          className="w-full
    rounded-lg
    border border-gray-200
    pl-10 px-4 py-4
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-900/40
    focus:border-gray-500
    transition
    bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <div className="border rounded max-h-52 overflow-auto">
            {filteredServices.map(s => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedService(s);
                  setSearch("");
                }}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-300"
              >
                <div className="font-semibold">{s.carServiceId}</div>
                <div className="text-sm text-gray-500">
                  {s.customerName} • {s.mobileNumber} • {s.mechanic}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED SERVICE */}
      {selectedService && (
        <div className="bg-white shadow  text-black p-4 rounded-lg text-sm grid grid-cols-2 gap-2">
          <div><b>Customer:</b> {selectedService.customerName}</div>
          <div><b>Mobile:</b> {selectedService.mobileNumber}</div>
          <div><b>Mechanic:</b> {selectedService.mechanic}</div>
          <div><b>Car No:</b> {selectedService.carNumber}</div>
        </div>
      )}

      {/* PARTS TABLE */}
      <div className="bg-white rounded-2xl shadow  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-4 text-left">Part Name</th>
              <th className="px-4 py-4 text-left">Qty</th>
              <th className="px-4 py-4 text-left">Price</th>
              <th className="px-4 py-4 text-left">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {parts.map((p, i) => (
              <tr key={i} className="border-b border-gray-300 ">
                <td className="px-4 py-4">
                  <input
                    className="rounded-lg
    border border-gray-200
    pl-10 px-4 py-3
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-900/40
    focus:border-gray-500
    transition
    bg-white"
                    placeholder="Enter part names"
                    value={p.partName}
                    onChange={(e) =>
                      handlePartChange(i, "partName", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    className="rounded-lg
    border border-gray-200
    pl-10 px-4 py-3
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-900/40
    focus:border-gray-500
    transition
    bg-white"
                    
                    value={p.qty}
                    onChange={(e) =>
                      handlePartChange(i, "qty", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-4">
                  <input
                    type="number"
                    className="rounded-lg
    border border-gray-200
    pl-10 px-4 py-3
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-900/40
    focus:border-gray-500
    transition
    bg-white"
                    value={p.price}
                    onChange={(e) =>
                      handlePartChange(i, "price", e.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-4 font-semibold">
                  ₹{p.qty * p.price}
                </td>

                <td>
                  {parts.length > 1 && (
                    <button
                      onClick={() => removePartRow(i)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        </div>
        

       <div className="flex items-center justify-end">
         <button
          onClick={addPartRow}
          className="bg-black text-white mt-3 flex items-center gap-2 px-4 py-3 rounded-lg font-bold"
        >
          <FaPlus /> Add Part
        </button>
       </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Total Parts Cost: ₹{totalPartsCost}
        </h3>

        <button
          onClick={handleSave}
          className="bg-black text-white mt-3 flex items-center gap-2 px-4 py-3 rounded-lg font-bold hover:bg-orange-500"
        >
          Save Parts
        </button>
      </div>
    </div>
  );
};

export default AddServiceParts;
