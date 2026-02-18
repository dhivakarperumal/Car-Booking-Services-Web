const MyOrders = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-sky-400">
        My Orders
      </h2>

      <div className="bg-black border border-slate-700 rounded-xl p-4">
        <p className="text-slate-400">
          No orders found.
        </p>
      </div>
    </div>
  );
};

export default MyOrders;