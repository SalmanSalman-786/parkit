import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Mock Database Implementation inside LocalStorage
const INIT_PARKINGS = [
  {
    id: "p-1",
    name: "Palayam",
    location: "Palayam, Trivandrum, KL 695034",
    active: true,
    carHourlyRate: 45,
    bikeHourlyRate: 0,
    twoWheelerCapacity: 0,
    twoWheelerAvailable: 0,
    fourWheelerCapacity: 102,
    fourWheelerAvailable: 101
  },
  {
    id: "p-2",
    name: "Medical college",
    location: "Medical College Area, Trivandrum, KL 695011",
    active: true,
    carHourlyRate: 60,
    bikeHourlyRate: 0,
    twoWheelerCapacity: 0,
    twoWheelerAvailable: 0,
    fourWheelerCapacity: 80,
    fourWheelerAvailable: 50
  },
  {
    id: "p-3",
    name: "Putherikandam",
    location: "Putherikandam Maidanam, East Fort, Trivandrum, KL 695023",
    active: true,
    carHourlyRate: 40,
    bikeHourlyRate: 0,
    twoWheelerCapacity: 0,
    twoWheelerAvailable: 0,
    fourWheelerCapacity: 256,
    fourWheelerAvailable: 255
  },
  {
    id: "p-4",
    name: "Thampanoor",
    location: "Thampanoor, Trivandrum, KL 695001",
    active: true,
    carHourlyRate: 30,
    bikeHourlyRate: 10,
    twoWheelerCapacity: 200,
    twoWheelerAvailable: 198,
    fourWheelerCapacity: 100,
    fourWheelerAvailable: 100
  }
];

const INIT_USERS = [
  {
    id: "u-1",
    name: "Rahul Sharma",
    phoneNumber: "9876543210",
    email: "rahul.sharma@example.com",
    vehicleCount: 2,
    bookingCount: 14,
    totalSpent: 630,
    vehicles: [
      { plate: "MH-12-AB-1234", type: "CAR" },
      { plate: "MH-12-XY-9876", type: "BIKE" }
    ]
  },
  {
    id: "u-2",
    name: "Priya Patel",
    phoneNumber: "8765432109",
    email: "priya.patel@example.com",
    vehicleCount: 1,
    bookingCount: 8,
    totalSpent: 480,
    vehicles: [
      { plate: "GJ-01-PQ-5544", type: "CAR" }
    ]
  },
  {
    id: "u-3",
    name: "Amit Verma",
    phoneNumber: "7654321098",
    email: "amit.verma@example.com",
    vehicleCount: 1,
    bookingCount: 5,
    totalSpent: 100,
    vehicles: [
      { plate: "MH-14-DE-2020", type: "BIKE" }
    ]
  },
  {
    id: "u-4",
    name: "Sneha Reddy",
    phoneNumber: "9554433221",
    email: "sneha.reddy@example.com",
    vehicleCount: 2,
    bookingCount: 22,
    totalSpent: 1240,
    vehicles: [
      { plate: "KA-51-MM-7890", type: "CAR" },
      { plate: "KA-51-AB-1122", type: "BIKE" }
    ]
  },
  {
    id: "u-5",
    name: "Vikram Malhotra",
    phoneNumber: "9001122334",
    email: "vikram.m@example.com",
    vehicleCount: 1,
    bookingCount: 12,
    totalSpent: 540,
    vehicles: [
      { plate: "DL-3C-AB-9876", type: "CAR" }
    ]
  }
];

const INIT_GUARDS = [
  {
    id: "g-1",
    name: "Ramesh Pawar",
    username: "ramesh_pawar",
    phoneNumber: "9123456780",
    assignedParkingId: "p-1",
    assignedParkingName: "Palayam"
  },
  {
    id: "g-2",
    name: "Suresh Shinde",
    username: "suresh_shinde",
    phoneNumber: "9234567891",
    assignedParkingId: "p-2",
    assignedParkingName: "Medical college"
  },
  {
    id: "g-3",
    name: "Dnyaneshwar Patil",
    username: "dnyaneshwar_patil",
    phoneNumber: "9345678902",
    assignedParkingId: "p-3",
    assignedParkingName: "Putherikandam"
  },
  {
    id: "g-4",
    name: "Mahesh Yadav",
    username: "mahesh_yadav",
    phoneNumber: "9456789013",
    assignedParkingId: "",
    assignedParkingName: ""
  }
];

// Helper to generate ISO date strings relative to today
const getRelativeDateString = (daysOffset, hour = 10, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const INIT_BOOKINGS = [
  // Active Bookings (parked now)
  {
    id: "b-1",
    bookingId: "BK-1001",
    vehicleNumber: "MH-12-AB-1234",
    vehicleType: "CAR",
    status: "ACTIVE",
    type: "BOOKING",
    startTime: getRelativeDateString(0, 9, 30),
    entryTime: getRelativeDateString(0, 9, 45),
    exitTime: null,
    charge: 0,
    parkingId: "p-1",
    parkingName: "Palayam",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-2",
    bookingId: "BK-1002",
    vehicleNumber: "GJ-01-PQ-5544",
    vehicleType: "CAR",
    status: "ACTIVE",
    type: "BOOKING",
    startTime: getRelativeDateString(0, 10, 15),
    entryTime: getRelativeDateString(0, 10, 30),
    exitTime: null,
    charge: 0,
    parkingId: "p-2",
    parkingName: "Medical college",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-3",
    bookingId: "BK-1003",
    vehicleNumber: "MH-12-XY-9876",
    vehicleType: "BIKE",
    status: "ACTIVE",
    type: "WALKIN",
    startTime: getRelativeDateString(0, 11, 0),
    entryTime: getRelativeDateString(0, 11, 0),
    exitTime: null,
    charge: 0,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "UNPAID",
    paymentMode: "CASH",
    fine: 0
  },
  {
    id: "b-4",
    bookingId: "BK-1004",
    vehicleNumber: "KA-51-MM-7890",
    vehicleType: "CAR",
    status: "ACTIVE",
    type: "BOOKING",
    startTime: getRelativeDateString(0, 8, 0),
    entryTime: getRelativeDateString(0, 8, 15),
    exitTime: null,
    charge: 0,
    parkingId: "p-3",
    parkingName: "Putherikandam",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-5",
    bookingId: "BK-1005",
    vehicleNumber: "MH-14-DE-2020",
    vehicleType: "BIKE",
    status: "ACTIVE",
    type: "WALKIN",
    startTime: getRelativeDateString(0, 12, 15),
    entryTime: getRelativeDateString(0, 12, 15),
    exitTime: null,
    charge: 0,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "UNPAID",
    paymentMode: "CASH",
    fine: 0
  },
  
  // Completed Bookings (Past days and today)
  {
    id: "b-6",
    bookingId: "BK-1006",
    vehicleNumber: "DL-3C-AB-9876",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(0, 7, 0),
    entryTime: getRelativeDateString(0, 7, 10),
    exitTime: getRelativeDateString(0, 11, 30),
    charge: 240,
    parkingId: "p-2",
    parkingName: "Medical college",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-7",
    bookingId: "BK-1007",
    vehicleNumber: "MH-12-XY-9876",
    vehicleType: "BIKE",
    status: "COMPLETED",
    type: "WALKIN",
    startTime: getRelativeDateString(0, 8, 30),
    entryTime: getRelativeDateString(0, 8, 30),
    exitTime: getRelativeDateString(0, 10, 30),
    charge: 40,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "PAID",
    paymentMode: "CASH",
    fine: 0
  },
  {
    id: "b-8",
    bookingId: "BK-1008",
    vehicleNumber: "KA-51-AB-1122",
    vehicleType: "BIKE",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-1, 10, 0),
    entryTime: getRelativeDateString(-1, 10, 15),
    exitTime: getRelativeDateString(-1, 14, 0),
    charge: 60,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-9",
    bookingId: "BK-1009",
    vehicleNumber: "DL-3C-AB-9876",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-1, 14, 0),
    entryTime: getRelativeDateString(-1, 14, 0),
    exitTime: getRelativeDateString(-1, 19, 0),
    charge: 300,
    parkingId: "p-2",
    parkingName: "Medical college",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-10",
    bookingId: "BK-1010",
    vehicleNumber: "MH-12-AB-1234",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "WALKIN",
    startTime: getRelativeDateString(-2, 11, 0),
    entryTime: getRelativeDateString(-2, 11, 0),
    exitTime: getRelativeDateString(-2, 15, 30),
    charge: 202,
    parkingId: "p-1",
    parkingName: "Palayam",
    paymentStatus: "PAID",
    paymentMode: "CASH",
    fine: 22
  },
  {
    id: "b-11",
    bookingId: "BK-1011",
    vehicleNumber: "UP-16-TR-7777",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-2, 13, 0),
    entryTime: getRelativeDateString(-2, 13, 15),
    exitTime: getRelativeDateString(-2, 15, 0),
    charge: 80,
    parkingId: "p-3",
    parkingName: "Putherikandam",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-12",
    bookingId: "BK-1012",
    vehicleNumber: "MH-12-GH-1212",
    vehicleType: "BIKE",
    status: "COMPLETED",
    type: "WALKIN",
    startTime: getRelativeDateString(-3, 9, 0),
    entryTime: getRelativeDateString(-3, 9, 0),
    exitTime: getRelativeDateString(-3, 18, 0),
    charge: 180,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "PAID",
    paymentMode: "CASH",
    fine: 0
  },
  {
    id: "b-13",
    bookingId: "BK-1013",
    vehicleNumber: "MH-12-AB-1234",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-3, 10, 0),
    entryTime: getRelativeDateString(-3, 10, 10),
    exitTime: getRelativeDateString(-3, 13, 30),
    charge: 180,
    parkingId: "p-1",
    parkingName: "Palayam",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-14",
    bookingId: "BK-1014",
    vehicleNumber: "GJ-01-PQ-5544",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-4, 12, 0),
    entryTime: getRelativeDateString(-4, 12, 15),
    exitTime: getRelativeDateString(-4, 17, 0),
    charge: 240,
    parkingId: "p-2",
    parkingName: "Medical college",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-15",
    bookingId: "BK-1015",
    vehicleNumber: "MH-14-DE-2020",
    vehicleType: "BIKE",
    status: "COMPLETED",
    type: "WALKIN",
    startTime: getRelativeDateString(-4, 15, 0),
    entryTime: getRelativeDateString(-4, 15, 0),
    exitTime: getRelativeDateString(-4, 17, 30),
    charge: 60,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "PAID",
    paymentMode: "CASH",
    fine: 0
  },
  {
    id: "b-16",
    bookingId: "BK-1016",
    vehicleNumber: "MH-12-XY-9876",
    vehicleType: "BIKE",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-5, 8, 0),
    entryTime: getRelativeDateString(-5, 8, 10),
    exitTime: getRelativeDateString(-5, 12, 0),
    charge: 80,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-17",
    bookingId: "BK-1017",
    vehicleNumber: "DL-3C-AB-9876",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "BOOKING",
    startTime: getRelativeDateString(-5, 11, 0),
    entryTime: getRelativeDateString(-5, 11, 15),
    exitTime: getRelativeDateString(-5, 13, 0),
    charge: 120,
    parkingId: "p-2",
    parkingName: "Medical college",
    paymentStatus: "PAID",
    paymentMode: "ONLINE",
    fine: 0
  },
  {
    id: "b-18",
    bookingId: "BK-1018",
    vehicleNumber: "KA-51-MM-7890",
    vehicleType: "CAR",
    status: "COMPLETED",
    type: "WALKIN",
    startTime: getRelativeDateString(-6, 9, 30),
    entryTime: getRelativeDateString(-6, 9, 30),
    exitTime: getRelativeDateString(-6, 17, 0),
    charge: 320,
    parkingId: "p-3",
    parkingName: "Putherikandam",
    paymentStatus: "PAID",
    paymentMode: "CASH",
    fine: 0
  },
  {
    id: "b-19",
    bookingId: "BK-1019",
    vehicleNumber: "MH-12-GH-1212",
    vehicleType: "BIKE",
    status: "COMPLETED",
    type: "WALKIN",
    startTime: getRelativeDateString(-6, 14, 0),
    entryTime: getRelativeDateString(-6, 14, 0),
    exitTime: getRelativeDateString(-6, 16, 0),
    charge: 40,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "PAID",
    paymentMode: "CASH",
    fine: 0
  },
  
  // Cancelled Bookings
  {
    id: "b-20",
    bookingId: "BK-1020",
    vehicleNumber: "MH-14-DE-2020",
    vehicleType: "BIKE",
    status: "CANCELLED",
    type: "BOOKING",
    startTime: getRelativeDateString(-1, 9, 0),
    entryTime: null,
    exitTime: null,
    charge: 0,
    parkingId: "p-4",
    parkingName: "Thampanoor",
    paymentStatus: "FAILED",
    paymentMode: "ONLINE",
    fine: 0
  }
];

// Load or seed data into LocalStorage
const getStorageItem = (key, initData) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(initData));
    return initData;
  }
  return JSON.parse(item);
};

const getDB = () => {
  return {
    parkings: getStorageItem("mock_parkings_v5", INIT_PARKINGS),
    users: getStorageItem("mock_users_v5", INIT_USERS),
    guards: getStorageItem("mock_guards_v5", INIT_GUARDS),
    bookings: getStorageItem("mock_bookings_v5", INIT_BOOKINGS)
  };
};

const saveDB = (db) => {
  localStorage.setItem("mock_parkings_v5", JSON.stringify(db.parkings));
  localStorage.setItem("mock_users_v5", JSON.stringify(db.users));
  localStorage.setItem("mock_guards_v5", JSON.stringify(db.guards));
  localStorage.setItem("mock_bookings_v5", JSON.stringify(db.bookings));
};

api.defaults.adapter = function(config) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const url = config.url || "";
    const method = (config.method || "get").toLowerCase();
    
    // Normalize URL
    let path = url.replace("http://localhost:8080/api", "").replace(/^\/api/, "");
    const qIndex = path.indexOf("?");
    let queryString = "";
    if (qIndex !== -1) {
      queryString = path.substring(qIndex + 1);
      path = path.substring(0, qIndex);
    }
    
    const getQueryParam = (name) => {
      const params = new URLSearchParams(queryString);
      return params.get(name);
    };

    console.log(`[Mock API Interceptor] ${method.toUpperCase()} ${path} ${queryString ? "?" + queryString : ""}`);

    let responseData = null;
    let status = 200;

    try {
      // 1. Authentication
      if (path === "/auth/admin/login" && method === "post") {
        const { username } = JSON.parse(config.data || "{}");
        responseData = {
          token: "mock-jwt-token-for-admin-dashboard",
          role: "ADMIN",
          username: username || "admin"
        };
      }
      
      // 2. Dashboard Stats
      else if (path === "/admin/dashboard" && method === "get") {
        const todayStr = new Date().toISOString().split("T")[0];
        const todayRevenue = db.bookings
          .filter(b => b.status === "COMPLETED" && b.exitTime && b.exitTime.startsWith(todayStr))
          .reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
        
        responseData = {
          todayRevenue: todayRevenue || 280,
          totalBookings: db.bookings.length,
          activeReservations: db.bookings.filter(b => b.status === "ACTIVE").length
        };
      }
      
      // 3. Bookings List & CRUD
      else if (path === "/admin/bookings" && method === "get") {
        responseData = db.bookings;
      }
      
      else if (path.startsWith("/admin/bookings/") && method === "get") {
        const bId = path.split("/").pop();
        const booking = db.bookings.find(b => b.bookingId === bId || b.id === bId);
        if (booking) {
          responseData = booking;
        } else {
          status = 404;
          responseData = { message: "Booking not found" };
        }
      }
      
      // 4. Parkings List & CRUD
      else if (path === "/parking" && method === "get") {
        responseData = db.parkings;
      }
      
      else if (path === "/parking" && method === "post") {
        const body = JSON.parse(config.data || "{}");
        const newParking = {
          id: "p-" + (db.parkings.length + 1),
          name: body.name || "Unnamed Facility",
          location: body.location || "Unknown Location",
          active: body.active !== undefined ? body.active : true,
          carHourlyRate: Number(body.carHourlyRate) || 40,
          bikeHourlyRate: Number(body.bikeHourlyRate) || 20,
          twoWheelerCapacity: Number(body.twoWheelerCapacity) || 50,
          twoWheelerAvailable: Number(body.twoWheelerCapacity) || 50,
          fourWheelerCapacity: Number(body.fourWheelerCapacity) || 50,
          fourWheelerAvailable: Number(body.fourWheelerCapacity) || 50,
          imageUrl: body.imageUrl || ""
        };
        db.parkings.push(newParking);
        saveDB(db);
        responseData = newParking;
      }
      
      else if (path === "/parking/upload" && method === "post") {
        responseData = {
          imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"
        };
      }
      
      else if (path.startsWith("/parking/") && method === "get") {
        const pId = path.split("/").pop();
        const parking = db.parkings.find(p => p.id === pId);
        if (parking) {
          responseData = parking;
        } else {
          status = 404;
          responseData = { message: "Parking not found" };
        }
      }
      
      else if (path.startsWith("/parking/") && method === "put") {
        const pId = path.split("/").pop();
        const body = JSON.parse(config.data || "{}");
        const index = db.parkings.findIndex(p => p.id === pId);
        if (index !== -1) {
          db.parkings[index] = {
            ...db.parkings[index],
            ...body,
            carHourlyRate: body.carHourlyRate !== undefined ? Number(body.carHourlyRate) : db.parkings[index].carHourlyRate,
            bikeHourlyRate: body.bikeHourlyRate !== undefined ? Number(body.bikeHourlyRate) : db.parkings[index].bikeHourlyRate,
            twoWheelerCapacity: body.twoWheelerCapacity !== undefined ? Number(body.twoWheelerCapacity) : db.parkings[index].twoWheelerCapacity,
            fourWheelerCapacity: body.fourWheelerCapacity !== undefined ? Number(body.fourWheelerCapacity) : db.parkings[index].fourWheelerCapacity,
          };
          saveDB(db);
          responseData = db.parkings[index];
        } else {
          status = 404;
          responseData = { message: "Parking not found" };
        }
      }
      
      else if (path.startsWith("/parking/") && method === "delete") {
        const pId = path.split("/").pop();
        db.parkings = db.parkings.filter(p => p.id !== pId);
        saveDB(db);
        responseData = { success: true };
      }
      
      // 5. Users List & CRUD
      else if (path === "/admin/users" && method === "get") {
        responseData = db.users;
      }
      
      else if (path.startsWith("/admin/users/") && method === "get") {
        const uId = path.split("/").pop();
        const userObj = db.users.find(u => u.id === uId);
        if (userObj) {
          const userBookings = db.bookings.filter(b => b.vehicleNumber && userObj.vehicles.some(v => v.plate === b.vehicleNumber));
          const totalSpent = userBookings.filter(b => b.status === "COMPLETED").reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
          responseData = {
            user: {
              ...userObj,
              vehicles: userObj.vehicles || []
            },
            bookings: userBookings,
            totalSpent: totalSpent
          };
        } else {
          status = 404;
          responseData = { message: "User not found" };
        }
      }
      
      // 6. Guards List & CRUD
      else if (path === "/admin/guards" && method === "get") {
        responseData = db.guards;
      }
      
      else if (path === "/auth/guard/register" && method === "post") {
        const body = JSON.parse(config.data || "{}");
        const assignedPark = db.parkings.find(p => p.id === body.assignedParkingId);
        const newGuard = {
          id: "g-" + (db.guards.length + 1),
          name: body.name || "Unnamed Guard",
          username: body.username || "guard",
          phoneNumber: body.phoneNumber || "",
          assignedParkingId: body.assignedParkingId || "",
          assignedParkingName: assignedPark ? assignedPark.name : ""
        };
        db.guards.push(newGuard);
        saveDB(db);
        responseData = newGuard;
      }
      
      else if (path.startsWith("/admin/guards/") && method === "put") {
        const gId = path.split("/").pop();
        const body = JSON.parse(config.data || "{}");
        const index = db.guards.findIndex(g => g.id === gId);
        if (index !== -1) {
          const assignedPark = db.parkings.find(p => p.id === body.assignedParkingId);
          db.guards[index] = {
            ...db.guards[index],
            ...body,
            assignedParkingName: assignedPark ? assignedPark.name : (body.assignedParkingId ? db.guards[index].assignedParkingName : "")
          };
          saveDB(db);
          responseData = db.guards[index];
        } else {
          status = 404;
          responseData = { message: "Guard not found" };
        }
      }
      
      // 7. Revenue Endpoints
      else if (path === "/admin/revenue/last7days" && method === "get") {
        const trend = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          
          const amt = db.bookings
            .filter(b => b.status === "COMPLETED" && b.exitTime && b.exitTime.startsWith(dateStr))
            .reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
          
          trend.push({
            date: dateStr,
            amount: amt || (2000 + (i * 350) + Math.floor(Math.random() * 500))
          });
        }
        responseData = trend;
      }
      
      else if (path === "/admin/revenue" && method === "get") {
        const reqDate = getQueryParam("date") || new Date().toISOString().split("T")[0];
        
        const dayBookings = db.bookings.filter(b => b.status === "COMPLETED" && b.exitTime && b.exitTime.startsWith(reqDate));
        
        const onlineRevenue = dayBookings.filter(b => b.paymentMode === "ONLINE").reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
        const cashRevenue = dayBookings.filter(b => b.paymentMode === "CASH").reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
        
        const isToday = reqDate === new Date().toISOString().split("T")[0];
        responseData = {
          onlineRevenue: onlineRevenue || (isToday ? 1800 : 3100),
          cashRevenue: cashRevenue || (isToday ? 1000 : 1600),
          totalRevenue: (onlineRevenue + cashRevenue) || (isToday ? 2800 : 4700),
          onlineCount: dayBookings.filter(b => b.paymentMode === "ONLINE").length || (isToday ? 12 : 24),
          cashCount: dayBookings.filter(b => b.paymentMode === "CASH").length || (isToday ? 8 : 16),
          totalCount: dayBookings.length || (isToday ? 20 : 40),
          refundCount: 0
        };
      }
      
      else if (path === "/admin/revenue/parking" && method === "get") {
        const reqDate = getQueryParam("date") || new Date().toISOString().split("T")[0];
        responseData = db.parkings.map(parking => {
          const amt = db.bookings
            .filter(b => b.parkingId === parking.id && b.status === "COMPLETED" && b.exitTime && b.exitTime.startsWith(reqDate))
            .reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
          return {
            parkingId: parking.id,
            parkingName: parking.name,
            amount: amt || (parking.id === "p-1" ? 1200 : parking.id === "p-2" ? 1800 : parking.id === "p-3" ? 2200 : 500)
          };
        });
      }
      
      else if (path === "/admin/revenue/transactions" && method === "get") {
        const reqDate = getQueryParam("date");
        const filter = getQueryParam("filter");
        const parkingId = getQueryParam("parkingId");
        
        let txs = db.bookings
          .filter(b => b.status === "COMPLETED" && b.exitTime)
          .map(b => ({
            transactionType: b.fine > 0 ? "FINE" : b.type || "BOOKING",
            parkingName: b.parkingName,
            parkingId: b.parkingId,
            bookingId: b.bookingId,
            vehicleNumber: b.vehicleNumber,
            paymentMode: b.paymentMode || "ONLINE",
            amount: (b.charge || 0) + (b.fine || 0),
            dateTime: b.exitTime
          }));
          
        if (reqDate) {
          txs = txs.filter(tx => tx.dateTime.startsWith(reqDate));
        }
        if (parkingId) {
          txs = txs.filter(tx => tx.parkingId === parkingId);
        }
        if (filter && filter !== "ALL") {
          if (filter === "ONLINE") txs = txs.filter(tx => tx.paymentMode === "ONLINE");
          else if (filter === "CASH") txs = txs.filter(tx => tx.paymentMode === "CASH");
          else if (filter === "FINE") txs = txs.filter(tx => tx.transactionType === "FINE");
          else if (filter === "REFUND") txs = txs.filter(tx => tx.transactionType === "REFUND");
        }
        
        responseData = txs;
      }
      
      // 8. Walkins List & CRUD
      else if (path === "/admin/walkins" && method === "get") {
        const walkinsMap = {};
        db.bookings
          .filter(b => b.type === "WALKIN")
          .forEach(b => {
            if (!walkinsMap[b.vehicleNumber]) {
              walkinsMap[b.vehicleNumber] = {
                vehicleNumber: b.vehicleNumber,
                phoneNumber: b.phoneNumber || "No Contact Info",
                walkinCount: 0,
                totalAmount: 0,
                bookings: []
              };
            }
            walkinsMap[b.vehicleNumber].walkinCount += 1;
            walkinsMap[b.vehicleNumber].totalAmount += (b.charge || 0) + (b.fine || 0);
            walkinsMap[b.vehicleNumber].bookings.push(b);
          });
        responseData = Object.values(walkinsMap);
      }
      
      else if (path.startsWith("/admin/walkins/") && method === "get") {
        const vNumber = decodeURIComponent(path.split("/").pop());
        const vehicleBookings = db.bookings.filter(b => b.vehicleNumber === vNumber && b.type === "WALKIN");
        const totalAmount = vehicleBookings.reduce((sum, b) => sum + (b.charge || 0) + (b.fine || 0), 0);
        
        responseData = {
          vehicleNumber: vNumber,
          phoneNumber: vehicleBookings[0]?.phoneNumber || "9876543210",
          walkinCount: vehicleBookings.length,
          totalAmount: totalAmount,
          bookings: vehicleBookings
        };
      }
      
      // Fallback
      else {
        console.warn(`[Mock API Interceptor] Route not mocked: ${method.toUpperCase()} ${path}`);
        status = 404;
        responseData = { message: "Route not mocked" };
      }
      
      resolve({
        data: responseData,
        status: status,
        statusText: status === 200 ? "OK" : "Error",
        headers: {},
        config: config
      });
      
    } catch (e) {
      console.error("[Mock API Interceptor] Error executing mock route", e);
      reject(e);
    }
  });
};

export default api;