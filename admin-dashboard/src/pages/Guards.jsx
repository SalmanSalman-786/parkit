import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

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
      (guard.username || "").toLowerCase().includes(search.toLowerCase()),
  );

  const thStyle = {
    padding: "16px",
    textAlign: "left",
    color: "#64748b",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "16px",
    color: "#111827",
  };

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
        },
      );

      setShowModal(false);
      setEditingGuard(null);

      loadGuards();
    } catch (err) {
      console.error(err);
      alert("Failed to update guard");
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#111827",
          }}
        >
          Guards Management
        </h2>

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
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Guard
        </button>
      </div>

      <input
        type="text"
        placeholder="Search guard..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
        }}
      />

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Assigned Parking</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuards.map((guard) => (
              <tr
                key={guard.id}
                style={{
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <td style={tdStyle}>{guard.name}</td>

                <td style={tdStyle}>{guard.username}</td>

                <td style={tdStyle}>{guard.phoneNumber}</td>

                <td style={tdStyle}>{guard.assignedParkingName}</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => openEditGuard(guard)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "500px",
              padding: "25px",
              borderRadius: "20px",
            }}
          >
            <h2>{editingGuard ? "Edit Guard" : "Add Guard"}</h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  phoneNumber: e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              placeholder="Username"
              disabled={editingGuard !== null}
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
            />

            <br />
            <br />

            {!editingGuard && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
                <br />
                <br />
              </>
            )}

            <br />
            <br />

            <select
              value={form.assignedParkingId}
              onChange={(e) => {
                const parking = parkings.find((p) => p.id === e.target.value);

                setForm({
                  ...form,
                  assignedParkingId: parking.id,
                  assignedParkingName: parking.name,
                });
              }}
            >
              <option value="">Select Parking</option>

              {parkings.map((parking) => (
                <option key={parking.id} value={parking.id}>
                  {parking.name}
                </option>
              ))}
            </select>

            <br />
            <br />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGuard(null);
                }}
              >
                Cancel
              </button>

              <button onClick={editingGuard ? updateGuard : createGuard}>
                {editingGuard ? "Update Guard" : "Create Guard"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
