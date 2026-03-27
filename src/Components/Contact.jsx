import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaUser, FaPen } from "react-icons/fa";
import { MdOutlineSubject } from "react-icons/md";
import PageContainer from "./PageContainer";
import SectionHeading from "./SectionHeading";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import PageHeader from "./PageHeader";

const Contact = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="bg-[var(--color-DarkGray)] text-[var(--color-HalfWhite)]">
      <PageHeader title="Contact Us" />

      {/* CONTENT */}
      <PageContainer >
        <div className=" py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT INFO */}
          <div
            className="bg-gray-900 text-white rounded-2xl p-8 space-y-10"
            data-aos="fade-right"
          >
            {/* Phone */}
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-orange500)] text-white">
                <FiPhone size={20} />
              </div>
              <div data-aos="fade-left">
                <h3 className="font-semibold text-center">Phone</h3>
                <p className="text-[var(--color-gray500)]">(786) 555-0122</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-orange500)] text-white">
                <HiOutlineLocationMarker size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-center">Location</h3>
                <p className="text-[var(--color-gray500)]">
                  3517 W. Gray St. Utica, Pennsylvania 57867
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-orange500)] text-white">
                <FiMail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-center">Email</h3>
                <p className="text-[var(--color-gray500)]">info@widoor.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            <p className="text-[var(--color-gray500)] mb-8">
              In a free hour, when our power of choice is untrammelled and when
              nothing prevents our being able to do what we like best.
            </p>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="flex items-center gap-3 bg-[var(--color-DarkGray)] border border-[var(--color-orange500)] rounded-xl px-4  focus-within:border-[var(--color-orange500)]"
              >
                <FaUser className="text-[var(--color-orange500)]" />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-transparent py-4 outline-none text-[var(--color-HalfWhite)] placeholder:text-[var(--color-gray500)]"
                />
              </div>

              {/* Email */}
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="flex items-center gap-3 bg-[var(--color-DarkGray)] border border-[var(--color-orange500)] rounded-xl px-4  focus-within:border-[var(--color-orange500)]"
              >
                <FiMail className="text-[var(--color-orange500)]" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent py-4 outline-none text-[var(--color-HalfWhite)] placeholder:text-[var(--color-gray500)]"
                />
              </div>

              {/* Phone */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="flex items-center gap-3 bg-[var(--color-DarkGray)] border border-[var(--color-orange500)] rounded-xl px-4  focus-within:border-[var(--color-orange500)]"
              >
                <FiPhone className="text-[var(--color-orange500)]" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full bg-transparent py-4 outline-none text-[var(--color-HalfWhite)] placeholder:text-[var(--color-gray500)]"
                />
              </div>

              {/* Subject */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex items-center gap-3 bg-[var(--color-DarkGray)] border border-[var(--color-orange500)] rounded-xl px-4  focus-within:border-[var(--color-orange500)]"
              >
                <MdOutlineSubject className="text-[var(--color-orange500)]" />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-transparent py-4 outline-none text-[var(--color-HalfWhite)] placeholder:text-[var(--color-gray500)]"
                />
              </div>

              {/* Message */}
              <div
                data-aos="fade-up"
                data-aos-delay="500"
                className="flex gap-3 bg-[var(--color-DarkGray)] border border-[var(--color-orange500)] rounded-xl px-4 md:col-span-2  focus-within:border-[var(--color-orange500)]"
              >
                <FaPen className="mt-4 text-[var(--color-orange500)]" />
                <textarea
                  rows="5"
                  placeholder="Enter your message"
                  className="w-full bg-transparent py-4 outline-none text-[var(--color-HalfWhite)] placeholder:text-[var(--color-gray500)] resize-none"
                ></textarea>
              </div>

              <button
                data-aos="fade-up"
                data-aos-delay="600"
                type="submit"
                className="bg-[var(--color-orange500)] hover:bg-[var(--color-orange600)] transition text-white px-10 py-3 rounded-full md:col-span-2 w-fit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* MAP */}
        <div className=" pb-16" data-aos="fade-up">
          <iframe
            className="w-full h-[400px] rounded-2xl"
            src="https://www.google.com/maps?q=London%20Eye&output=embed"
            loading="lazy"
            title="map"
          ></iframe>
        </div>
      </PageContainer>
    </div>
  );
};

export default Contact;
