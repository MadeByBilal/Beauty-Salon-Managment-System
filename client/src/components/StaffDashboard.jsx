import { useState, useEffect } from "react";
import axios from "axios";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/staff`);
      setAppointments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await axios.put(`${API_URL}/api/appointments/${id}/status`, {
        status: "completed",
      });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update appointment");
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
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

  return (
    <div className="aura-page-wrapper">
      <div className="aura-main-container">
        <header className="aura-header">
          <h1>
            AURA <span className="title-tag">Staff</span>
          </h1>
          <p>Manage your daily treatments and guest experiences.</p>
        </header>

        <section className="aura-dashboard-content">
          <div className="aura-card shadow-touch">
            <div className="card-header-flex">
              <h3 className="card-label">Daily Schedule</h3>
              <div className="schedule-stats">
                {appointments.filter((a) => a.status === "pending").length}{" "}
                Pending Tasks
              </div>
            </div>

            <div className="aura-ledger">
              {/* Header for Desktop */}
              <div className="ledger-head">
                <span>Customer & Service</span>
                <span>Scheduled Time</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>

              {appointments.length === 0 ? (
                <div className="aura-empty-state">
                  No appointments assigned to you today.
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className={`ledger-row ${appointment.status}`}
                  >
                    <div className="col-info">
                      <span className="cust-name">
                        {appointment.customerName || "Valued Guest"}
                      </span>
                      <span className="serv-name">
                        {getServiceName(appointment.serviceId)}
                      </span>
                    </div>

                    <div className="col-time">
                      <span className="scheduled-time">
                        {formatDateTime(appointment.date, appointment.time)}
                      </span>
                    </div>

                    <div className="col-status">
                      <span className={`aura-pill ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="col-actions text-right">
                      {appointment.status === "pending" ? (
                        <button
                          className="aura-btn-complete"
                          onClick={() =>
                            handleCompleteAppointment(appointment._id)
                          }
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <span className="completion-check">✓ Finished</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffDashboard;
