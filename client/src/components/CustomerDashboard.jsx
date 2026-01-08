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
    fetchAppointments();
    fetchCompletedAppointments();
    fetchServices();

    // Add this to check user ID
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/auth/me");
        console.log("Current user ID:", data.id);
      } catch (err) {
        console.error("Failed to get user info:", err);
      }
    };
    checkUser();
  }, []);
  const fetchAppointments = async () => {
    const { data } = await axios.get("/appointments/my");
    setAppointments(data);
  };
  const fetchCompletedAppointments = async () => {
    try {
      const { data } = await axios.get("/appointments/my/completed");
      console.log("Completed appointments data:", data);
      setCompletedAppointments(data || []);
    } catch (err) {
      console.error("Error fetching completed appointments:", err);
      console.error("Error response:", err.response?.data);
      setCompletedAppointments([]);
    }
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
      await fetchCompletedAppointments();
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
    <div>
      <h2>Customer Dashboard</h2>

      <div>
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
                //Here it was mapping the services to the options
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
        <div>
          <h3>My Appointments</h3>

          {appointments.length === 0 ? (
            <p>No appointments yet.</p>
          ) : (
            appointments.map((a) => (
              <div key={a._id}>
                <p>
                  {
                    //Here it was finding a service with the name by there id
                    services.find((s) => s._id === a.serviceId)?.name ||
                      "Service"
                  }{" "}
                </p>
                <p>
                  {a.date} — {a.time}
                </p>
                <span>{a.status}</span>
              </div>
            ))
          )}
        </div>
        {/* Completed Appointments */}
        <div>
          <h3>My History</h3>
          {completedAppointments.length === 0 ? (
            <p>No history yet.</p>
          ) : (
            completedAppointments.map((a) => {
              // Add debugging
              console.log("Appointment serviceId:", a.serviceId);
              console.log("Appointment serviceId type:", typeof a.serviceId);
              console.log("Available services:", services);

              const service = services.find((s) => {
                console.log("Comparing:", s._id, "with", a.serviceId);
                return (
                  s._id === a.serviceId ||
                  s._id.toString() === a.serviceId.toString()
                );
              });

              console.log("Found service:", service);

              return (
                <div key={a._id}>
                  <p>{service?.name || "Service"}</p>
                  <p>
                    {a.date} — {a.time}
                  </p>
                  <span>{a.status}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
