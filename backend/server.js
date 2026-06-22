const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

const facilityRoutes = require("./src/routes/facilityRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");

app.use("/facilities", facilityRoutes);
app.use("/vehicles", vehicleRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "MLCP Vehicle Monitoring Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});