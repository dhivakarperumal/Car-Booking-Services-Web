import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* =======================
     FETCH SERVICES
  ======================= */
  const fetchServices = async () => {
    try {
      const snap = await getDocs(collection(db, "carServices"));
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* =======================
     STATUS CHANGE
  ======================= */
  const handleStatusChange = async (s, newStatus) => {
    try {
      await updateDoc(doc(db, "carServices", s.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      toast.success("Status updated");
      fetchServices();
    } catch {
      toast.error("Status update failed");
    }
  };

  /* =======================
     DELETE
  ======================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteDoc(doc(db, "carServices", id));
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =======================
     FILTER + SEARCH
  ======================= */
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const text = `${s.carServiceId} ${s.customerName} ${s.carNumber} ${s.mechanic}`
        .toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (statusFilter === "all" || s.status === statusFilter)
      );
    });
  }, [services, search, statusFilter]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold"></h2>
        <div className="flex gap-3">
          {/* <button
            onClick={() => navigate("/admin/addservicestype")}
            className="bg-black text-white px-5 py-3 hover:bg-orange-500 font-bold transition-all duration-2s  rounded-lg"
          >
            + Add Service Types
          </button> */}

          <button
            onClick={() => navigate("/admin/addserviceparts")}
            className="bg-black text-white px-5 py-3 hover:bg-orange-500 font-bold transition-all duration-2s rounded-lg"
          >
            + Add Service parts
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search service customer car"
            className="
    w-full
    rounded-lg
    border border-gray-200
    pl-10 px-4 py-3
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-900/40
    focus:border-gray-500
    transition
    bg-white
  "
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="
    rounded-lg
    border border-gray-200
    pl-10 px-4 py-3
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-gray-900/40
    focus:border-gray-500
    transition
    bg-white "
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Waiting for Parts">Waiting for Parts</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4 text-left">S No</th>
                <th className="px-4 py-4 text-left">Service ID</th>
                <th className="px-4 py-4 text-left">Customer</th>
                <th className="px-4 py-4 text-left">Car No</th>
                <th className="px-4 py-4 text-left">Mechanic</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Cost (₹)</th>
                <th className="px-4 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedServices.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-300">
                  <td className="px-3 py-3">{i + 1}</td>
                  <td className="px-3 py-3 font-semibold">
                    {s.carServiceId}
                  </td>
                  <td className="px-3 py-3">{s.customerName}</td>
                  <td className="px-3 py-3">{s.carNumber}</td>
                  <td className="px-3 py-3">{s.mechanic}</td>

                  <td className="px-3 py-3">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange(s, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Parts">
                        Waiting for Parts
                      </option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  <td className="px-3 py-3">₹{s.estimatedCost || 0}</td>

                  <td className="px-3 py-3 flex gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() => navigate(`/admin/services/${s.id}`)}
                      className="bg-blue-600 text-white p-2 rounded-lg"
                      title="View Service"
                    >
                      <FaEye />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => navigate(`/admin/addservices/${s.id}`)}
                      className="bg-green-600 text-white p-2 rounded-lg"
                      title="Edit Service"
                    >
                      <FaEdit />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-600 text-white p-2 rounded-lg"
                      title="Delete Service"
                    >
                      <FaTrash />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredServices.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500"
                  >
                    No services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-4">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : ""
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;

