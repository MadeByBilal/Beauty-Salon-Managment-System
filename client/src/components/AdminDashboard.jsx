import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const total = appointments.length;
      const pending = appointments.filter((a) => a.status === "pending").length;
      const completed = appointments.filter(
        (a) => a.status === "completed"
      ).length;
      setStats({ total, pending, completed });
    }
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/appointments/admin");
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

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Appointments
          </h3>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Pending</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Completed</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getServiceName(appointment.serviceId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
