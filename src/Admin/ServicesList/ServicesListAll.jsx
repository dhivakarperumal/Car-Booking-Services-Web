import { useEffect, useState, useMemo } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import {
  Trash2,
  Pencil,
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesListAll = () => {
  const [services, setServices] = useState([]);
  const [view, setView] = useState("card");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let q;

    try {
      q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    } catch {
      // fallback if createdAt missing
      q = query(collection(db, "services"));
    }

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));
        setServices(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        toast.error("Failed to load services");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteDoc(doc(db, "services", id));
      toast.success("Service deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ================= CATEGORY LIST ================= */
  const categories = useMemo(() => {
    const cats = services
      .map((s) => s.category?.trim())
      .filter(Boolean);

    return ["all", ...new Set(cats)];
  }, [services]);

  /* ================= FILTER ================= */
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const name = srv.name?.toLowerCase() || "";
      const cat = srv.category?.toLowerCase() || "";

      const matchSearch =
        name.includes(search.toLowerCase()) ||
        cat.includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "all" ||
        srv.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [services, search, categoryFilter]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading services...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pb-5">
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-bold">Car Service List</h2>

          <div className="flex flex-wrap items-center gap-2 justify-end">

            {/* SEARCH */}
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 border rounded-lg text-sm w-44 sm:w-56"
              />
            </div>

          

            {/* VIEW TOGGLE */}
            <button
              onClick={() => setView("card")}
              className={`p-2 rounded-lg border ${
                view === "card" ? "bg-black text-white" : "bg-white"
              }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setView("table")}
              className={`p-2 rounded-lg border ${
                view === "table" ? "bg-black text-white" : "bg-white"
              }`}
            >
              <List size={18} />
            </button>

            {/* ADD BUTTON */}
            <button
              onClick={() => navigate("/admin/addservices")}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* ================= CARD VIEW ================= */}
        {view === "card" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
            {filteredServices.map((srv) => (
              <div
                key={srv.docId}
                className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                {srv.image && (
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="font-semibold text-sm">{srv.name}</h3>
                

                <p className="text-sm font-medium mt-1">
                  ₹{Number(srv.price || 0).toLocaleString()}
                </p>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/addservices/${srv.docId}`)
                    }
                    className="border border-gray-300 p-2 rounded-full text-blue-600 hover:scale-110 transition"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(srv.docId)}
                    className="border border-gray-300 p-2 rounded-full text-red-500 hover:scale-110 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-10">
                No services found
              </p>
            )}
          </div>
        )}

        {/* ================= TABLE VIEW ================= */}
        {view === "table" && (
          <div className="overflow-x-auto border border-gray-300 rounded-xl mt-10">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">S No</th>
                  <th className="p-3">Name</th>
                  
                  <th className="p-3">Price</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((srv,i) => (
                  <tr key={srv.docId} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="p-3 font-medium">{i+1}</td>
                    <td className="p-3 font-medium">{srv.name}</td>
                    
                    <td className="p-3">
                      ₹{Number(srv.price || 0).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/addservices/${srv.docId}`)
                          }
                          className="text-blue-600 hover:scale-110 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(srv.docId)}
                          className="text-red-500 hover:scale-110 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No services found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesListAll;
