import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // Stats
  const totalServices = services.length;
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending" || app.status === "Pending"
  ).length;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/services`);
      setServices(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const pendingRes = await axios.get(`${API_URL}/api/appointments/my`);
      const pendingAppointments = pendingRes.data || [];

      const completedRes = await axios.get(
        `${API_URL}/api/appointments/my/completed`
      );
      const completedAppointments = completedRes.data || [];

      const allAppointments = pendingAppointments.concat(completedAppointments);
      setAppointments(allAppointments);
    } catch (err) {
      setAppointments([]);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/staff`);
      setStaffUsers(res.data || []);
    } catch (err) {
      setStaffUsers([]);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    setError("");
    try {
      await axios.delete(`${API_URL}/api/auth/staff/${id}`);
      setMessage("Staff member deleted successfully");
      setStaffUsers((prev) => prev.filter((staff) => staff._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete staff member");
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find(
      (s) => s._id?.toString() === serviceId?.toString()
    );
    return service ? service.name : "Unknown Service";
  };

  const formatDateTime = (dateStr, timeStr) => {
    try {
      const date = new Date(dateStr);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const formattedTime = `${displayHour}:${minutes} ${period}`;

      return `${dayName} ${monthName} ${day}, ${year} at ${formattedTime}`;
    } catch (err) {
      return `${dateStr} at ${timeStr}`;
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAppointments();
    fetchStaffUsers();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDuration("");
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !price || !duration) {
      setError("Please fill all fields");
      return;
    }

    const payload = { name, price: Number(price), duration: Number(duration) };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/services/${editingId}`, payload);
        setMessage("Service updated successfully");
      } else {
        await axios.post(`${API_URL}/services`, payload);
        setMessage("Service created successfully");
      }

      await fetchServices();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (svc) => {
    setEditingId(svc._id);
    setName(svc.name || "");
    setPrice(svc.price?.toString() || "");
    setDuration(svc.duration?.toString() || "");
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    setError("");
    try {
      await axios.delete(`${API_URL}/services/${id}`);
      setMessage("Service deleted successfully");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="aura-admin-wrapper">
      <main className="aura-admin-main">
        <header className="aura-admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage services, appointments, and staff accounts</p>
        </header>

        <div className="aura-stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Services</span>
            <span className="stat-value">{totalServices}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Appointments</span>
            <span className="stat-value">{totalAppointments}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Appointments</span>
            <span className="stat-value">{pendingAppointments}</span>
          </div>
        </div>

        <section className="admin-section">
          <h2 className="section-title">Manage Services</h2>
          <div className="admin-two-col">
            <div className="aura-card">
              <h3
                style={{
                  marginBottom: "25px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "var(--dark)",
                }}
              >
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>

              {error && <div className="alert error">{error}</div>}
              {message && <div className="alert success">{message}</div>}

              <form onSubmit={handleSubmit} className="aura-admin-form">
                <div className="input-group">
                  <label>Service Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Swedish Massage"
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div className="input-group">
                    <label>Duration (min)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 60"
                    />
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "15px", marginTop: "10px" }}
                >
                  <button type="submit" className="btn-primary">
                    {editingId ? "Update Service" : "Create Service"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-ghost"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="aura-card">
              <h3
                style={{
                  marginBottom: "25px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "var(--dark)",
                }}
              >
                All Services ({services.length})
              </h3>

              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--text-gray)",
                  }}
                >
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--text-gray)",
                  }}
                >
                  No services yet. Add your first service!
                </div>
              ) : (
                <div className="aura-table-wrapper">
                  <table className="aura-admin-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((svc) => (
                        <tr key={svc._id}>
                          <td style={{ fontWeight: "600" }}>{svc.name}</td>
                          <td>${svc.price}</td>
                          <td>{svc.duration} min</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEdit(svc)}
                                className="text-btn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(svc._id)}
                                className="btn-danger"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Appointments</h2>
          <div className="aura-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  margin: 0,
                  fontWeight: "700",
                  color: "var(--dark)",
                }}
              >
                All Appointments ({appointments.length})
              </h3>
              <button className="btn-ghost" onClick={fetchAppointments}>
                Refresh
              </button>
            </div>

            {appointments.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--text-gray)",
                }}
              >
                No appointments found
              </div>
            ) : (
              <div className="aura-table-wrapper">
                <table className="aura-admin-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app._id}>
                        <td>{getServiceName(app.serviceId)}</td>
                        <td>{formatDateTime(app.date, app.time)}</td>
                        <td>
                          <span
                            className={`aura-pill ${app.status?.toLowerCase()}`}
                          >
                            {app.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Staff Management</h2>
          <div className="aura-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  margin: 0,
                  fontWeight: "700",
                  color: "var(--dark)",
                }}
              >
                Staff Accounts ({staffUsers.length})
              </h3>
              <button className="btn-ghost" onClick={fetchStaffUsers}>
                Refresh
              </button>
            </div>

            {staffUsers.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--text-gray)",
                }}
              >
                No staff accounts found
              </div>
            ) : (
              <div className="aura-table-wrapper">
                <table className="aura-admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers.map((staff) => (
                      <tr key={staff._id}>
                        <td style={{ fontWeight: "600" }}>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>
                          <span
                            className="aura-pill"
                            style={{
                              background:
                                "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
                              color: "#1B5E20",
                              border: "1px solid rgba(76, 175, 80, 0.3)",
                            }}
                          >
                            {staff.role}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteStaff(staff._id)}
                            className="btn-danger"
                            style={{
                              padding: "10px 20px",
                              fontSize: "0.85rem",
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
