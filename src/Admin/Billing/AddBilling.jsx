import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBillings = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [parts, setParts] = useState([]);

  const [labour, setLabour] = useState("");
  const [gstPercent, setGstPercent] = useState(18);

  /* =======================
     FETCH SERVICES
  ======================= */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "carServices"));
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        toast.error("Failed to load services");
      }
    };
    fetchServices();
  }, []);

  /* =======================
     SELECT SERVICE
  ======================= */
  const selectService = async (s) => {
    try {
      setSelectedService(s);

      const partsSnap = await getDocs(
        collection(db, "carServices", s.id, "parts")
      );

      const partsData = partsSnap.docs.map(d => ({
        ...d.data(),
        qty: Number(d.data().qty || 0),
        price: Number(d.data().price || 0),
      }));

      setParts(partsData);
    } catch (err) {
      toast.error("Failed to load spare parts");
    }
  };

  /* =======================
     CALCULATIONS (SAFE)
  ======================= */
  const partsTotal = parts.reduce(
    (sum, p) => sum + Number(p.qty) * Number(p.price),
    0
  );

  const labourAmount = Number(labour || 0);
  const gst = Number(gstPercent || 0);

  const subTotal = partsTotal + labourAmount;
  const gstAmount = (subTotal * gst) / 100;
  const grandTotal = subTotal + gstAmount;

  /* =======================
     SAVE BILL
  ======================= */
 const handleGenerateBill = async () => {
  if (!selectedService) {
    toast.error("Please select a service");
    return;
  }

  if (!parts || parts.length === 0) {
    toast.error("Please add at least one spare part");
    return;
  }

  // 🔒 Safe number conversion
  const safeParts = parts.map((p) => {
    const qty = Number(p.qty || 0);
    const price = Number(p.price || 0);

    return {
      ...p,
      qty,
      price,
      total: qty * price,
    };
  });

  const labourCharge = Number(labour || 0);
  const gstPercentSafe = Number(gstPercent || 0);

  const partsTotal = safeParts.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const subTotal = partsTotal + labourCharge;
  const gstAmount = (subTotal * gstPercentSafe) / 100;
  const grandTotal = subTotal + gstAmount;

  if (grandTotal <= 0) {
    toast.error("Invalid billing amount");
    return;
  }

  try {
    const invoiceNo = `INV-${Date.now()}`;

    await addDoc(collection(db, "billings"), {
      invoiceNo,

      // 🔧 Service / Car Details
      serviceId: selectedService.id,
      carServiceId: selectedService.carServiceId,
      carNumber: selectedService.carNumber,

      // 👤 Customer
      customerName: selectedService.customerName,
      mobileNumber: selectedService.mobileNumber,

      // 👨‍🔧 Mechanic
      mechanic: selectedService.mechanic,

      // 🧾 Billing
      parts: safeParts,
      partsTotal,
      labour: labourCharge,
      gstPercent: gstPercentSafe,
      gstAmount,
      subTotal,
      grandTotal,

      // 💳 Payment
      paymentStatus: "Pending", // Pending | Paid
      paymentMode: "",          // Cash | UPI | Card
      status: "Generated",      // Generated | Cancelled

      createdAt: serverTimestamp(),
    });

    toast.success("Invoice generated successfully 🚗💰");
    navigate("/admin/billing");
  } catch (error) {
    console.error("Billing Error:", error);
    toast.error("Failed to generate invoice");
  }
};



  return (
    <div className="p-6 max-w-6xl bg-white shadow rounded-lg mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Generate Billing Invoice</h2>

      {/* SEARCH SERVICE */}
      <div className="space-y-1">
        <label className="text-sm mt-3 ml-0 font-medium">
          Search Service
        </label>
        <input
          placeholder="Service ID Customer Name  Mobile Number"
          className="w-full mt-3
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
      </div>

      {search && (
        <div className="border rounded max-h-56 overflow-auto">
          {services
            .filter(s =>
              `${s.carServiceId} ${s.customerName} ${s.mobileNumber}`
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map(s => (
              <div
                key={s.id}
                onClick={() => {
                  selectService(s);
                  setSearch("");
                }}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <b>{s.carServiceId}</b> — {s.customerName} ({s.carNumber})
              </div>
            ))}
        </div>
      )}

      {/* SERVICE DETAILS */}
      {selectedService && (
        <div className="bg-white p-4 shadow  rounded grid grid-cols-2 gap-3 text-sm">
          <div><b>Customer:</b> {selectedService.customerName}</div>
          <div><b>Mobile:</b> {selectedService.mobileNumber}</div>
          <div><b>Car No:</b> {selectedService.carNumber}</div>
          <div><b>Mechanic:</b> {selectedService.mechanic}</div>
        </div>
      )}

      {/* PARTS TABLE */}
      {parts.length > 0 && (
        <div className=" p-3  overflow-x-auto">
          <h3 className="font-medium px-4 pt-3">Spare Parts</h3>
           <div className="bg-white rounded-2xl shadow  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4">S No</th>
                <th className="px-4 py-4">Part Name</th>
                <th className="px-4 py-4">Qty</th>
                <th className="px-4 py-4">Price (₹)</th>
                <th className="px-4 py-4">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, i) => (
                <tr key={i} className="border-t border-gray-300">
                  <td className="px-4 py-4 text-center">{i+1}</td>
                  <td className="px-4 py-4 text-center">{p.partName}</td>
                  <td className="px-4 py-4 text-center">{p.qty}</td>
                  <td className="px-4 py-4 text-center">{p.price}</td>
                  <td className="px-4 py-4 text-center">
                    {p.qty * p.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>
        </div>
      )}

      {/* LABOUR & GST */}
      {selectedService && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Labour Charges (₹)
            </label>
            <input
              type="number"
              placeholder="Enter labour amount"
              className="w-full mt-3
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
              value={labour}
              onChange={(e) => setLabour(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              GST Percentage (%)
            </label>
            <input
              type="number"
              placeholder="Eg: 18"
              className="w-full mt-3
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
              value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* TOTAL */}
      {selectedService && (
        <div className="bg-gray-50 p-4 rounded text-right font-semibold space-y-1">
          <p>Parts Total: ₹{partsTotal}</p>
          <p>Labour Charges: ₹{labourAmount}</p>
          <p>GST ({gst}%): ₹{gstAmount.toFixed(2)}</p>
          <p className="text-lg text-green-700">
            Grand Total: ₹{grandTotal.toFixed(2)}
          </p>
        </div>
      )}

      {/* ACTION */}
      {selectedService && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="border px-5 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={parts.length === 0}
            onClick={handleGenerateBill}
            className="bg-black hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-2 rounded"
          >
            Generate Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default AddBillings;

