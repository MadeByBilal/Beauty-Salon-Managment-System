import { useState, useEffect } from "react";
import axios from "axios";

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/appointments/staff");
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

  const handleCompleteAppointment = async (id) => {
    try {
      await axios.put(`/appointments/${id}/status`, { status: "completed" });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update appointment");
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Staff Dashboard</h2>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() =>
                          handleCompleteAppointment(appointment._id)
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
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

export default StaffDashboard;
