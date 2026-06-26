import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { Search, MapPin, Plus, Bike, Car, ArrowRight } from "lucide-react";

export default function Parkings() {
  const [parkings, setParkings] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/parking", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParkings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredParkings = parkings.filter(
    (parking) =>
      (parking.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (parking.location || "").toLowerCase().includes(search.toLowerCase())
  );

  // Overall Occupancy Statistics across all locations
  const totalBikesCapacity = parkings.reduce((acc, p) => acc + (p.twoWheelerCapacity || 0), 0);
  const totalBikesAvailable = parkings.reduce((acc, p) => acc + (p.twoWheelerAvailable || 0), 0);
  const totalCarsCapacity = parkings.reduce((acc, p) => acc + (p.fourWheelerCapacity || 0), 0);
  const totalCarsAvailable = parkings.reduce((acc, p) => acc + (p.fourWheelerAvailable || 0), 0);

  const occupiedBikes = Math.max(0, totalBikesCapacity - totalBikesAvailable);
  const occupiedCars = Math.max(0, totalCarsCapacity - totalCarsAvailable);
  
  const bikeOccupancyPercent = totalBikesCapacity ? ((occupiedBikes / totalBikesCapacity) * 100).toFixed(1) : 0;
  const carOccupancyPercent = totalCarsCapacity ? ((occupiedCars / totalCarsCapacity) * 100).toFixed(1) : 0;

  return (
    <AdminLayout>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Parking Locations</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor all parking facilities and slots</p>
        </div>
        <button
          onClick={() => navigate("/parkings/add")}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Location</span>
        </button>
      </div>

      {/* Global Occupancy Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Car Occupancy Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Car size={16} className="text-blue-400" />
              <span>Four-Wheeler Capacity</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{occupiedCars}</span>
              <span className="text-slate-500 text-sm">/ {totalCarsCapacity} occupied</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-455 font-bold mb-1.5">
              <span>Occupancy Load</span>
              <span className="text-blue-400">{carOccupancyPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${carOccupancyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bike Occupancy Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bike size={16} className="text-purple-400" />
              <span>Two-Wheeler Capacity</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{occupiedBikes}</span>
              <span className="text-slate-500 text-sm">/ {totalBikesCapacity} occupied</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-455 font-bold mb-1.5">
              <span>Occupancy Load</span>
              <span className="text-purple-400">{bikeOccupancyPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                style={{ width: `${bikeOccupancyPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search filter widget */}
      <div className="relative max-w-lg mb-8">
        <input
          type="text"
          placeholder="Search by facility name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-905 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-sm placeholder-slate-500 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-slate-555" size={16} />
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParkings.map((parking) => {
          const isBikeFull = parking.twoWheelerAvailable <= 0;
          const isCarFull = parking.fourWheelerAvailable <= 0;
          
          return (
            <div
              key={parking.id}
              onClick={() => navigate(`/parkings/${parking.id}`)}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Status Badges */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      parking.active
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {parking.active ? "Active" : "Inactive"}
                  </span>
                  
                  <div className="flex gap-2 text-[10px] text-slate-405 font-bold uppercase">
                    <span>Cars: ₹{parking.carHourlyRate}/hr</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-slate-105 group-hover:text-white transition-colors tracking-tight">
                  {parking.name}
                </h3>
                
                {/* Location */}
                <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-505 shrink-0" />
                  <span className="truncate">{parking.location}</span>
                </p>

                <div className="h-px bg-slate-850/60 my-4" />

                {/* Capacity indicators */}
                <div className={`grid ${parking.twoWheelerCapacity > 0 ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                  {/* Car count */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-855 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Car size={12} />
                      <span>Cars</span>
                    </span>
                    <div className="mt-2.5 flex items-baseline gap-1">
                      <span className={`text-xl font-extrabold ${isCarFull ? "text-red-400" : "text-green-400"}`}>
                        {parking.fourWheelerAvailable}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">/ {parking.fourWheelerCapacity}</span>
                    </div>
                  </div>

                  {/* Bike count */}
                  {parking.twoWheelerCapacity > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-855 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Bike size={12} />
                        <span>Bikes</span>
                      </span>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className={`text-xl font-extrabold ${isBikeFull ? "text-red-400" : "text-green-400"}`}>
                          {parking.twoWheelerAvailable}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">/ {parking.twoWheelerCapacity}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View Action Link */}
              <div className="mt-6 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-400 transition-colors font-bold uppercase tracking-wider">
                <span>Configure slots</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
