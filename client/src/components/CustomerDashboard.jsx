import { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    const { data } = await axios.get("/appointments/my");
    setAppointments(data);
  };

  const fetchServices = async () => {
    const { data } = await axios.get("/services");
    setServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceId || !date || !time) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post("/appointments", {
        serviceId,
        date,
        time,
      });

      await fetchAppointments();
      setServiceId("");
      setDate("");
      setTime("");
      alert("Appointment booked");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Customer Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Appointment */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Book Appointment</h3>

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

        {/* Appointments */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">My Appointments</h3>

          {appointments.length === 0 ? (
            <p>No appointments yet.</p>
          ) : (
            appointments.map((a) => (
              <div key={a._id} className="border p-3 rounded mb-2">
                <p className="font-bold">
                  {services.find((s) => s._id === a.serviceId)?.name ||
                    "Service"}
                </p>
                <p>
                  {a.date} — {a.time}
                </p>
                <span className="text-sm">{a.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
