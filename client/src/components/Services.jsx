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
    <div>
      <h2>Services</h2>

      {user?.role === "admin" && (
        <div>
          <h3>Add New Service</h3>
          <form onSubmit={handleAddService}>
            <input
              type="text"
              placeholder="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <button type="submit">Add Service</button>
          </form>
        </div>
      )}

      <div>
        {services.map((service) => (
          <div key={service._id}>
            <h3>{service.name}</h3>
            <p>Price: ${service.price}</p>
            <p>Duration: {service.duration} minutes</p>

            {user?.role === "admin" && (
              <button onClick={() => handleDeleteService(service._id)}>
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
