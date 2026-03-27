import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Boxes,
  Users,
  Receipt,
  ClipboardList,
  BarChart3,
  X,
  ChevronDown,
  ChevronLeft,
  Home,
  CalendarCheck,
  Activity,
  Package,
  Wrench,
  UserCog,
  PackageSearch,
} from "lucide-react";

import { useAuth } from "../PrivateRouter/AuthContext";

/* ================= NAV ITEMS ================= */
const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },

  {
    label: "Products",
    icon: Package,
    children: [
      { path: "/admin/allProducts", label: "Products", icon: Dumbbell },
      { path: "/admin/plansall", label: "Membership Plans", icon: ClipboardList },
      { path: "/admin/fecilities", label: "Facilities", icon: Activity },
      { path: "/admin/stockdetails", label: "Supplements Stock", icon: Boxes },
    ],
  },

  { path: "/admin/serviceslist", label: "Services Price List", icon: CalendarCheck },


  /* ===== Services & Bookings ===== */
  { path: "/admin/services", label: "Services", icon: Wrench },
  { path: "/admin/bookings", label: "Booking Service", icon: CalendarCheck },
  { path: "/admin/carservies", label: "Car Services", icon: CalendarCheck },

  /* ===== Customers & Staff ===== */
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/employees", label: "Employees", icon: UserCog },

  /* ===== Billing & Inventory ===== */
  { path: "/admin/billing", label: "Billings", icon: Receipt },
  { path: "/admin/inventory", label: "Inventory", icon: PackageSearch },

  /* ===== Attendance ===== */
  {
    path: "/admin/overall-attendance",
    label: "Overall Attendance",
    icon: ClipboardList,
  },

  /* ===== Reports ===== */
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },

  { path: "/", label: "Back Home", icon: Home },
];

/* ================= SIDEBAR ================= */
const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  /* ================= ACTIVE ROUTE MAP ================= */
  const activeRouteMap = {
    "/admin/products": ["/admin/products", "/admin/addproducts"],
    "/admin/plansall": ["/admin/plansall", "/admin/addplan"],
    "/admin/fecilities": ["/admin/fecilities", "/admin/addfecilities"],
    "/admin/stockdetails": ["/admin/stockdetails", "/admin/add-stock"],
  };

  /* ================= HELPERS ================= */
  const isRouteActive = (basePath) => {
    const paths = activeRouteMap[basePath];
    if (!paths) return location.pathname === basePath;
    return paths.some((p) => location.pathname.startsWith(p));
  };

  const isChildActive = (children) =>
    children?.some((child) => isRouteActive(child.path));

  /* ===== AUTO OPEN DROPDOWN WHEN CHILD ACTIVE ===== */
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children && isChildActive(item.children)) {
        setOpenMenu(item.label);
      }
    });
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <>
      {/* ========== MOBILE OVERLAY ========== */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* ========== SIDEBAR ========== */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full
        bg-gradient-to-b from-red-950 via-red-900 to-red-950
        text-white border-r border-white/10
        shadow-[0_25px_60px_rgba(0,0,0,0.5)]
        flex flex-col transition-all duration-300
        backdrop-blur-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${collapsed ? "w-20" : "w-64"}
      `}
      >

        {/* ========== LOGO ========== */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-11 h-11 rounded-2xl 
            bg-gradient-to-br from-red-600 via-red-500 to-orange-400
            flex items-center justify-center
            shadow-lg shadow-red-500/40
            shrink-0">
            <img
              src="/images/logomain.png"
              alt="Logo"
              className="w-9 h-9 object-contain drop-shadow-md"
            />
          </div>


          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-semibold text-white">Services Booking</h1>
              <p className="text-xs text-white truncate">
                Welcome {userProfile?.displayName?.split(" ")[0] || "Admin"}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-xl text-gray-500 hover:bg-white/20 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========== NAVIGATION ========== */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;

            /* ===== DROPDOWN ITEM ===== */
            if (item.children) {
              const isMenuOpen = openMenu === item.label;
              const parentActive = isChildActive(item.children);

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                    ${parentActive
                        ? "bg-gray-900 text-white"
                        : "text-white/80 hover:bg-white/20"
                      }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />

                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""
                            }`}
                        />
                      </>
                    )}
                  </button>

                  {/* ===== SUB MENU ===== */}
                  <div
                    className={`ml-10 mt-1 space-y-1 overflow-hidden transition-all duration-300
                    ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon;
                      const isActive = isRouteActive(sub.path);

                      return (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={() => isOpen && onClose()}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                          ${isActive
                              ? "bg-gray-900 text-white"
                              : "text-white hover:bg-white/20"
                            }`}
                        >
                          <SubIcon className="w-4 h-4 shrink-0" />
                          <span>{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            /* ===== NORMAL ITEM ===== */
            const isActive = isRouteActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => isOpen && onClose()}
                className={`flex items-center gap-3 px-4 py-2.5 rounded
                ${isActive
                    ? "bg-gray-900 text-white"
                    : "text-white/80 hover:bg-white/20"
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* ========== COLLAPSE BUTTON ========== */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2
          w-9 h-9 rounded-full
          bg-gradient-to-br from-orange-500 to-red-600
          shadow-xl shadow-orange-500/40
          items-center justify-center
          text-white hover:scale-110 transition-all"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""
              }`}
          />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
