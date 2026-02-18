import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import { useAuth } from "../PrivateRouter/AuthContext";
import toast from "react-hot-toast";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/services": "Services",
  "/admin/bookings": "Bookings Service",
  "/admin/carservies": "Car Services",
  "/admin/addcarservies": "Add Car Services",
  "/admin/addserviceparts": "Add Service Parts",
  "/admin/employees": "Employees",
  "/admin/addstaff": "Add Employees",
  "/admin/customers": "Customers",
  "/admin/billing": "Billing",
  "/admin/addbillings": "Add Billing",
  "/admin/inventory": "Inventory",
  "/admin/additemsinventory": "Add Inventory",
  "/admin/overall-attendance": "Overall Attendance",
 
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
  "/admin/users": "Users",
};

const Header = ({ onMenuClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const { profileName, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const getPageTitle = () => {
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(path + "/")) return title;
    }
    return "Dashboard";
  };

  // 🔐 Firebase Logout
const handleLogout = async () => {
  try {
    await logout(); // ✅ from AuthContext
    toast.success("Logged out successfully");
    navigate("/login");
  } catch (err) {
    toast.error("Logout failed");
    console.error(err);
  }
};



  return (
    <header className="sticky top-0 z-30 shadow-[0_10px_10px_rgba(0,0,0,0.18)] bg-white">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Search */}
         <div className="relative">
  {/* SEARCH POPUP */}
  {showSearch && (
    <>
      {/* Overlay */}
      <div
        onClick={() => setShowSearch(false)}
        className="fixed inset-0 z-40"
      />

      <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-10 top-[4.5rem] sm:top-1/2 sm:-translate-y-1/2 
                      bg-white border border-slate-200 rounded-2xl shadow-xl 
                      flex items-center z-50 w-auto sm:w-80 animate-fadeIn">
        {/* Input */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search patients, doctors, bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setShowSearch(false)}
          autoFocus
          className="flex-1 px-4 py-3 text-sm outline-none placeholder-slate-400"
        />

        {/* Close */}
        <button
          onClick={() => {
            setShowSearch(false);
            setSearchTerm("");
          }}
          className="p-3 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  )}

  {/* SEARCH BUTTON */}
  <button
    onClick={() => setShowSearch((p) => !p)}
    className={`p-2 rounded-sm transition-all duration-200
      ${
        showSearch
          ? "text-sky-600 bg-sky-50"
          : "text-slate-500 hover:bg-slate-100"
      }`}
  >
    <Search className="w-5 h-5" />
  </button>
</div>


          {/* Notifications */}
<div className="relative">
  {/* Bell Button */}
  <button
    onClick={() => setShowNotifications((p) => !p)}
    className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-all duration-200"
  >
    <Bell className="w-5 h-5" />

    {/* Unread Dot */}
    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
  </button>

  {showNotifications && (
    <>
      {/* Overlay */}
      <div
        onClick={() => setShowNotifications(false)}
        className="fixed inset-0 z-40"
      />

      {/* Dropdown */}
      <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-fadeIn overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            Notifications
          </h3>
          <span className="text-xs text-slate-400">
            0 New
          </span>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
          <Bell className="w-10 h-10 text-slate-300" />
          <p className="text-sm text-slate-500 font-medium">
            You're all caught up
          </p>
          <p className="text-xs text-slate-400">
            No new notifications right now
          </p>
        </div>
      </div>
    </>
  )}
</div>


          {/* User */}
         <div className="relative">
  {/* PROFILE BUTTON */}
  <button
    onClick={() => setShowDropdown((p) => !p)}
    className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200"
  >
    {/* Avatar */}
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-600 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden shadow-sm">
      {profileName?.photoURL ? (
        <img
          src={profileName.photoURL}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        profileName?.displayName?.[0]?.toUpperCase() || "A"
      )}
    </div>

    {/* Name & Role */}
    <div className="hidden sm:block text-left leading-tight">
      <p className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">
        {profileName?.displayName || "Admin"}
      </p>
      <p className="text-xs text-slate-500">
        {profileName?.role || "Administrator"}
      </p>
    </div>

    {/* Arrow */}
    <ChevronDown
      className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-200 ${
        showDropdown ? "rotate-180" : ""
      }`}
    />
  </button>

  {/* OVERLAY */}
  {showDropdown && (
    <>
      <div
        onClick={() => setShowDropdown(false)}
        className="fixed inset-0 z-40"
      />

      {/* DROPDOWN */}
      <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1 animate-fadeIn">
        {/* User Info */}
        <div className="px-3 py-2 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-800">
            {profileName?.displayName || "Admin"}
          </p>
          <p className="text-xs text-slate-500">
            {profileName?.email || "admin@clinic.com"}
          </p>
        </div>

        {/* Menu */}
        <Link
          to="/admin/settings/profile"
          onClick={() => setShowDropdown(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-slate-700 transition"
        >
          <User className="w-4 h-4" />
          Profile
        </Link>

        <Link
          to="/admin/settings"
          onClick={() => setShowDropdown(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-slate-700 transition"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        <hr className="my-1 border-slate-100" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 w-full transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  )}
</div>

        </div>
      </div>
    </header>
  );
};

export default Header;
