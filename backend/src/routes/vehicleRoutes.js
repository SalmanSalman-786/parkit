const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  registerEntry,
  registerExit,
  searchVehicle,
  getParkedVehicles,
  getLongStayVehicles,
  getDashboardStats,
} = require("../controllers/vehicleController");

router.post(
  "/entry",
  upload.single("vehicle_image"),
  registerEntry
);
router.post(
  "/exit",
  upload.single("vehicle_image"),
  registerExit
);
router.get("/dashboard/stats", getDashboardStats);
router.get("/alerts/longstay", getLongStayVehicles);
router.get("/parked/all", getParkedVehicles);
router.get("/:vehicle_number", searchVehicle);

module.exports = router;