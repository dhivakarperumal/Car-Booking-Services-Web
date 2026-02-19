import { useState } from "react";
import PersonalInfo from "./PersonalInfo";
import PageHeader from "./PageHeader";
import MyOrders from "./MyOrders";
import ManageAddress from "./ManageAddress";
import ServiceStatus from "./ServiceStatus";

const Account = () => {
  const [activeTab, setActiveTab] = useState("servicestatus");
  const titleMap = {
  personal: "Personal Information",
  orders: "My Orders",
  address: "Manage Address",
};

  const renderComponent = () => {
    switch (activeTab) {
      case "servicestatus":
        return <ServiceStatus />;
      case "personal":
        return <PersonalInfo />;
      case "orders":
        return <MyOrders />;
      case "address":
        return <ManageAddress />;
      default:
        return <ServiceStatus />;
    }
  };

  return (
    <>
    <PageHeader title={titleMap[activeTab]} />
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="bg-slate-900 rounded-2xl p-4 space-y-3 border border-sky-400">
           <button
            onClick={() => setActiveTab("servicestatus")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition
              ${activeTab === "servicestatus"
                ? "bg-sky-500 text-black"
                : "bg-slate-800 hover:bg-slate-700"}`}
          >
            Service Status
          </button>
          <button
            onClick={() => setActiveTab("personal")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition
              ${activeTab === "personal"
                ? "bg-sky-500 text-black"
                : "bg-slate-800 hover:bg-slate-700"}`}
          >
            Personal Info
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition
              ${activeTab === "orders"
                ? "bg-sky-500 text-black"
                : "bg-slate-800 hover:bg-slate-700"}`}
          >
            My Orders
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition
              ${activeTab === "address"
                ? "bg-sky-500 text-black"
                : "bg-slate-800 hover:bg-slate-700"}`}
          >
            Manage Address
          </button>
        </div>

        {/* ===== RIGHT CONTENT ===== */}
        <div className="md:col-span-3 bg-slate-900 rounded-2xl p-6 border border-sky-400">
          {renderComponent()}
        </div>

      </div>
    </div>
    </>
  );
};

export default Account;