// import { useEffect, useState } from "react";
// import {
//   collection,
//   onSnapshot,
//   query,
//   orderBy,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// /* 🔹 STATUS LIST */
// const BOOKING_STATUS = [
//   "Booked",
//   "Call Verified",
//   "Approved",
//   "Processing",
//   "Waiting for Spare",
//   "Service Going on",
//   "Bill Pending",
//   "Bill Completed",
//   "Service Completed",
// ];

// const ShowAllBookings = () => {
//   const navigate = useNavigate();

//   const [bookings, setBookings] = useState([]);
//   const [view, setView] = useState("card");
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   /* 🔥 FETCH BOOKINGS */
//   useEffect(() => {
//     const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

//     const unsub = onSnapshot(q, (snap) => {
//       setBookings(
//         snap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//       );
//     });

//     return () => unsub();
//   }, []);

//   /* 🔎 FILTER */
//   const filtered = bookings.filter((b) => {
//     const matchSearch =
//       b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
//       b.name?.toLowerCase().includes(search.toLowerCase()) ||
//       b.phone?.includes(search);

//     const matchStatus =
//       statusFilter === "All" || b.status === statusFilter;

//     return matchSearch && matchStatus;
//   });

//   /* 🎨 STATUS COLOR */
//   const statusColor = (status) => {
//     switch (status) {
//       case "Booked":
//         return "bg-blue-500/20 text-blue-400";
//       case "Processing":
//         return "bg-yellow-500/20 text-yellow-400";
//       case "Service Completed":
//         return "bg-green-500/20 text-green-400";
//       case "Bill Pending":
//         return "bg-orange-500/20 text-orange-400";
//       default:
//         return "bg-gray-500/20 text-gray-300";
//     }
//   };

//   /* 🔄 STATUS UPDATE (Optimistic) */
//   const updateStatus = async (booking, newStatus) => {
//     if (booking.status === "Service Completed") return;

//     const previousStatus = booking.status;

//     /* 🟢 Instant UI update */
//     setBookings((prev) =>
//       prev.map((b) =>
//         b.id === booking.id ? { ...b, status: newStatus } : b
//       )
//     );

//     try {
//       /* 🟡 Update global */
//       await updateDoc(doc(db, "bookings", booking.id), {
//         status: newStatus,
//       });

//       /* 🟡 Update user subcollection */
//       if (booking.uid) {
//         await updateDoc(
//           doc(db, "users", booking.uid, "bookings", booking.id),
//           {
//             status: newStatus,
//           }
//         );
//       }

//       toast.success("Status updated");
//     } catch (err) {
//       console.error("Status update failed", err);

//       /* 🔴 Revert UI if error */
//       setBookings((prev) =>
//         prev.map((b) =>
//           b.id === booking.id ? { ...b, status: previousStatus } : b
//         )
//       );

//       toast.error("Failed to update status");
//     }
//   };

//   return (
//     <div className="p-8  max-w-7xl mx-auto">

//       {/* 🔝 TOP BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <h2 className="text-3xl font-bold">All Bookings</h2>

//         <div className="flex flex-wrap gap-3">

//           {/* 🔍 SEARCH */}
//           <input
//             type="text"
//             placeholder="Search booking, name, phone..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-4 py-2 rounded-xl bg-black/50 border border-white/10"
//           />

//           {/* 🎯 STATUS FILTER */}
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-2 rounded-xl bg-black/50 border border-white/10"
//           >
//             <option>All</option>
//             {BOOKING_STATUS.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>

//           {/* 🔄 VIEW TOGGLE */}
//           <button
//             onClick={() => setView(view === "card" ? "table" : "card")}
//             className="px-4 py-2 rounded-xl bg-gray-800"
//           >
//             {view === "card" ? "Table View" : "Card View"}
//           </button>

//           {/* ➕ ADD BOOKING */}
//           <button
//             onClick={() => navigate("/admin/addbooking")}
//             className="px-6 py-2 rounded-xl font-semibold
//             bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
//           >
//             + Add Booking
//           </button>
//         </div>
//       </div>

//       {/* 🟦 CARD VIEW */}
//       {view === "card" && (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filtered.map((b) => (
//             <div
//               key={b.id}
//               className="p-6 rounded-2xl bg-white/5 border border-white/10"
//             >
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-semibold">{b.bookingId}</h3>

//                 <span
//                   className={`text-xs px-3 py-1 rounded-full ${statusColor(
//                     b.status
//                   )}`}
//                 >
//                   {b.status}
//                 </span>
//               </div>

//               <p className="text-gray-300 mt-2">
//                 {b.brand} • {b.model}
//               </p>

//               <p className="text-gray-400 text-sm">👤 {b.name}</p>
//               <p className="text-gray-400 text-sm">📞 {b.phone}</p>

//               <p className="text-gray-400 text-sm mt-2 line-clamp-2">
//                 📍 {b.location}
//               </p>

//               {/* 🔄 STATUS DROPDOWN */}
//               <select
//                 value={b.status}
//                 disabled={b.status === "Service Completed"}
//                 onChange={(e) =>
//                   updateStatus(b, e.target.value)
//                 }
//                 className="mt-3 w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-sm disabled:opacity-50"
//               >
//                 {BOOKING_STATUS.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>

//               <p className="text-black text-xs mt-3">
//                 {b.createdAt?.toDate?.().toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🟨 TABLE VIEW */}
//       {view === "table" && (
//         <div className="overflow-auto rounded-xl border border-white/10">
//           <table className="w-full text-sm">
//             <thead className="bg-black/40 text-gray-300">
//               <tr>
//                 <th className="p-3 text-left">Booking ID</th>
//                 <th className="p-3 text-left">Customer</th>
//                 <th className="p-3 text-left">Car</th>
//                 <th className="p-3 text-left">Phone</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.map((b) => (
//                 <tr key={b.id} className="border-t border-white/10">
//                   <td className="p-3">{b.bookingId}</td>
//                   <td className="p-3">{b.name}</td>
//                   <td className="p-3">
//                     {b.brand} • {b.model}
//                   </td>
//                   <td className="p-3">{b.phone}</td>

//                   <td className="p-3">
//                     <select
//                       value={b.status}
//                       disabled={b.status === "Service Completed"}
//                       onChange={(e) =>
//                         updateStatus(b, e.target.value)
//                       }
//                       className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-xs disabled:opacity-50"
//                     >
//                       {BOOKING_STATUS.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                   </td>

//                   <td className="p-3">
//                     {b.createdAt?.toDate?.().toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {filtered.length === 0 && (
//         <p className="text-center text-gray-400 mt-10">
//           No bookings found
//         </p>
//       )}
//     </div>
//   );
// };

// export default ShowAllBookings;


import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaThLarge, FaTable } from "react-icons/fa";
import {
  FaCar,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

/* 🔹 STATUS LIST */
const BOOKING_STATUS = [
  "Booked",
  "Call Verified",
  "Approved",
  "Processing",
  "Waiting for Spare",
  "Service Going on",
  "Bill Pending",
  "Bill Completed",
  "Service Completed",
];

const ShowAllBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("card");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* 🔥 FETCH BOOKINGS */
  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setBookings(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  /* 🔎 FILTER */
  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search);

    const matchStatus = statusFilter === "All" || b.status === statusFilter;

    return matchSearch && matchStatus;
  });

  /* 🎨 STATUS COLOR */
  const statusColor = (status) => {
    switch (status) {
      case "Booked":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Service Completed":
        return "bg-green-100 text-green-700";
      case "Bill Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* 🔄 STATUS UPDATE + COPY TO SERVICES */
  const updateStatus = async (booking, newStatus) => {
    if (booking.status === "Service Completed") return;

    const previousStatus = booking.status;

    /* 🟢 Optimistic UI */
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id ? { ...b, status: newStatus } : b
      )
    );

    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: newStatus,
      });

      if (booking.uid) {
        await updateDoc(
          doc(db, "users", booking.uid, "bookings", booking.id),
          { status: newStatus }
        );
      }

      /* 🚀 COPY TO allServices WHEN APPROVED */
      if (newStatus === "Approved" && !booking.serviceCreated) {
        const serviceData = {
          bookingId: booking.bookingId,
          bookingDocId: booking.id,
          uid: booking.uid,
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          brand: booking.brand,
          model: booking.model,
          issue: booking.issue,
          otherIssue: booking.otherIssue || "",
          location: booking.location,
          address: booking.address,
          serviceStatus: "Pending",
          createdAt: booking.createdAt || new Date(),
        };

        await addDoc(collection(db, "allServices"), serviceData);

        await updateDoc(doc(db, "bookings", booking.id), {
          serviceCreated: true,
        });

        toast.success("Moved to Services");
      }

      toast.success("Status updated");
    } catch (err) {
      console.error(err);

      /* 🔴 Revert UI */
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: previousStatus } : b
        )
      );

      toast.error("Failed to update status");
    }
  };

  /* 📅 FORMAT DATE SAFE */
  const formatDate = (ts) => {
    try {
      return ts?.toDate?.().toLocaleString() || "-";
    } catch {
      return "-";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* 🔝 TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* 🔎 SEARCH */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search booking, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm shadow-sm focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* 🎯 STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[42px] min-w-[140px] border border-gray-300 bg-white px-4 rounded-md text-sm shadow-sm focus:ring-2 focus:ring-black outline-none"
          >
            <option>All</option>
            {BOOKING_STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* 🔄 VIEW TOGGLE */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("card")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                view === "card"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaThLarge /> Card
            </button>

            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                view === "table"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaTable /> Table
            </button>
          </div>

          {/* ➕ ADD BOOKING */}
          <button
            onClick={() => navigate("/admin/addbooking")}
            className="h-[42px] bg-black text-white px-5 rounded-md font-bold shadow hover:bg-gray-900 transition"
          >
            + Add Booking
          </button>
        </div>
      </div>

      {/* 🟦 CARD VIEW */}
      {view === "card" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-gray-300 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{b.bookingId}</h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 text-sm">
                <FaCar /> {b.brand} • {b.model}
              </p>

              <p className="text-sm flex items-center gap-2 mt-2">
                <FaUser /> {b.name}
              </p>

              <p className="text-sm flex items-center gap-2 mt-2">
                <FaPhone /> {b.phone}
              </p>

              <p className="text-sm flex items-start gap-2 mt-2 line-clamp-2">
                <FaMapMarkerAlt className="mt-0.5" />
                {b.location}
              </p>

              <select
                value={b.status}
                disabled={b.status === "Service Completed"}
                onChange={(e) => updateStatus(b, e.target.value)}
                className="mt-4 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                {BOOKING_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <p className="text-xs mt-3 flex items-center gap-2 text-gray-500">
                <FaClock /> {formatDate(b.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 🟨 TABLE VIEW */}
      {view === "table" && (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm ">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-black to-cyan-400 text-white text-left">
              <tr>
                <th className="px-4 py-4 text-left">S No</th>
                <th className="px-4 py-4 text-left">Booking ID</th>
                <th className="px-4 py-4 text-left">Customer</th>
                <th className="px-4 py-4 text-left">Car</th>
                <th className="px-4 py-4 text-left">Phone</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} className="border-t border-gray-300">
                  <td className="px-4 py-4">{i + 1}</td>
                  <td className="px-4 py-4">{b.bookingId}</td>
                  <td className="px-4 py-4">{b.name}</td>
                  <td className="px-4 py-4">
                    {b.brand} • {b.model}
                  </td>
                  <td className="px-4 py-4">{b.phone}</td>

                  <td className="px-4 py-4">
                    <select
                      value={b.status}
                      disabled={b.status === "Service Completed"}
                      onChange={(e) => updateStatus(b, e.target.value)}
                      className="px-3 py-1 rounded-lg border border-gray-300 text-xs bg-white"
                    >
                      {BOOKING_STATUS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-4">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No bookings found
        </p>
      )}
    </div>
  );
};

export default ShowAllBookings;
