import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  Users,
  Receipt,
  Boxes,
  UserCog,
  HeartPulse,
  BarChart3,
  Settings,
  ClipboardList,
  PackageSearch,
  X, ChevronLeft,
  Home 
} from "lucide-react";

import { useAuth } from "../PrivateRouter/AuthContext";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },

  // Services & Bookings
  { path: "/admin/services", label: "Services", icon: Wrench },
  { path: "/admin/bookings", label: "Booking Service", icon: CalendarCheck },
  { path: "/admin/carservies", label: "CarServices", icon: CalendarCheck },

  // Customers & Staff
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/employees", label: "Employees", icon: UserCog },

  // Billing & Inventory
  { path: "/admin/billing", label: "Billings", icon: Receipt },
  { path: "/admin/inventory", label: "Inventory", icon: PackageSearch },

  // Equipment & Attendance
  // { path: "/admin/equipment", label: "Equipment", icon: Boxes },
  { path: "/admin/overall-attendance", label: "Overall Attendance", icon: ClipboardList },

  // Reports & Settings
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
  // { path: "/admin/settings", label: "Settings", icon: Settings },
  { path: "/", label: "Back Home", icon: Home },
];

const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { profileName } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-gray-900 text-white z-40 transition-opacity lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-black border-r border-slate-200
          flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 ">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white  flex items-center justify-center shrink-0">
            <img
              src="/images/logobg.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>


          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="text-orange-500">Car</span> Care Service
              </h1>
              <p className="text-xs text-slate-400 truncate">
                Welcome back, {profileName?.displayName?.split(" ")[0] || "Admin"} 
              </p>
            </div>
          )}


          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-white hover:bg-orange-600 hover:text-white"
                  }
                `
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Button (Desktop) */}
        <button
          onClick={onToggleCollapse}
          className="
    hidden lg:flex
    absolute -right-3 top-1/2 -translate-y-1/2
    w-7 h-7 rounded-full
    bg-white border border-slate-200
    shadow-md
    items-center justify-center
    text-slate-500
    hover:bg-slate-100 hover:text-slate-700
    transition-all duration-200
  "
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""
              }`}
          />
        </button>

      </aside>
    </>
  );
};

export default Sidebar;
