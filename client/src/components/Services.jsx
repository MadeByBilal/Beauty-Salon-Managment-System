import { useState, useEffect } from "react";
import axios from "axios";

const Services = ({ user }) => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services");
      setServices(response.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/services", {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
      });
      fetchServices();
      setName("");
      setPrice("");
      setDuration("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add service");
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await axios.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Services</h2>

      {user?.role === "admin" && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">Add New Service</h3>
          <form onSubmit={handleAddService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Service Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Service
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-2">Price: ${service.price}</p>
            <p className="text-gray-600 mb-4">
              Duration: {service.duration} minutes
            </p>

            {user?.role === "admin" && (
              <button
                onClick={() => handleDeleteService(service._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
