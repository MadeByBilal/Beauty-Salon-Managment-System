import { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [services, setServices] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchServices();
    fetchAppointments();
    fetchCompletedAppointments();
  }, []);

  // --------- FETCH ALL APPOINTMENTS ----------
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get("/appointments/my");
      setAppointments(data || []);
    } catch (err) {
      // Only log if it's not a 401 (auth errors are handled by App.jsx)
      if (err.response?.status !== 401) {
        console.error(
          "Error fetching appointments:",
          err.response?.data?.message || err.message
        );
      }
      setAppointments([]);
    }
  };

  // --------- FETCH COMPLETED HISTORY ----------
  const fetchCompletedAppointments = async () => {
    try {
      const { data } = await axios.get("/appointments/my/completed");
      setCompletedAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      // Only log if it's not a 401 (auth errors are handled by App.jsx)
      if (err.response?.status !== 401) {
        console.error(
          "Error fetching completed:",
          err.response?.data?.message || err.message
        );
      }
      setCompletedAppointments([]);
    }
  };

  // --------- FETCH SERVICES ----------
  const fetchServices = async () => {
    try {
      const { data } = await axios.get("/services");
      setServices(data || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(
          "Error fetching services:",
          err.response?.data?.message || err.message
        );
      }
      setServices([]);
    }
  };

  // --------- BOOK APPOINTMENT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId || !date || !time) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post("/appointments", { serviceId, date, time });

      setServiceId("");
      setDate("");
      setTime("");

      await fetchAppointments();
      await fetchCompletedAppointments();

      alert("Appointment booked");
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  // --------- FIND SERVICE NAME ----------
  const getServiceName = (id) => {
    const s = services.find((srv) => srv._id?.toString() === id?.toString());
    return s?.name || "Service";
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Customer Dashboard</h2>

      {/* ---- BOOKING FORM ---- */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold">Book Appointment</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Book
          </button>
        </form>
      </div>

      {/* ---- ALL APPOINTMENTS ---- */}
      <div>
        <h3 className="text-xl font-semibold mb-2">My Appointments</h3>

        {appointments.length === 0 && <p>No appointments yet.</p>}

        {appointments.map((a) => (
          <div key={a._id} className="border p-3 rounded mb-2">
            <p>{getServiceName(a.serviceId)}</p>
            <p>
              {a.date} — {a.time}
            </p>
            <span>Status: {a.status}</span>
          </div>
        ))}
      </div>

      {/* ---- COMPLETED HISTORY ---- */}
      <div>
        <h3 className="text-xl font-semibold mb-2">My History (Completed)</h3>

        {completedAppointments.length === 0 && <p>No history yet.</p>}

        {completedAppointments.map((a) => (
          <div key={a._id} className="border p-3 rounded mb-2">
            <p>{getServiceName(a.serviceId)}</p>
            <p>
              {a.date} — {a.time}
            </p>
            <span>Status: {a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
