import StatusTracker from "./StatusTracker";

const BookingModal = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#020617] border border-sky-500
                      rounded-2xl max-w-3xl w-full p-6 relative border border-sky-400">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-sky-400 mb-4">
          Booking ID: {booking.bookingId}
        </h3>

       

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-sm text-gray-300">
          <p><span className="text-sky-400">Name:</span> {booking.name}</p>
          <p><span className="text-sky-400">Phone:</span> {booking.phone}</p>
          <p><span className="text-sky-400">Brand:</span> {booking.brand}</p>
          <p><span className="text-sky-400">Model:</span> {booking.model}</p>
          <p className="md:col-span-2">
            <span className="text-sky-400">Issue:</span> {booking.issue}
          </p>
          <p className="md:col-span-2">
            <span className="text-sky-400">Address:</span> {booking.address}
          </p>
        </div>

         {/* STATUS TRACKER */}
        {booking.status !== "CANCELLED" ? (
          <StatusTracker currentStatus={booking.status} />
        ) : (
          <p className="text-red-400 font-semibold text-center mt-6">
            ❌ Booking Cancelled
          </p>
        )}

      </div>
    </div>
  );
};

export default BookingModal;