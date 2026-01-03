import { useState, useEffect } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/appointments/my");
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services");
      setServices(response.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/appointments", {
        serviceId: selectedService,
        date,
        time,
      });
      fetchAppointments();
      setSelectedService("");
      setDate("");
      setTime("");
      alert("Appointment booked successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Customer Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Appointment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Book New Appointment</h3>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} (${service.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Book Appointment
            </button>
          </form>
        </div>

        {/* My Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">My Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments booked yet.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        {services.find((s) => s._id === appointment.serviceId)
                          ?.name || "Service"}
                      </p>
                      <p className="text-gray-600">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
