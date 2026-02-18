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

//               <p className="text-gray-500 text-xs mt-3">
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
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

    const matchStatus =
      statusFilter === "All" || b.status === statusFilter;

    return matchSearch && matchStatus;
  });

  /* 🎨 STATUS COLOR */
  const statusColor = (status) => {
    switch (status) {
      case "Booked":
        return "bg-blue-500/20 text-blue-400";
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Service Completed":
        return "bg-green-500/20 text-green-400";
      case "Bill Pending":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  /* 🔄 STATUS UPDATE + COPY TO SERVICES */
  const updateStatus = async (booking, newStatus) => {
    if (booking.status === "Service Completed") return;

    const previousStatus = booking.status;

    /* 🟢 Optimistic UI update */
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id ? { ...b, status: newStatus } : b
      )
    );

    try {
      /* 🟡 Update global booking */
      await updateDoc(doc(db, "bookings", booking.id), {
        status: newStatus,
      });

      /* 🟡 Update user subcollection */
      if (booking.uid) {
        await updateDoc(
          doc(db, "users", booking.uid, "bookings", booking.id),
          {
            status: newStatus,
          }
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

        /* 🟢 Mark booking as copied */
        await updateDoc(doc(db, "bookings", booking.id), {
          serviceCreated: true,
        });

        toast.success("Moved to Services");
      }

      toast.success("Status updated");
    } catch (err) {
      console.error("Status update failed", err);

      /* 🔴 Revert UI if error */
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: previousStatus } : b
        )
      );

      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* 🔝 TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold">All Bookings</h2>

        <div className="flex flex-wrap gap-3">

          {/* 🔍 SEARCH */}
          <input
            type="text"
            placeholder="Search booking, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-black/50 border border-white/10"
          />

          {/* 🎯 STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-black/50 border border-white/10"
          >
            <option>All</option>
            {BOOKING_STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* 🔄 VIEW TOGGLE */}
          <button
            onClick={() => setView(view === "card" ? "table" : "card")}
            className="px-4 py-2 rounded-xl bg-gray-800"
          >
            {view === "card" ? "Table View" : "Card View"}
          </button>

          {/* ➕ ADD BOOKING */}
          <button
            onClick={() => navigate("/admin/addbooking")}
            className="px-6 py-2 rounded-xl font-semibold
            bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
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
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{b.bookingId}</h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusColor(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>
              </div>

              <p className="text-gray-300 mt-2">
                {b.brand} • {b.model}
              </p>

              <p className="text-gray-400 text-sm">👤 {b.name}</p>
              <p className="text-gray-400 text-sm">📞 {b.phone}</p>

              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                📍 {b.location}
              </p>

              {/* 🔄 STATUS DROPDOWN */}
              <select
                value={b.status}
                disabled={b.status === "Service Completed"}
                onChange={(e) =>
                  updateStatus(b, e.target.value)
                }
                className="mt-3 w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-sm disabled:opacity-50"
              >
                {BOOKING_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <p className="text-gray-500 text-xs mt-3">
                {b.createdAt?.toDate?.().toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 🟨 TABLE VIEW */}
      {view === "table" && (
        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-black/40 text-gray-300">
              <tr>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Car</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="p-3">{b.bookingId}</td>
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">
                    {b.brand} • {b.model}
                  </td>
                  <td className="p-3">{b.phone}</td>

                  <td className="p-3">
                    <select
                      value={b.status}
                      disabled={b.status === "Service Completed"}
                      onChange={(e) =>
                        updateStatus(b, e.target.value)
                      }
                      className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-xs disabled:opacity-50"
                    >
                      {BOOKING_STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3">
                    {b.createdAt?.toDate?.().toLocaleDateString()}
                  </td>
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
