import React, { useEffect, useState } from "react";
import {
  FaTools,
  FaCalendarCheck,
  FaCogs,
  FaMoneyBillWave,
  FaUserCog,
  FaBoxes

} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";


import { collection, query, where, onSnapshot, Timestamp, orderBy, limit, } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";


/* -------------------- COMPONENTS -------------------- */

import { ArrowUp, ArrowDown } from "lucide-react";

const GradientStatCard = ({
  title,
  value,
  change,
  isUp,
  gradient,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded text-white p-8 shadow-md ${gradient}`}
    >
      {/* TITLE */}
      <p className="text-xs font-semibold opacity-90 tracking-wide">
        {title}
      </p>

      {/* VALUE */}
      <h2 className="text-2xl font-bold mt-2">{value}</h2>

      {/* CHANGE ROW */}
      <div className="flex items-center justify-between mt-2 text-sm opacity-95">
        <span>Compared to last week</span>

        <span className="flex items-center gap-1 font-semibold">
          {isUp ? (
            <ArrowUp size={16} className="bg-white/20 rounded-full p-1" />
          ) : (
            <ArrowDown size={16} className="bg-white/20 rounded-full p-1" />
          )}
          {change}
        </span>
      </div>

      {/* SPARKLINE */}
      <div className="absolute bottom-0 top-28 left-0 w-full h-16 opacity-30">
        <svg viewBox="0 0 100 30" className="w-full h-full">
          <polyline
            fill="none"
            stroke="white"
            strokeWidth="2"
            points="0,20 10,15 20,18 30,10 40,12 50,8 60,14 70,6 80,12 90,5 100,9"
          />
        </svg>
      </div>
    </div>
  );
};

/* -------------------- DASHBOARD -------------------- */

const Dashboard = () => {

  const [stats, setStats] = useState({
    patients: 0,
    appointmentsToday: 0,
    treatments: 0,
    pendingPayments: 0,
    doctors: 0,
    equipmentDue: 0,
  });

  useEffect(() => {
    // ⏰ TODAY RANGE (IST safe)
    const start = Timestamp.fromDate(
      new Date(new Date().setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date().setHours(23, 59, 59, 999))
    );

    // 👤 Patients
    onSnapshot(collection(db, "carServices"), (snap) =>
      setStats((p) => ({ ...p, patients: snap.size }))
    );

    // 📅 Today's Appointments
    onSnapshot(
      query(
        collection(db, "appointments"),
        where("createdAt", ">=", start),
        where("createdAt", "<=", end)
      ),
      (snap) =>
        setStats((p) => ({ ...p, appointmentsToday: snap.size }))
    );

    // 🦷 Active Treatments (status = active)
    onSnapshot(
      query(collection(db, "carServices"), where("status", "==", "In Progress")),
      (snap) =>
        setStats((p) => ({ ...p, treatments: snap.size }))
    );

    // 💰 Pending Payments
    onSnapshot(
      query(collection(db, "billings"), where("paymentStatus", "==", "pending")),
      (snap) =>
        setStats((p) => ({ ...p, pendingPayments: snap.size }))
    );

    // 👨‍⚕️ Available Doctors (status = active)
    onSnapshot(
      query(collection(db, "employees"), where("status", "==", "active")),
      (snap) =>
        setStats((p) => ({ ...p, doctors: snap.size }))
    );

    // 🧰 Equipment Due (status = active)
    onSnapshot(
      query(collection(db, "carInventory")),
      (snap) =>
        setStats((p) => ({ ...p, equipmentDue: snap.size }))
    );
  }, []);


  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getWeekRange = (offset = 0) => {
    const today = new Date();
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1 - offset * 7);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
      start: Timestamp.fromDate(monday),
      end: Timestamp.fromDate(sunday),
    };
  };

  const [appointmentData, setAppointmentData] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const thisWeek = getWeekRange(0);
    const lastWeek = getWeekRange(1);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const q = query(collection(db, "appointments"));

    const unsub = onSnapshot(q, (snap) => {
      const baseData = days.map((d) => ({
        day: d,
        thisWeek: 0,
        lastWeek: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tempCounts = {
        pending: 0,
        completed: 0,
        cancelled: 0,
      };

      snap.forEach((doc) => {
        const data = doc.data();
        if (!data.status) return;

        const status = String(data.status).toLowerCase().trim();

        // ✅ SAFELY PICK DATE
        const baseDate =
          (status === "completed" || status === "cancelled")
            ? data.updatedAt?.toDate() || data.createdAt?.toDate()
            : data.createdAt?.toDate();

        if (!baseDate) return;

        const date = new Date(baseDate);
        date.setHours(0, 0, 0, 0);

        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

        /* =====================
           TODAY COUNTS (ONLY TODAY)
        ===================== */
        if (date.getTime() === today.getTime()) {
          if (status === "pending") tempCounts.pending++;
          if (status === "completed") tempCounts.completed++;
          if (status === "cancelled") tempCounts.cancelled++;
        }

        /* =====================
           THIS WEEK
        ===================== */
        if (
          date >= thisWeek.start.toDate() &&
          date <= thisWeek.end.toDate()
        ) {
          baseData[dayIndex].thisWeek++;

          if (status === "pending") baseData[dayIndex].pending++;
          if (status === "completed") baseData[dayIndex].completed++;
          if (status === "cancelled") baseData[dayIndex].cancelled++;
        }

        /* =====================
           LAST WEEK
        ===================== */
        if (
          date >= lastWeek.start.toDate() &&
          date <= lastWeek.end.toDate()
        ) {
          baseData[dayIndex].lastWeek++;
        }
      });

      setAppointmentData(baseData);
      setCounts(tempCounts);
    });

    return () => unsub();
  }, []);



  const [revenueData, setRevenueData] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const now = new Date();

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const q = query(
      collection(db, "billings"),
      where("createdAt", ">=", Timestamp.fromDate(yearStart)),
      where("createdAt", "<=", Timestamp.fromDate(yearEnd))
    );

    const unsub = onSnapshot(q, (snap) => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const monthly = months.map((m) => ({
        month: m,
        revenue: 0,
      }));

      let thisMonthTotal = 0;
      const currentMonth = now.getMonth();

      snap.forEach((doc) => {
        const data = doc.data();
        if (!data.createdAt) return;

        const status = (data.paymentStatus || "").toLowerCase();

        // ✅ allow paid + partial
        if (!["paid", "partial"].includes(status)) return;

        const date = data.createdAt.toDate();
        const monthIndex = date.getMonth();

        const paid =
          status === "paid"
            ? Number(data.grandTotal || 0)
            : Number(data.paidAmount || 0);

        monthly[monthIndex].revenue += paid;

        if (monthIndex === currentMonth) {
          thisMonthTotal += paid;
        }
      });

      setRevenueData(monthly);
      setMonthlyTotal(thisMonthTotal);
    });

    return () => unsub();
  }, []);



  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "carServices"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(list);
    });

    return () => unsub();
  }, []);

  const formatDate = (ts) => {
    if (!ts) return "-";

    if (ts.seconds) {
      return ts.toDate().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    if (ts instanceof Date) {
      return ts.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(ts).toLocaleDateString("en-IN");
  };

  const SERVICE_COLORS = {
    "Oil Change": "#2563eb",
    "General Service": "#16a34a",
    "Wheel Alignment": "#f97316",
    "Engine Check": "#dc2626",
  };

  const [stats1, setStats1] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "carServices"),
      where("status", "in", ["Pending", "In Progress"])
    );

    const unsub = onSnapshot(q, (snap) => {
      const counts = {};
      let sum = 0;

      snap.forEach((doc) => {
        const data = doc.data();
        if (!data.serviceType) return;

        const serviceType = data.serviceType.trim();
        counts[serviceType] = (counts[serviceType] || 0) + 1;
        sum++;
      });

      setStats1(counts);
      setTotal(sum);
    });

    return () => unsub();
  }, []);




  const colors = [
    "#2563eb", // royal blue
    "#16a34a", // emerald green
    "#f97316", // vivid orange
    "#dc2626", // crimson red
    "#7c3aed", // rich violet
    "#0891b2", // teal cyan
    "#db2777", // rose pink
    "#65a30d", // lime green
  ];


  const gradient = (() => {
    let current = 0;
    const entries = Object.entries(stats1);

    if (!total || entries.length === 0) {
      return "conic-gradient(#e5e7eb 0% 100%)";
    }

    const gap = 0.6; // small gap between segments

    const parts = entries.map(([_, count], i) => {
      const percent = (count / total) * 100;
      const start = current + gap;
      current += percent;
      const end = current - gap;

      return `${colors[i % colors.length]} ${start}% ${end}%`;
    });

    return `conic-gradient(${parts.join(", ")})`;
  })();

  const [followUps, setFollowUps] = useState([]);


  useEffect(() => {
    // ⏰ Today range (IST safe)
    const start = Timestamp.fromDate(
      new Date(new Date().setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date().setHours(23, 59, 59, 999))
    );

    const q = query(
      collection(db, "appointments"),
      where("type", "==", "follow-up"),   // ✅ FIX
      where("createdAt", ">=", start),
      where("createdAt", "<=", end)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setFollowUps(list);
    });

    return () => unsub();
  }, []);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "carInventory"),
      orderBy("updatedAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(data);
    });

    return () => unsub();
  }, []);



  return (
    <div className="min-h-screen  p-2">
      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <GradientStatCard
          title="TODAY ORDERS"
          value="$5,74.12"
          change="+427"
          isUp={true}
          gradient="bg-gradient-to-r from-blue-500 to-blue-300"
        />

        <GradientStatCard
          title="TODAY EARNINGS"
          value="$1,230.17"
          change="-23.09%"
          isUp={false}
          gradient="bg-gradient-to-r from-pink-500 to-rose-400"
        />

        <GradientStatCard
          title="TOTAL EARNINGS"
          value="$7,125.70"
          change="52.09%"
          isUp={true}
          gradient="bg-gradient-to-r from-green-500 to-emerald-400"
        />

        <GradientStatCard
          title="PRODUCT SOLD"
          value="$4,820.50"
          change="-152.3"
          isUp={false}
          gradient="bg-gradient-to-r from-orange-500 to-amber-400"
        />
      </div>



      {/* APPOINTMENTS */}
      <div >


        {/* TWO COLUMNS INSIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* APPOINTMENTS */}
<div className="bg-white rounded-2xl mb-9 shadow-sm border border-gray-100 p-5">
  {/* HEADER */}
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
    <h4 className="font-semibold text-gray-800 text-lg">
      Booking Services
    </h4>

    {/* LEGEND */}
    <div className="flex flex-wrap gap-3 text-xs">
      {[
        { color: "bg-blue-500", label: "This Week" },
        { color: "bg-green-500", label: "Last Week" },
        { color: "bg-yellow-500", label: "Pending" },
        { color: "bg-emerald-600", label: "Completed" },
        { color: "bg-red-600", label: "Cancelled" },
      ].map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <span className={`w-3 h-3 rounded-full ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  </div>

  {/* BAR CHART */}
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={appointmentData || []} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

        <XAxis
          dataKey="day"
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
          domain={[0, "dataMax + 2"]}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        />

        {/* THIS WEEK */}
        <Bar
          dataKey="thisWeek"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />

        {/* LAST WEEK */}
        <Bar
          dataKey="lastWeek"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />

        {/* PENDING */}
        <Bar
          dataKey="pending"
          fill="#eab308"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />

        {/* COMPLETED */}
        <Bar
          dataKey="completed"
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />

        {/* CANCELLED */}
        <Bar
          dataKey="cancelled"
          fill="#dc2626"
          radius={[4, 4, 0, 0]}
          barSize={14}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* STATUS CARDS */}
  <div className="grid grid-cols-1 sm:grid-cols-3 mt-5 gap-3 text-center">
    <div className="bg-yellow-50 text-yellow-600 rounded-xl py-3 font-semibold shadow-sm">
      Pending: {counts?.pending ?? 0}
    </div>

    <div className="bg-green-50 text-green-600 rounded-xl py-3 font-semibold shadow-sm">
      Completed: {counts?.completed ?? 0}
    </div>

    <div className="bg-red-50 text-red-600 rounded-xl py-3 font-semibold shadow-sm">
      Cancelled: {counts?.cancelled ?? 0}
    </div>
  </div>
</div>



         <div className="bg-white rounded-2xl mb-9 shadow-sm border border-gray-100 p-5">
  <h4 className="font-semibold text-gray-800 mb-1">
    Financial Overview
  </h4>

  {/* TOTAL */}
  <h2 className="text-3xl font-bold mb-4">
    ₹ {(monthlyTotal || 0).toLocaleString("en-IN")}
  </h2>

  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={revenueData} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
        />

        <YAxis
          tickFormatter={(v) => `₹${v / 1000}k`}
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
        />

        <Tooltip
          formatter={(v) =>
            `₹ ${Number(v).toLocaleString("en-IN")}`
          }
          contentStyle={{
            borderRadius: "10px",
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: "12px" }}
        />

        {/* NET PROFIT */}
        <Bar
          dataKey="profit"
          name="Net Profit"
          fill="#1d4ed8"
          radius={[4, 4, 0, 0]}
          barSize={18}
        />

        {/* REVENUE */}
        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="#0ea5e9"
          radius={[4, 4, 0, 0]}
          barSize={18}
        />

        {/* FREE CASH FLOW */}
        <Bar
          dataKey="cash"
          name="Free Cash Flow"
          fill="#fbbf24"
          radius={[4, 4, 0, 0]}
          barSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        </div>
      </div>


      {/* PATIENT + TREATMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* PATIENT LIST */}
        <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Service List</h3>
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/carservies")}
            >
              View All
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border-collapse">

                {/* TABLE HEAD */}
                <thead className="bg-black text-white border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-4 text-left font-bold">S No</th>
                    <th className="px-3 py-4 text-left font-bold">Name</th>
                    <th className="px-3 py-4 text-left font-bold">Contact</th>
                    <th className="px-3 py-4 text-left font-bold">Last Visit</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {patients.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/services/view/${item.id}`)}
                    >
                      {/* S No */}
                      <td className="px-3 py-3 font-semibold">
                        {index + 1}
                      </td>

                      {/* Name (Customer + Car No) */}
                      <td className="px-3 py-3">
                        <div className="font-medium">{item.customerName}</div>
                        <div className="text-xs text-gray-500">
                          {item.carNumber}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-3 py-3">
                        {item.mobileNumber || "-"}
                      </td>

                      {/* Last Visit */}
                      <td className="px-3 py-3">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>


        {/* TREATMENT STATS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-5">
            Treatment Stats
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* DONUT */}
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full shadow-inner"
                style={{
                  background: gradient,
                  boxShadow: "0 0 0 6px #f8fafc inset",
                }}
              />


              {/* CENTER */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-800">
                  {total}
                </p>
                <p className="text-xs text-gray-500">
                  Active Treatments
                </p>
              </div>
            </div>

            {/* LEGEND */}
            <div className="flex-1 w-full space-y-3 text-sm">
              {Object.entries(stats1).map(([cat, count], index) => {
                const percent = total
                  ? Math.round((count / total) * 100)
                  : 0;

                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            colors[index % colors.length],
                        }}
                      />
                      <span className="font-medium text-gray-700">
                        {cat}
                      </span>
                    </div>

                    <span className="text-gray-600">
                      {percent}%
                    </span>
                  </div>
                );
              })}

              {total === 0 && (
                <div className="text-center text-gray-400 py-6">
                  No active treatments found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOLLOW UPS + EQUIPMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FOLLOW UPS */}


        {/* INVENTORY PREVIEW */}
        <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Inventory Status</h3>
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/inventory")}
            >
              View All
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">

                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-3 py-4 text-left font-bold">S No</th>
                    <th className="px-3 py-4 text-left font-bold">Item</th>
                    <th className="px-3 py-4 text-left font-bold">Category</th>
                    <th className="px-3 py-4 text-left font-bold">Stock</th>
                    <th className="px-3 py-4 text-left font-bold">Min</th>
                    <th className="px-3 py-4 text-left font-bold">Supplier</th>
                  </tr>
                </thead>

                <tbody>
                  {/* EMPTY STATE */}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-400">
                        No inventory found
                      </td>
                    </tr>
                  )}

                  {/* TABLE ROWS */}
                  {rows.map((r, index) => (
                    <tr
                      key={r.id}
                      className={`border-b  border-gray-300 ${r.stockQty <= r.minStock
                        ? "bg-red-50 text-red-700"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      {/* S No */}
                      <td className="px-3 py-4">{index + 1}</td>

                      {/* PART NAME */}
                      <td className="px-3 py-4 font-medium">
                        {r.partName}
                      </td>

                      {/* CATEGORY */}
                      <td className="px-3 py-4">
                        {r.category}
                      </td>

                      {/* STOCK QTY */}
                      <td className="px-3 py-4 text-center font-semibold">
                        {r.stockQty}
                      </td>

                      {/* MIN STOCK */}
                      <td className="px-3 py-4 text-center">
                        {r.minStock}
                      </td>

                      {/* VENDOR */}
                      <td className="px-3 py-4">
                        {r.vendor}
                      </td>
                    </tr>
                  ))}
                </tbody>


              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;




