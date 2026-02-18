const PersonalInfo = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-sky-400">
        Personal Information
      </h2>

      <div className="space-y-4">
        <input
          placeholder="First Name"
          className="w-full p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Last Name"
          className="w-full p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <input
          placeholder="Phone"
          className="w-full p-3 rounded-lg bg-black border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
        />

        <button className="mt-4 px-6 py-3 rounded-lg font-semibold bg-sky-500 text-black hover:bg-sky-400 transition">
          Update Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;