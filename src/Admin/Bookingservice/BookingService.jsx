import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiMapPin,
  FiPlus,
  FiList,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

const BookAService = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("form"); // form | list
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "",
    vehicle: "",
    date: "",
    time: "",
    serviceType: "",
    location: "",
    lat: "",
    lng: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📍 Current Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          location: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
        }));
        toast.success("Location captured");
      },
      () => toast.error("Location permission denied")
    );
  };

  // ✅ Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.date || !form.time || !form.serviceType) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "appointments"), {
        ...form,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Appointment booked successfully!");
      setView("list");

      setForm({
        name: "",
        phone: "",
        email: "",
        reason: "",
        vehicle: "",
        date: "",
        time: "",
        serviceType: "",
        location: "",
        lat: "",
        lng: "",
      });
    } catch {
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // 📋 Fetch All Bookings
  const fetchBookings = async () => {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (view === "list") fetchBookings();
  }, [view]);

  const labelClass = "text-sm font-semibold text-gray-800 mb-1";
  const inputClass =
    "w-full bg-white rounded-lg border border-gray-300 px-5 py-3.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40";

  return (
    <section className="min-h-screen bg-white rounded-lg shadow-2xl py-5">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-black">
            Online Service Appointments
          </h1>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setView("form")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                view === "form"
                  ? "bg-black text-white"
                  : "border border-gray-300"
              }`}
            >
              <FiPlus /> Add New Booking
            </button>

            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                view === "list"
                  ? "bg-black text-white"
                  : "border border-gray-300"
              }`}
            >
              <FiList /> Show All Bookings
            </button>
          </div>
        </div>

        {/* ================= FORM VIEW ================= */}
        {view === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className={labelClass}>Your Name *</label>
              <input name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone *" className={inputClass} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
            </div>

            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select service location</option>
              <option value="home">Home Service</option>
              <option value="showroom">Showroom Visit</option>
            </select>

            {form.serviceType === "home" && (
              <>
                <button type="button" onClick={getCurrentLocation} className="flex gap-2 text-orange-500">
                  <FiMapPin /> Use Current Location
                </button>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Home address" className={inputClass} />
              </>
            )}

            

                 <div className="grid md:grid-cols-2 gap-6">

     
      {/* Reason */}
      <div>
        <label className={labelClass}>Appointment Reason</label>
        <input
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Eg: General service, oil change"
          className={inputClass}
        />
      </div>

      {/* Vehicle */}
      <div>
        <label className={labelClass}>Vehicle Information</label>
        <input
          name="vehicle"
          value={form.vehicle}
          onChange={handleChange}
          placeholder="Car model, number, etc."
          className={inputClass}
        />
      </div>

      </div>

            {form.serviceType === "showroom" && (
              <select name="location" value={form.location} onChange={handleChange} className={inputClass}>
                <option value="">Select showroom</option>
                <option>Chennai Showroom</option>
                <option>Bangalore Showroom</option>
                <option>Coimbatore Showroom</option>
              </select>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
              <select name="time" value={form.time} onChange={handleChange} className={inputClass}>
                <option value="">Time</option>
                <option>9 AM</option>
                <option>10 AM</option>
                <option>11 AM</option>
                <option>2 PM</option>
                <option>3 PM</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button className="bg-black text-white px-10 py-4 rounded-lg flex gap-2">
                {loading ? "BOOKING..." : "BOOK APPOINTMENT"}
                <FiArrowRight />
              </button>
            </div>
          </form>
        )}

        {/* ================= LIST VIEW ================= */}
        {view === "list" && (
          <div className="bg-gray-50 rounded-lg p-5 space-y-4">
            {bookings.length === 0 && (
              <p className="text-center text-gray-500">No bookings found</p>
            )}

            {bookings.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{b.name}</p>
                    <p className="text-sm text-gray-600">
                      {b.date} • {b.time}
                    </p>
                    <p className="text-sm">{b.serviceType} – {b.location}</p>
                  </div>
                  <span className="text-orange-500 font-semibold">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookAService;
