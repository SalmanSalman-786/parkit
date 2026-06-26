import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { MapPin, Bike, Car, ArrowLeft, Trash2, Edit3, Grid, Layers, User, Calendar, CreditCard, Clock } from "lucide-react";
import Drawer from "../components/ui/Drawer";

export default function ParkingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parking, setParking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("cars"); // "cars" or "bikes"
  
  // Drawer state for slot detail view
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadParking();
    loadBookings();
  }, [id]);

  const loadParking = async () => {
    try {
      const res = await api.get(`/parking/${id}`);
      setParking(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteParking = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parking location?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/parking/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Parking deleted successfully");
      navigate("/parkings");
    } catch (err) {
      console.error(err);
      alert("Failed to delete parking");
    }
  };

  if (!parking) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  // Filter bookings that are currently ACTIVE inside this parking lot
  const activeLotBookings = bookings.filter(
    (b) => b.parkingId === id && b.status === "ACTIVE"
  );

  const activeCars = activeLotBookings.filter((b) => b.vehicleType === "CAR");
  const activeBikes = activeLotBookings.filter((b) => b.vehicleType === "BIKE");

  // Grid Builder helpers
  const generateSlots = (type) => {
    const capacity = type === "cars" ? parking.fourWheelerCapacity : parking.twoWheelerCapacity;
    const activeList = type === "cars" ? activeCars : activeBikes;

    return Array.from({ length: capacity }).map((_, index) => {
      const slotLabel = `Slot ${index + 1}`;
      
      // Determine if occupied, reserved, or available
      // 1. Occupied: map to active bookings sequentially
      if (index < activeList.length) {
        return {
          id: index,
          label: slotLabel,
          status: "OCCUPIED",
          vehicle: activeList[index],
        };
      }
      
      // 2. Reserved: simulate a few reserved slots (e.g. index 7 & 12, or about 8% of capacity)
      const isReserved = (index + 3) % 9 === 0;
      if (isReserved) {
        return {
          id: index,
          label: slotLabel,
          status: "RESERVED",
          vehicle: null,
        };
      }

      // 3. Available
      return {
        id: index,
        label: slotLabel,
        status: "AVAILABLE",
        vehicle: null,
      };
    });
  };

  const carSlots = generateSlots("cars");
  const bikeSlots = generateSlots("bikes");
  const currentSlots = activeTab === "cars" ? carSlots : bikeSlots;

  const handleSlotClick = (slot) => {
    if (slot.status === "OCCUPIED") {
      // Determine deterministic floor
      const num = (slot.vehicle.bookingId) ? parseInt(slot.vehicle.bookingId.replace(/\D/g, "")) || 42 : 12;
      const floor = (num % 3) + 1;
      
      setSelectedSlot({
        ...slot,
        floorNumber: floor,
        parkingSlot: `S-${slot.id + 1}`,
      });
      setIsDrawerOpen(true);
    } else if (slot.status === "RESERVED") {
      alert("This slot is reserved for VIP/Booked reservation.");
    } else {
      alert("This slot is currently empty and available.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <AdminLayout>
      {/* Back button and title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/parkings")}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-405 hover:text-white rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Parking Details</span>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {parking.name}
          </h1>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              parking.active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            {parking.active ? "Active Lot" : "Inactive"}
          </span>
          <h2 className="text-2xl font-black text-white mt-3 flex items-center gap-2">
            {parking.name}
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1.5">
            <MapPin size={14} className="text-blue-400" />
            <span>{parking.location}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/parkings/edit/${parking.id}`)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Edit Lot</span>
          </button>
          <button
            onClick={deleteParking}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-300 font-bold text-xs rounded-xl border border-red-900/50 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Lot</span>
          </button>
        </div>
      </div>

      {/* Lot Occupancy summary */}
      <div className={`grid grid-cols-1 ${parking.twoWheelerCapacity > 0 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6 mb-8`}>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Car Space Availability</div>
          <h3 className="text-3xl font-extrabold text-white mt-2">{parking.fourWheelerAvailable}</h3>
          <p className="text-xs text-slate-400 mt-2">
            out of <span className="font-semibold text-slate-202">{parking.fourWheelerCapacity}</span> slots free
          </p>
        </div>

        {parking.twoWheelerCapacity > 0 && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bike Space Availability</div>
            <h3 className="text-3xl font-extrabold text-white mt-2">{parking.twoWheelerAvailable}</h3>
            <p className="text-xs text-slate-400 mt-2">
              out of <span className="font-semibold text-slate-202">{parking.twoWheelerCapacity}</span> slots free
            </p>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hourly Tariff Rate</div>
          <h3 className="text-3xl font-extrabold text-cyan-400 mt-2">₹{parking.carHourlyRate}/hr</h3>
          {parking.twoWheelerCapacity > 0 ? (
            <p className="text-xs text-slate-400 mt-2">
              Bikes charged at <span className="font-semibold text-slate-202 font-mono">₹{parking.bikeHourlyRate}/hr</span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-2">
              Four-wheeler flat tariff
            </p>
          )}
        </div>
      </div>

      {/* Visual Slot Grid Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-6">
          <div className="flex items-center gap-2">
            <Grid size={18} className="text-blue-400" />
            <h3 className="text-base font-bold text-slate-100">Live Visual Slots Grid</h3>
          </div>
          
          {/* Tabs for Car vs Bike slots */}
          {parking.twoWheelerCapacity > 0 && (
            <div className="flex p-1 bg-slate-950 border border-slate-850 rounded-xl">
              <button
                onClick={() => setActiveTab("cars")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "cars" ? "bg-slate-900 text-cyan-400 shadow" : "text-slate-500 hover:text-slate-350"
                }`}
              >
                <Car size={14} />
                <span>Four Wheelers ({parking.fourWheelerCapacity})</span>
              </button>
              <button
                onClick={() => setActiveTab("bikes")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "bikes" ? "bg-slate-900 text-purple-400 shadow" : "text-slate-500 hover:text-slate-350"
                }`}
              >
                <Bike size={14} />
                <span>Two Wheelers ({parking.twoWheelerCapacity})</span>
              </button>
            </div>
          )}
        </div>

        {/* Legend status indicators */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 mb-6 bg-slate-950/40 p-3 rounded-xl border border-slate-850/60 w-fit">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-green-500/25 border border-green-500/30 inline-block" />
            <span>Available ({currentSlots.filter(s => s.status === "AVAILABLE").length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-red-500/25 border border-red-500/30 inline-block animate-pulse" />
            <span>Occupied ({currentSlots.filter(s => s.status === "OCCUPIED").length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-yellow-500/25 border border-yellow-500/30 inline-block" />
            <span>Reserved ({currentSlots.filter(s => s.status === "RESERVED").length})</span>
          </div>
        </div>

        {/* Slot Grid Wrapper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {currentSlots.map((slot) => {
            const isOccupied = slot.status === "OCCUPIED";
            const isReserved = slot.status === "RESERVED";
            
            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`relative group p-4 rounded-xl text-center border transition-all cursor-pointer ${
                  isOccupied
                    ? "bg-red-500/10 border-red-500/40 hover:bg-red-500/20 text-red-300"
                    : isReserved
                    ? "bg-yellow-500/10 border-yellow-500/40 hover:bg-yellow-500/20 text-yellow-300"
                    : "bg-green-500/10 border-green-500/40 hover:bg-green-500/20 text-green-300"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider">{slot.label}</div>
                <div className="text-xs font-black mt-2 font-mono truncate">
                  {isOccupied ? slot.vehicle.vehicleNumber : isReserved ? "RESERVED" : "EMPTY"}
                </div>
                
                {/* Tooltip for occupied slot details */}
                {isOccupied && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-950 text-slate-202 text-[10px] rounded-xl border border-slate-800 shadow-2xl transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-40 pointer-events-none text-left">
                    <div className="font-bold text-slate-105 mb-1">{slot.vehicle.vehicleNumber}</div>
                    <div className="text-slate-500">Entry: {formatDate(slot.vehicle.entryTime)}</div>
                    <div className="text-cyan-400 font-bold mt-1">Click to view drawer</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lot Configuration Info Details */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
        <h3 className="text-base font-bold text-slate-105 mb-4 flex items-center gap-2">
          <Layers size={16} className="text-blue-400" />
          <span>Lot Configuration</span>
        </h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${parking.twoWheelerCapacity > 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6 text-xs text-slate-300`}>
          <div className="space-y-1">
            <span className="text-slate-500 font-bold">Latitude Coordinate</span>
            <div className="font-mono text-slate-202 font-semibold">{parking.latitude}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-bold">Longitude Coordinate</span>
            <div className="font-mono text-slate-202 font-semibold">{parking.longitude}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-bold">Booking Capacity (Cars)</span>
            <div className="text-slate-202 font-semibold">{parking.bookingCapacityCars} slots</div>
          </div>
          {parking.twoWheelerCapacity > 0 && (
            <div className="space-y-1">
              <span className="text-slate-500 font-bold">Booking Capacity (Bikes)</span>
              <div className="text-slate-202 font-semibold">{parking.bookingCapacityBikes} slots</div>
            </div>
          )}
        </div>
      </div>

      {/* Slot Details Side Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Slot Occupancy Details"
      >
        {selectedSlot && selectedSlot.vehicle && (
          <div className="space-y-6">
            {/* Slot Position */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded-xl text-center border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold block">FLOOR LEVEL</span>
                <span className="text-lg font-black text-cyan-400">Level {selectedSlot.floorNumber}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl text-center border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold block">SLOT LABEL</span>
                <span className="text-lg font-black text-cyan-400">{selectedSlot.parkingSlot}</span>
              </div>
            </div>

            {/* License plate banner */}
            <div className="text-center py-6 px-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-850 shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Parked Vehicle
              </span>
              <span className="text-2xl font-black font-mono tracking-widest text-white">
                {selectedSlot.vehicle.vehicleNumber}
              </span>
            </div>

            {/* Owner contact details */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-blue-400" />
                <span>Contact Information</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">User Contact:</span>
                  <span className="text-slate-202 font-mono font-medium">{selectedSlot.vehicle.phone || "Walk-In Customer"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Booking ID:</span>
                  <span className="text-slate-202 font-mono font-medium">{selectedSlot.vehicle.bookingId}</span>
                </div>
              </div>
            </div>

            {/* Timing timestamps */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-455 tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-purple-400" />
                <span>Timing Records</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Entry Time:</span>
                  <span className="text-slate-202">{formatDate(selectedSlot.vehicle.entryTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Expected Start:</span>
                  <span className="text-slate-202">{formatDate(selectedSlot.vehicle.startTime)}</span>
                </div>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-455 tracking-wider flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-400" />
                <span>Payment Accrual</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Accrued Amount:</span>
                  <span className="text-slate-202 font-bold">₹{selectedSlot.vehicle.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment Mode:</span>
                  <span className="text-slate-202 uppercase font-medium">{selectedSlot.vehicle.paymentMode || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
}
