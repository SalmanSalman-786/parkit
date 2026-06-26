import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import Modal from "../components/ui/Modal";
import { Search, Phone, UserCheck, Shield, MapPin, Clock, Edit2, Plus } from "lucide-react";

export default function Guards() {
  const [guards, setGuards] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [parkings, setParkings] = useState([]);
  const [editingGuard, setEditingGuard] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    username: "",
    password: "",
    assignedParkingId: "",
    assignedParkingName: "",
  });

  useEffect(() => {
    loadGuards();
    loadParkings();
  }, []);

  const createGuard = async () => {
    try {
      await api.post("/auth/guard/register", form, {
        headers: {
          "admin-key": "SUPER_SECRET_123",
        },
      });
      setShowModal(false);
      loadGuards();
      setForm({
        name: "",
        phoneNumber: "",
        username: "",
        password: "",
        assignedParkingId: "",
        assignedParkingName: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create guard");
    }
  };

  const loadGuards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/guards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGuards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadParkings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/parking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParkings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGuards = guards.filter(
    (guard) =>
      (guard.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (guard.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const openEditGuard = (guard) => {
    setEditingGuard(guard);
    setForm({
      name: guard.name || "",
      phoneNumber: guard.phoneNumber || "",
      username: guard.username || "",
      password: "",
      assignedParkingId: guard.assignedParkingId || "",
      assignedParkingName: guard.assignedParkingName || "",
    });
    setShowModal(true);
  };

  const updateGuard = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/admin/guards/${editingGuard.id}`,
        {
          name: form.name,
          phoneNumber: form.phoneNumber,
          assignedParkingId: form.assignedParkingId,
          assignedParkingName: form.assignedParkingName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      setEditingGuard(null);
      loadGuards();
    } catch (err) {
      console.error(err);
      alert("Failed to update guard");
    }
  };

  const handleParkingChange = (e) => {
    const pId = e.target.value;
    const pObj = parkings.find((p) => p.id === pId);
    setForm({
      ...form,
      assignedParkingId: pId,
      assignedParkingName: pObj ? pObj.name : "",
    });
  };

  // Helper to generate shifts and online status deterministically based on guard name / id length
  const getGuardShift = (guardId) => {
    const len = guardId ? guardId.length : 10;
    return len % 2 === 0 ? "Day Shift (8 AM - 4 PM)" : "Night Shift (4 PM - 12 AM)";
  };

  const getGuardStatus = (guardId) => {
    const len = guardId ? guardId.length : 10;
    return len % 3 !== 0 ? "Active" : "Offline";
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">Guards Management</h1>
          <p className="text-slate-400 text-sm mt-1">Register and deploy security personnel to parking lots</p>
        </div>
        <button
          onClick={() => {
            setEditingGuard(null);
            setForm({
              name: "",
              phoneNumber: "",
              username: "",
              password: "",
              assignedParkingId: "",
              assignedParkingName: "",
            });
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={16} />
          <span>Register Guard</span>
        </button>
      </div>

      {/* Search Filter Widget */}
      <div className="relative max-w-lg mb-8">
        <input
          type="text"
          placeholder="Search by guard name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-905 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-sm placeholder-slate-500 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-slate-505" size={16} />
      </div>

      {/* Grid of Guard Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuards.length > 0 ? (
          filteredGuards.map((guard) => {
            const shiftInfo = getGuardShift(guard.id);
            const status = getGuardStatus(guard.id);
            const isActive = status === "Active";

            return (
              <div
                key={guard.id}
                className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-755/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Profile & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                        {guard.name ? guard.name.charAt(0).toUpperCase() : "G"}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-105 group-hover:text-white transition-colors">
                          {guard.name}
                        </h3>
                        <span className="text-[10px] text-slate-505 font-semibold font-mono block">@{guard.username}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-slate-500"}`} />
                      {status}
                    </span>
                  </div>

                  <div className="h-px bg-slate-850/60 my-4" />

                  {/* Deploy Assignment Details */}
                  <div className="space-y-3.5 text-xs text-slate-350">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-505 shrink-0" />
                      <span className="font-mono text-slate-205">{guard.phoneNumber || "No contact info"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-cyan-400 shrink-0" />
                      <span className="truncate">
                        {guard.assignedParkingName ? (
                          <span className="text-slate-200 font-semibold">{guard.assignedParkingName}</span>
                        ) : (
                          <span className="text-red-400 font-medium">Unassigned / Standby</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-purple-400 shrink-0" />
                      <span>{shiftInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button Quick Action */}
                <button
                  onClick={() => openEditGuard(guard)}
                  className="w-full mt-6 py-2.5 bg-slate-955 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Edit2 size={12} />
                  <span>Assign & Configure</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">
            No deployment records matching query
          </div>
        )}
      </div>

      {/* Registration/Edit Dialog Overlay */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingGuard ? "Edit Deployment Record" : "Register New Security Guard"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-955 border border-slate-805 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-xs"
            />
          </div>

          {!editingGuard && (
            <>
              <div>
                <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block mb-1.5">
                  Login Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block mb-1.5">
                  Secure Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-805 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-xs"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block mb-1.5">
              Deploy Assigned Location
            </label>
            <select
              value={form.assignedParkingId}
              onChange={handleParkingChange}
              className="w-full px-3 py-2.5 bg-slate-955 border border-slate-805 focus:border-slate-700 focus:outline-none rounded-xl text-slate-300 text-xs cursor-pointer"
            >
              <option value="">Standby (No Lot Assignment)</option>
              {parkings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-805/85 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-355 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={editingGuard ? updateGuard : createGuard}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/10"
            >
              Save Record
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
