import React, { useState } from "react";
import PageContainer from "./PageContainer";
import { useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    runTransaction,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

import { forwardRef } from "react";

const BOOKING_STATUS = {
    BOOKED: "Booked",
    CALL_VERIFIED: "Call Verified",
    APPROVED: "Approved",
    PROCESSING: "Processing",
    WAITING_SPARE: "Waiting for Spare",
    SERVICE_GOING: "Service Going on",
    BILL_PENDING: "Bill Pending",
    BILL_COMPLETED: "Bill Completed",
    SERVICE_COMPLETED: "Service Completed",
};

const Input = forwardRef(({ label, required, error, ...props }, ref) => (
    <div>
        <label className="block mb-2 text-sm text-gray-400">
            {label} {required && <span className="text-red-400">*</span>}
        </label>

        <input
            ref={ref}
            {...props}
            className={`w-full rounded-xl bg-black/60 border px-4 py-3 text-white
      focus:outline-none
      ${error ? "border-red-400" : "border-white/10 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"}`}
        />

        <p className="mt-1 h-4 text-xs text-red-400">{error || ""}</p>
    </div>
));

const Textarea = forwardRef(({ label, required, error, ...props }, ref) => (
    <div>
        <label className="block mb-2 text-sm text-gray-400">
            {label} {required && <span className="text-red-400">*</span>}
        </label>

        <textarea
            ref={ref}
            {...props}
            className={`w-full rounded-xl bg-black/60 border px-4 py-3 text-white
      focus:outline-none
      ${error ? "border-red-400" : "border-white/10 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"}`}
        />

        <p className="mt-1 h-4 text-xs text-red-400">{error || ""}</p>
    </div>
));

const Select = forwardRef(({ label, required, error, children, ...props }, ref) => (
    <div>
        <label className="block mb-2 text-sm text-gray-400">
            {label} {required && <span className="text-red-400">*</span>}
        </label>

        <select
            ref={ref}
            {...props}
            className={`w-full rounded-xl bg-black/60 border px-4 py-3 text-white
      focus:outline-none
      ${error ? "border-red-400" : "border-white/10 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"}`}
        >
            {children}
        </select>

        <p className="mt-1 h-4 text-xs text-red-400">{error || ""}</p>
    </div>
));

const BookService = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        altPhone: "",
        brand: "",
        model: "",
        issue: "",
        otherIssue: "",
        address: "",
        location: "",
    });

    const refs = {
        name: useRef(),
        phone: useRef(),
        email: useRef(),
        brand: useRef(),
        model: useRef(),
        issue: useRef(),
        location: useRef(),
        address: useRef(),
    };

    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState("");

    const [isChennai, setIsChennai] = useState(true);
    const [submitError, setSubmitError] = useState("");

    const [errors, setErrors] = useState({});

    const handleUseCurrentLocation = async () => {
        setLocationLoading(true);
        setSubmitError("");

        if (!navigator.geolocation) {
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        "";

                    setFormData((prev) => ({
                        ...prev,
                        location: data.display_name,
                    }));

                    setIsChennai(
                        ["chennai", "tirupattur"].includes(city.toLowerCase())
                    );
                } catch (err) {
                    console.error("Location fetch failed");
                } finally {
                    setLocationLoading(false);
                }
            },
            () => {
                setLocationLoading(false);
            }
        );
    };

    const generateBookingId = async () => {
        const counterRef = doc(db, "counters", "bookingCounter");

        const bookingId = await runTransaction(db, async (transaction) => {
            const counterSnap = await transaction.get(counterRef);

            let nextValue = 1;

            if (counterSnap.exists()) {
                nextValue = counterSnap.data().value + 1;
            }

            transaction.set(counterRef, { value: nextValue }, { merge: true });

            return `BS${String(nextValue).padStart(3, "0")}`;
        });

        return bookingId;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        /* -------------------------------------------------
           1️⃣ BLOCK IF USER NOT LOGGED IN
        -------------------------------------------------- */
        if (!currentUser) {
            setSubmitError("Please login to book a service");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

            return;
        }

        /* -------------------------------------------------
           2️⃣ FORM VALIDATION
        -------------------------------------------------- */
        const newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.brand) newErrors.brand = "Brand is required";
        if (!formData.model) newErrors.model = "Model is required";
        if (!formData.issue) newErrors.issue = "Issue is required";
        if (!formData.location) newErrors.location = "Location is required";
        if (!formData.address) newErrors.address = "Service address is required";

        if (!isChennai) {
            newErrors.location = "Service available only in Chennai & Tirupattur";
        }

        setErrors(newErrors);

        /* -------------------------------------------------
           3️⃣ SCROLL TO FIRST ERROR
        -------------------------------------------------- */
        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey && refs[firstErrorKey]?.current) {
            refs[firstErrorKey].current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            refs[firstErrorKey].current.focus();
            return;
        }

        /* -------------------------------------------------
           4️⃣ FIRESTORE SAVE (OPTION 2 – BS_001)
        -------------------------------------------------- */
        try {
            // 🔢 Generate sequential booking ID
            setSubmitting(true);

            const bookingId = await generateBookingId();

            const bookingData = {
                bookingId,
                uid: currentUser.uid,

                // User details
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                altPhone: formData.altPhone || "",

                // Vehicle & service details
                brand: formData.brand,
                model: formData.model,
                issue: formData.issue,
                otherIssue: formData.otherIssue || "",
                address: formData.address,
                location: formData.location,

                // Status tracking
                status: BOOKING_STATUS.BOOKED,

                createdAt: serverTimestamp(),
            };

            /* -------- 1️⃣ GLOBAL BOOKINGS COLLECTION -------- */
            const bookingRef = await addDoc(
                collection(db, "bookings"),
                bookingData
            );

            /* -------- 2️⃣ USER SUBCOLLECTION -------- */
            await setDoc(
                doc(db, "users", currentUser.uid, "bookings", bookingRef.id),
                {
                    ...bookingData,
                    docId: bookingRef.id,
                }
            );

            console.log("✅ Booking Successful:", bookingId);

            setFormData({
                name: "",
                phone: "",
                email: "",
                altPhone: "",
                brand: "",
                model: "",
                issue: "",
                otherIssue: "",
                address: "",
                location: "",
            });

            setErrors({});
            setSubmitError("");

            /* -------------------------------------------------
               5️⃣ REDIRECT TO SUCCESS PAGE
            -------------------------------------------------- */
            navigate(`/booking-success/${bookingId}`);

        } catch (error) {
            console.error("❌ Booking failed:", error);
            setSubmitError("Something went wrong. Please try again.");
        }
        finally {
            setSubmitting(false);  // ✅ ADD HERE
        }
    };

    return (
        <section className="relative py-24 bg-black text-white overflow-hidden">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAJ3Ai3tu58SWAJ2mK_EhozE-OIgQXcLXNg&s)",
                }}
            />
            <div className="absolute inset-0 bg-black/80" />

            <PageContainer>
                <div className="relative max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-extrabold">
                            Book Your Service
                        </h2>
                        <p className="text-gray-400 mt-4">
                            Quick & hassle-free car service booking in Chennai
                        </p>
                    </div>

                    {/* Form Card */}
                    <form className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 space-y-2 shadow-2xl">

                        <Input
                            ref={refs.name}
                            label="Full Name"
                            name="name"
                            required
                            error={errors.name}
                            onChange={handleChange}
                        />

                        <Input
                            ref={refs.email}
                            label="Email Address"
                            name="email"
                            required
                            error={errors.email}
                            onChange={handleChange}
                        />



                        {/* Phone Numbers */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                ref={refs.phone}
                                label="Phone Number"
                                name="phone"
                                required
                                error={errors.phone}
                                onChange={handleChange}
                            />
                            <Input
                                label="Alternative Phone (Optional)"
                                name="altPhone"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Brand & Model */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Select
                                ref={refs.brand}
                                label="Car Brand"
                                name="brand"
                                required
                                error={errors.brand}
                                onChange={handleChange}
                            >
                                <option value="">Select Brand</option>
                                <option>Honda</option>
                                <option>Hyundai</option>
                                <option>BMW</option>
                                <option>Audi</option>
                            </Select>

                            <Input
                                ref={refs.model}
                                label="Car Model"
                                name="model"
                                required
                                error={errors.model}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Issues */}
                        <Select
                            ref={refs.issue}
                            label="Issue"
                            name="issue"
                            required
                            error={errors.issue}
                            onChange={handleChange}
                        >
                            <option value="">Select Issue</option>
                            <option>Engine Problem</option>
                            <option>Brake Issue</option>
                            <option>Electrical</option>
                            <option>Others</option>
                        </Select>

                        {formData.issue === "Others" && (
                            <Input
                                label="Describe the Issue"
                                name="otherIssue"
                                onChange={handleChange}
                            />
                        )}

                        <div>
                            <div>
                                <label className="block mb-2 text-sm text-gray-400">
                                    Current Location <span className="text-red-400">*</span>
                                </label>

                                <div className="flex gap-4">
                                    <input
                                        ref={refs.location}
                                        type="text"
                                        value={formData.location}
                                        readOnly
                                        className="flex-1 rounded-xl bg-black/60 border px-4 py-3 text-white
      border-white/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        disabled={locationLoading}
                                        className="px-6 rounded-xl font-semibold text-black
      bg-gradient-to-r from-sky-500 to-cyan-400"
                                    >
                                        {locationLoading ? "Fetching..." : "Use Current Location"}
                                    </button>
                                </div>

                                <p className="mt-1 h-4 text-xs text-red-400">
                                    {errors.location || ""}
                                </p>
                            </div>

                        </div>

                        {/* Address */}
                        <Textarea
                            ref={refs.address}
                            label="Service Address"
                            name="address"
                            required
                            error={errors.address}
                            onChange={handleChange}
                        />
                        {submitError && (
                            <p className="text-red-400 text-sm text-center">{submitError}</p>
                        )}

                        {/* submit button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!currentUser || submitting}

                            className="w-full py-4 rounded-full font-semibold text-black
  bg-gradient-to-r from-sky-500 to-cyan-400
  hover:scale-105 transition-all duration-300
  shadow-lg shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Booking..." : "Book Service →"}
                        </button>
                    </form>
                </div>
            </PageContainer>
        </section>
    );
};

export default BookService;