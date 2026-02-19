import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubscribe;

    const fetchMyOrders = async (user) => {
      try {
        const q = query(
          collection(db, "orders"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ NOW it's safe to use
        console.log("Orders fetched:", ordersData);

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyOrders(user);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  if (loading) {
    return (
      <p className="text-slate-400">Loading orders...</p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-sky-400">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="bg-black border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-black border border-slate-700 rounded-xl p-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold">
                  Order ID: {order.orderId}
                </p>
                <span className="text-xs px-3 py-1 rounded-full bg-sky-900 text-sky-300">
                  {order.paymentStatus}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-2">
                Placed on:{" "}
                {order.createdAt?.toDate().toLocaleString()}
              </p>

              {/* Items */}
              <div className="divide-y divide-slate-700">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="py-3 flex gap-4 items-center"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.name}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>

                    <p className="text-sky-400 font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                <p className="text-slate-300">
                  Status:{" "}
                  <span className="text-sky-400">
                    {order.status}
                  </span>
                </p>
                <p className="text-white font-bold">
                  Total: ₹{order.total}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;