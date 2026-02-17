import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-7xl font-extrabold text-orange-500 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <NavLink
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-orange600 px-6 py-3 text-white font-semibold hover:bg-orange500 transition"
        >
          <FaArrowLeft />
          Back to Home
        </NavLink>
      </div>
    </section>
  );
};

export default NotFound;