import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  //Backend Url from env.
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchServices();
    fetchAppointments();
    fetchCompletedAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      //my are the appointments that are pending.
      const { data } = await axios.get(`${API_URL}/api/appointments/my`);
      setAppointments(data || []);
    } catch (err) {
      if (err.response?.status !== 401) console.error("Error:", err);
      setAppointments([]);
    }
  };
  //my/complete are the appointment that are complete.
  const fetchCompletedAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/appointments/my/completed`
      );
      setCompletedAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status !== 401) console.error("Error:", err);
      setCompletedAppointments([]);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/services`);
      setServices(data || []);
    } catch (err) {
      if (err.response?.status !== 401) console.error("Error:", err);
      setServices([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/appointments`, {
        serviceId,
        date,
        time,
      });
      setServiceId("");
      setDate("");
      setTime("");
      fetchAppointments();
      alert("Appointment successfully reserved.");
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };
  //Getting the service name by using its id.
  const getServiceName = (id) => {
    const s = services.find((srv) => srv._id?.toString() === id?.toString());
    return s?.name || "Premium Treatment";
  };
  //formatDateTime  function.
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
      const formattedTime = `${hours}:${minutes}`;

      return `${dayName} ${monthName} ${day}, ${year} at ${formattedTime}`;
    } catch (err) {
      return `${dateStr} at ${timeStr}`;
    }
  };

  // Cancel appointment function.
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/appointments/${appointmentId}/cancel`
      );

      // Refresh both appointment lists
      fetchAppointments();
      fetchCompletedAppointments();

      alert("Appointment cancelled successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Error cancelling appointment");
    }
  };
  return (
    <div className="aura-page-wrapper">
      <div className="aura-main-container">
        <header className="aura-header">
          <div>
            <h1>
              AURA <span className="title-divider">|</span> Customer Portal
            </h1>
            <p>Elegance in every appointment.</p>
          </div>
        </header>

        <div className="aura-dashboard-grid">
          {/* SIDEBAR: BOOKING & MENU */}
          <aside className="aura-sidebar">
            <section className="aura-card sharp-shadow">
              <h3 className="card-title">New Reservation</h3>
              <form onSubmit={handleSubmit} className="aura-form">
                <div className="aura-input-group">
                  <label>Service Selection</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                  >
                    <option value="">Choose a treatment...</option>
                    {services.map((s) => (
                      // here is the serviceid set in the variable
                      <option key={s._id} value={s._id}>
                        {s.name} — ${s.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="aura-input-row">
                  <div className="aura-input-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="aura-input-group">
                    <label>Time Slot</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="aura-btn-primary">
                  Confirm Booking
                </button>
              </form>
            </section>

            <section className="aura-card sharp-shadow">
              <h3 className="card-title">Treatment Menu</h3>
              <div className="aura-menu-list">
                {services.map((s) => (
                  <div key={s._id} className="aura-menu-item">
                    <div className="menu-header">
                      <span className="menu-name">{s.name}</span>
                      <span className="menu-price">${s.price}</span>
                    </div>
                    <span className="menu-duration">
                      {s.duration} minutes of bliss
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* CONTENT: APPOINTMENTS */}
          <main className="aura-content">
            <section className="aura-card sharp-shadow">
              <h3 className="card-title">Upcoming Appointments</h3>
              {appointments.length === 0 ? (
                <p className="aura-empty-msg">No active appointments found.</p>
              ) : (
                <div className="aura-appointment-list">
                  {appointments.map((a) => (
                    <div key={a._id} className="aura-appointment-row">
                      <div className="row-main">
                        <span className={`aura-pill ${a.status.toLowerCase()}`}>
                          {a.status}
                        </span>
                        <h4>{getServiceName(a.serviceId)}</h4>
                        <p>{formatDateTime(a.date, a.time)}</p>
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(a._id)}
                        className="aura-btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SYMMETRICAL HISTORY SECTION */}
            <section className="aura-card sharp-shadow history-section">
              <h3 className="card-title">Booking History</h3>
              <div className="aura-history-table">
                <div className="history-header">
                  <span>Service</span>
                  <span>Date & Time</span>
                  <span>Status</span>
                </div>
                {completedAppointments.length === 0 ? (
                  <p className="aura-empty-msg">
                    Your history is currently empty.
                  </p>
                ) : (
                  completedAppointments.map((a) => (
                    <div key={a._id} className="history-row">
                      <span className="hist-name">
                        {getServiceName(a.serviceId)}
                      </span>
                      <span className="hist-date">
                        {formatDateTime(a.date, a.time)}
                      </span>
                      <span
                        className="hist-status"
                        style={{
                          color: a.status === "cancelled" ? "red" : "green",
                        }}
                      >
                        {a.status === "cancelled" ? "Cancelled" : "Completed"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
