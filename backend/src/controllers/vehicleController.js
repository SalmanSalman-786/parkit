const pool = require("../config/db");

const registerEntry = async (req, res) => {
  try {
    const {
      vehicle_number,
      vehicle_color,
      manufacturer,
      model,
      facility_id,
    } = req.body;

    const entryImagePath = req.file
    ? req.file.path
    : null;

    if (
      !vehicle_number ||
      !vehicle_color ||
      !manufacturer ||
      !model ||
      !facility_id
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let vehicleResult = await pool.query(
      "SELECT * FROM vehicles WHERE vehicle_number = $1",
      [vehicle_number]
    );

    let vehicleId;

    if (vehicleResult.rows.length === 0) {
      const newVehicle = await pool.query(
        `INSERT INTO vehicles
        (vehicle_number, vehicle_color, manufacturer, model)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [
          vehicle_number,
          vehicle_color,
          manufacturer,
          model,
        ]
      );

      vehicleId = newVehicle.rows[0].vehicle_id;
    } else {
      vehicleId = vehicleResult.rows[0].vehicle_id;
    }

    const activeVisit = await pool.query(
        `SELECT *
        FROM vehicle_visits
        WHERE vehicle_id = $1
        AND status = 'Parked'`,
        [vehicleId]
    );

    if (activeVisit.rows.length > 0) {
        return res.status(400).json({
            message: "Vehicle is already parked",
        });
    }

    const visit = await pool.query(
      `INSERT INTO vehicle_visits
      (vehicle_id, facility_id, entry_time, status)
      VALUES ($1,$2,NOW(),'Parked')
      RETURNING *`,
      [vehicleId, facility_id]
    );

    res.status(201).json({
      message: "Vehicle Entry Registered",
      visit: visit.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const registerExit = async (req, res) => {
  try {
    const { vehicle_number } = req.body;

    const vehicle = await pool.query(
      "SELECT * FROM vehicles WHERE vehicle_number = $1",
      [vehicle_number]
    );

    if (vehicle.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const vehicleId = vehicle.rows[0].vehicle_id;

    const visit = await pool.query(
      `SELECT *
       FROM vehicle_visits
       WHERE vehicle_id = $1
       AND status = 'Parked'
       ORDER BY visit_id DESC
       LIMIT 1`,
      [vehicleId]
    );

    if (visit.rows.length === 0) {
      return res.status(404).json({
        message: "No active parking record found",
      });
    }

    const updatedVisit = await pool.query(
      `UPDATE vehicle_visits
       SET exit_time = NOW(),
           status = 'Exited'
       WHERE visit_id = $1
       RETURNING *`,
      [visit.rows[0].visit_id]
    );

    res.status(200).json({
      message: "Vehicle Exit Registered",
      visit: updatedVisit.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const searchVehicle = async (req, res) => {
  try {

    const { vehicle_number } = req.params;

    const result = await pool.query(
      `
      SELECT
        v.vehicle_number,
        v.vehicle_color,
        v.manufacturer,
        v.model,
        f.facility_name,
        vv.entry_time,
        vv.exit_time,
        vv.status

      FROM vehicles v

      JOIN vehicle_visits vv
        ON v.vehicle_id = vv.vehicle_id

      JOIN facilities f
        ON vv.facility_id = f.facility_id

      WHERE v.vehicle_number = $1

      ORDER BY vv.visit_id DESC

      LIMIT 1
      `,
      [vehicle_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

const getParkedVehicles = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        vv.visit_id,
        v.vehicle_number,
        v.vehicle_color,
        v.manufacturer,
        v.model,
        f.facility_name,
        vv.entry_time

      FROM vehicle_visits vv

      JOIN vehicles v
        ON vv.vehicle_id = v.vehicle_id

      JOIN facilities f
        ON vv.facility_id = f.facility_id

      WHERE vv.status = 'Parked'

      ORDER BY vv.entry_time DESC
      `
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

const getLongStayVehicles = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        v.vehicle_number,
        v.vehicle_color,
        v.manufacturer,
        v.model,
        f.facility_name,
        vv.entry_time,

        ROUND(
          EXTRACT(EPOCH FROM (NOW() - vv.entry_time)) / 3600,
          2
        ) AS hours_parked

      FROM vehicle_visits vv

      JOIN vehicles v
        ON vv.vehicle_id = v.vehicle_id

      JOIN facilities f
        ON vv.facility_id = f.facility_id

      WHERE
        vv.status = 'Parked'
        AND vv.entry_time < NOW() - INTERVAL '48 HOURS'

      ORDER BY vv.entry_time
      `
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

const getDashboardStats = async (req, res) => {
  try {

    const parkedVehicles = await pool.query(
      `
      SELECT COUNT(*)
      FROM vehicle_visits
      WHERE status = 'Parked'
      `
    );

    const entriesToday = await pool.query(
      `
      SELECT COUNT(*)
      FROM vehicle_visits
      WHERE DATE(entry_time) = CURRENT_DATE
      `
    );

    const exitsToday = await pool.query(
      `
      SELECT COUNT(*)
      FROM vehicle_visits
      WHERE exit_time IS NOT NULL
      AND DATE(exit_time) = CURRENT_DATE
      `
    );

    const longStayAlerts = await pool.query(
      `
      SELECT COUNT(*)
      FROM vehicle_visits
      WHERE status = 'Parked'
      AND entry_time < NOW() - INTERVAL '48 HOURS'
      `
    );

    res.status(200).json({
      vehicles_currently_parked: parseInt(parkedVehicles.rows[0].count),
      entries_today: parseInt(entriesToday.rows[0].count),
      exits_today: parseInt(exitsToday.rows[0].count),
      long_stay_alerts: parseInt(longStayAlerts.rows[0].count)
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  registerEntry,
  registerExit,
  searchVehicle,
  getParkedVehicles,
  getLongStayVehicles,
  getDashboardStats,
};