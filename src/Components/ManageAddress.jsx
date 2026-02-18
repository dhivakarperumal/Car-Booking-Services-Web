const ManageAddress = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-sky-400">
        Manage Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Full Name"
          className="p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Phone Number"
          className="p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Email"
          className="p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Street"
          className="p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="City"
          className="p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Pin Code"
          className="p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button className="px-6 py-3 rounded-lg font-semibold bg-sky-500 text-black hover:bg-sky-400 transition">
          Add Address
        </button>
        <button className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ManageAddress;