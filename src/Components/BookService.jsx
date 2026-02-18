import React, { useState } from "react";
import PageContainer from "./PageContainer";

const Input = ({ label, ...props }) => (
    <div>
        <label className="block mb-2 text-sm text-gray-400">{label}</label>
        <input
            {...props}
            className="w-full rounded-xl bg-black/60 border border-white/10
      px-4 py-3 text-white focus:outline-none
      focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block mb-2 text-sm text-gray-400">{label}</label>
        <textarea
            {...props}
            rows="4"
            className="w-full rounded-xl bg-black/60 border border-white/10
      px-4 py-3 text-white focus:outline-none
      focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
    </div>
);

const Select = ({ label, children, ...props }) => (
    <div>
        <label className="block mb-2 text-sm text-gray-400">{label}</label>
        <select
            {...props}
            className="w-full rounded-xl bg-black/60 border border-white/10
      px-4 py-3 text-white focus:outline-none
      focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        >
            {children}
        </select>
    </div>
);

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

    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState("");

    const [isChennai, setIsChennai] = useState(true);
    const [submitError, setSubmitError] = useState("");

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

                    // ✅ Always store address
                    setFormData((prev) => ({
                        ...prev,
                        location: data.display_name,
                    }));

                    // ✅ Just mark Chennai or not (no error here)
                    setIsChennai(city.toLowerCase() === "chennai");
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email) {
            setSubmitError("Please enter your email address");
            return;
        }

        // ❌ Chennai validation ONLY on submit
        if (!isChennai) {
            setSubmitError("Sorry, currently our service is available only in Chennai.");
            return;
        }

        setSubmitError("");

        // ✅ Proceed with booking (Firebase / API)
        console.log("Booking Data:", formData);
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
                    <form className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 space-y-8 shadow-2xl">

                        {/* Name */}
                        <Input label="Full Name" name="name" onChange={handleChange} />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            onChange={handleChange}
                        />

                        {/* Phone Numbers */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Phone Number" name="phone" onChange={handleChange} />
                            <Input
                                label="Alternative Phone (Optional)"
                                name="altPhone"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Brand & Model */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Select label="Car Brand" name="brand" onChange={handleChange}>
                                <option value="">Select Brand</option>
                                <option>Honda</option>
                                <option>Hyundai</option>
                                <option>BMW</option>
                                <option>Audi</option>
                            </Select>

                            <Input label="Car Model" name="model" onChange={handleChange} />
                        </div>

                        {/* Issues */}
                        <Select label="Issue" name="issue" onChange={handleChange}>
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
                            <label className="block mb-2 text-sm text-gray-400">
                                Current Location
                            </label>

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={formData.location}
                                    readOnly
                                    placeholder="Click to fetch your current address"
                                    className="flex-1 rounded-xl bg-black/60 border border-white/10
      px-4 py-3 text-white"
                                />

                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    disabled={locationLoading}
                                    className="px-6 rounded-xl font-semibold text-black
      bg-gradient-to-r from-sky-500 to-cyan-400
      hover:scale-105 transition-all duration-300
      disabled:opacity-50"
                                >
                                    {locationLoading ? "Fetching..." : "Use Current Location"}
                                </button>
                            </div>
                        </div>

                        {/* Address */}
                        <Textarea
                            label="Service Address"
                            name="address"
                            onChange={handleChange}
                        />

                        {submitError && (
                            <p className="text-red-400 text-sm text-center">{submitError}</p>
                        )}

                        {/* submit button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full py-4 rounded-full font-semibold text-black
  bg-gradient-to-r from-sky-500 to-cyan-400
  hover:scale-105 transition-all duration-300
  shadow-lg shadow-sky-500/40"
                        >
                            Book Service →
                        </button>
                    </form>
                </div>
            </PageContainer>
        </section>
    );
};

export default BookService;