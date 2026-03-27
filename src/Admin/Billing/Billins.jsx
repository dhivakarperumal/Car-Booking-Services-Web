// import { useEffect, useMemo, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Trash2,
//   Plus,
//   Pencil,
//   Printer,
// } from "lucide-react";
// import toast from "react-hot-toast";

// /* =========================
//    STATUS BADGE
// ========================= */
// const StatusBadge = ({ status }) => {
//   const map = {
//     paid: "bg-green-500",
//     partial: "bg-orange-400",
//     pending: "bg-yellow-400",
//   };

//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-white text-xs capitalize ${
//         map[status] || "bg-gray-400"
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// /* =========================
//    STAT CARD
// ========================= */
// const StatCard = ({ title, value }) => (
//   <div className="bg-white rounded-xl shadow p-5">
//     <p className="text-sm text-gray-500">{title}</p>
//     <p className="text-2xl font-bold mt-1">{value}</p>
//   </div>
// );

// /* =========================
//    MAIN
// ========================= */
// const Billings = () => {
//   const navigate = useNavigate();

//   const [bills, setBills] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [amountSort, setAmountSort] = useState("none");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;

//   /* =========================
//      LOAD BILLINGS
//   ========================= */
//   useEffect(() => {
//     const loadBills = async () => {
//       const q = query(
//         collection(db, "billings"),
//         orderBy("createdAt", "desc")
//       );

//       const snap = await getDocs(q);

//       setBills(
//         snap.docs.map((d) => {
//           const data = d.data();
//           return {
//             id: d.id,
//             ...data,
//             invoiceNo: data.invoiceNo || "INV---",
//             customerName: data.customerName || "Unknown",
//             carNumber: data.carNumber || "-",
//             paymentStatus: data.paymentStatus?.toLowerCase(),
//           };
//         })
//       );
//     };

//     loadBills();
//   }, []);

//   /* =========================
//      STATS
//   ========================= */
//   const totalRevenue = bills.reduce(
//     (sum, b) => sum + Number(b.grandTotal || 0),
//     0
//   );

//   const pendingCount = bills.filter(
//     (b) => b.paymentStatus !== "paid"
//   ).length;

//   /* =========================
//      FILTER + SORT
//   ========================= */
//   const filtered = useMemo(() => {
//     let data = bills.filter((b) => {
//       const text = `${b.invoiceNo} ${b.customerName} ${b.carNumber}`.toLowerCase();
//       return (
//         text.includes(search.toLowerCase()) &&
//         (statusFilter === "all" ||
//           b.paymentStatus === statusFilter)
//       );
//     });

//     if (amountSort === "low") {
//       data.sort((a, b) => a.grandTotal - b.grandTotal);
//     } else if (amountSort === "high") {
//       data.sort((a, b) => b.grandTotal - a.grandTotal);
//     }

//     return data;
//   }, [bills, search, statusFilter, amountSort]);

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);

//   const paginatedBills = filtered.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter, amountSort]);

//   /* =========================
//      DELETE
//   ========================= */
//   const deleteInvoice = async (id) => {
//     if (!window.confirm("Delete this invoice?")) return;
//     await deleteDoc(doc(db, "billings", id));
//     setBills((prev) => prev.filter((b) => b.id !== id));
//     toast.success("Invoice deleted");
//   };

//   /* =========================
//      PRINT
//   ========================= */
//   const printInvoice = (bill) => {
//     const win = window.open("", "", "width=900,height=650");

//     win.document.write(`
//       <html>
//       <head>
//         <title>Invoice ${bill.invoiceNo}</title>
//         <style>
//           body { font-family: Arial; padding: 30px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid #ccc; padding: 8px; }
//           th { background: #f3f3f3; }
//           .right { text-align: right; }
//         </style>
//       </head>
//       <body>
//         <h2>Car Service Invoice</h2>

//         <p><b>Invoice:</b> ${bill.invoiceNo}</p>
//         <p><b>Customer:</b> ${bill.customerName}</p>
//         <p><b>Car Number:</b> ${bill.carNumber}</p>
//         <p><b>Mobile:</b> ${bill.mobileNumber || "-"}</p>

//         <table>
//           <tr>
//             <th>Part</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Total</th>
//           </tr>
//           ${(bill.parts || [])
//             .map(
//               (p) => `
//             <tr>
//               <td>${p.partName}</td>
//               <td>${p.qty}</td>
//               <td class="right">₹${p.price}</td>
//               <td class="right">₹${p.total}</td>
//             </tr>`
//             )
//             .join("")}
//         </table>

//         <h3 class="right">Sub Total: ₹${bill.subTotal}</h3>
//         <h3 class="right">GST: ₹${bill.gstAmount}</h3>
//         <h3 class="right">Grand Total: ₹${bill.grandTotal}</h3>

//         <script>
//           window.print();
//           window.close();
//         </script>
//       </body>
//       </html>
//     `);

//     win.document.close();
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold"></h1>
//         <button
//           onClick={() => navigate("/admin/addbillings")}
//           className="bg-black hover:bg-orange-400 flex items-center justify-center py-3 text-white px-4 py-2 rounded  gap-2"
//         >
//           <Plus size={16} /> Create Invoice
//         </button>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
//         <StatCard title="Pending Invoices" value={pendingCount} />
//       </div>

//       {/* FILTER BAR */}
//       <div className="bg-white rounded-xl shadow p-4">
//   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//     {/* LEFT : SEARCH */}
//     <div className="relative w-full md:max-w-md">
//       <Search
//         size={18}
//         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//       />
//       <input
//         type="text"
//         placeholder="Search invoice customer car"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="
//           w-full
//           rounded-lg
//           border border-gray-200
//           pl-10 px-4 py-3
//           text-sm
//           shadow-sm
//           focus:outline-none
//           focus:ring-2
//           focus:ring-gray-900/40
//           focus:border-gray-500
//           transition
//           bg-white
//         "
//       />
//     </div>

//     {/* RIGHT : FILTERS */}
//     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

//       <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//         className="
//           rounded-lg
//           border border-gray-200
//           px-4 py-3
//           text-sm
//           shadow-sm
//           focus:outline-none
//           focus:ring-2
//           focus:ring-gray-900/40
//           focus:border-gray-500
//           transition
//           bg-white
//         "
//       >
//         <option value="all">All Status</option>
//         <option value="paid">Paid</option>
//         <option value="partial">Partial</option>
//         <option value="pending">Pending</option>
//       </select>

//       <select
//         value={amountSort}
//         onChange={(e) => setAmountSort(e.target.value)}
//         className="
//           rounded-lg
//           border border-gray-200
//           px-4 py-3
//           text-sm
//           shadow-sm
//           focus:outline-none
//           focus:ring-2
//           focus:ring-gray-900/40
//           focus:border-gray-500
//           transition
//           bg-white
//         "
//       >
//         <option value="none">Amount Sort</option>
//         <option value="low">Low → High</option>
//         <option value="high">High → Low</option>
//       </select>

//     </div>

//   </div>
// </div>


//       {/* TABLE */}
//       <div className="bg-white rounded-2xl shadow overflow-hidden">
//         <table className="min-w-full text-sm">
//           <thead className="bg-black text-white">
//             <tr>
//               <th className="px-4 py-4">S No</th>
//               <th className="px-4 py-4">Invoice</th>
//               <th className="px-4 py-4">Customer</th>
//               <th className="px-4 py-4">Car No</th>
//               <th className="px-4 py-4">Total</th>
//               <th className="px-4 py-4">Status</th>
//               <th className="px-4 py-4">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedBills.map((b, i) => (
//               <tr key={b.id} className="border-b border-gray-300">
//                 <td className="px-4 py-4">{i + 1}</td>
//                 <td className="px-4 py-4">{b.invoiceNo}</td>
//                 <td className="px-4 py-4">{b.customerName}</td>
//                 <td className="px-4 py-4">{b.carNumber}</td>
//                 <td className="px-4 py-4">₹{b.grandTotal}</td>
//                 <td className="px-4 py-4">
//                   <StatusBadge status={b.paymentStatus} />
//                 </td>
//                 <td className="px-4 py-4 flex gap-2">
//                   <button onClick={() => printInvoice(b)} className="bg-gray-700 text-white px-2 py-1 rounded">
//                     <Printer size={14} />
//                   </button>
//                   <button onClick={() => navigate(`/admin/addbillings/${b.id}`)} className="bg-yellow-500 text-white px-2 py-1 rounded">
//                     <Pencil size={14} />
//                   </button>
//                   <button onClick={() => deleteInvoice(b.id)} className="bg-red-500 text-white px-2 py-1 rounded">
//                     <Trash2 size={14} />
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {filtered.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center p-6">
//                   No invoices found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Billings;



import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddBillings = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [parts, setParts] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // ✅ SELECT TRACK
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD SERVICE + PARTS
  ========================= */
  useEffect(() => {
    if (!serviceId) return;

    const loadData = async () => {
      try {
        // 🔹 Service
        const serviceRef = doc(db, "carServices", serviceId);
        const serviceSnap = await getDoc(serviceRef);

        if (!serviceSnap.exists()) {
          toast.error("Service not found");
          navigate("/admin/services");
          return;
        }

        setService({ id: serviceSnap.id, ...serviceSnap.data() });

        // 🔹 Parts
        const partsRef = collection(db, "carServices", serviceId, "parts");
        const partsSnap = await getDocs(partsRef);

        const safeParts = partsSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            partName: data.partName,
            qty: Number(data.qty || 0),
            price: Number(data.price || 0),
            total: Number(data.qty || 0) * Number(data.price || 0),
          };
        });

        setParts(safeParts);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId, navigate]);

  if (loading) {
    return <div className="p-10 text-center">Loading invoice...</div>;
  }

  if (!service) return null;

  /* =========================
     TOTALS
  ========================= */
  const subTotal = parts.reduce((sum, p) => sum + p.total, 0);
  const gstAmount = Math.round(subTotal * 0.18);
  const grandTotal = subTotal + gstAmount;

  /* =========================
     SAVE INVOICE
  ========================= */
  const saveInvoice = async () => {
    try {
      setSaving(true);

      await addDoc(collection(db, "billings"), {
        serviceId: service.id,
        invoiceNo: `INV-${Date.now()}`,
        customerName: service.customerName,
        mobileNumber: service.customerMobile,
        carNumber: service.carNumber,

        parts,
        subTotal,
        gstAmount,
        grandTotal,

        paymentStatus, // ✅ SELECT VALUE SAVED
        createdAt: serverTimestamp(),
      });

      toast.success("Invoice created successfully");
      navigate("/admin/billings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save invoice");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-blue-700">
        Create Invoice
      </h2>

      {/* CUSTOMER */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <Info label="Customer" value={service.customerName} />
        <Info label="Mobile" value={service.customerMobile} />
        <Info label="Car Number" value={service.carNumber} />
        <Info label="Service ID" value={service.carServiceId} />
      </div>

      {/* PAYMENT STATUS */}
      <div className="max-w-xs">
        <label className="block text-sm text-gray-600 mb-1">
          Payment Status
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* PARTS TABLE */}
      <div className="overflow-hidden border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3">Part</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.partName}</td>
                <td className="px-4 py-3 text-center">{p.qty}</td>
                <td className="px-4 py-3 text-center">₹{p.price}</td>
                <td className="px-4 py-3 text-center font-medium">
                  ₹{p.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="text-right space-y-1">
        <p>Sub Total: ₹{subTotal}</p>
        <p>GST (18%): ₹{gstAmount}</p>
        <p className="text-xl font-semibold">
          Grand Total: ₹{grandTotal}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="border px-5 py-2 rounded"
        >
          Back
        </button>

        <button
          onClick={saveInvoice}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default AddBillings;

