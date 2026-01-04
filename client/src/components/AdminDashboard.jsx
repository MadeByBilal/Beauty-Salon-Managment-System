import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/services");
      setServices(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDuration("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !price || !duration) {
      setError("Please fill all fields");
      return;
    }

    const payload = { name, price: Number(price), duration: Number(duration) };

    try {
      if (editingId) {
        await axios.put(`/services/${editingId}`, payload);
        setMessage("Service updated");
      } else {
        await axios.post("/services", payload);
        setMessage("Service created");
      }

      await fetchServices();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (svc) => {
    setEditingId(svc._id);
    setName(svc.name || "");
    setPrice(svc.price?.toString() || "");
    setDuration(svc.duration?.toString() || "");
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    setError("");
    try {
      await axios.delete(`/services/${id}`);
      setMessage("Service deleted");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="ad-title">Admin Dashboard</h2>

      <section className="ad-section">
        <h3>Manage Services</h3>

        <div className="ad-form-wrap">
          <form className="ad-form" onSubmit={handleSubmit}>
            {error && <div className="ad-error">{error}</div>}
            {message && <div className="ad-message">{message}</div>}

            <div className="field">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="field">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary">
                {editingId ? "Update Service" : "Add Service"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="ad-list">
          <h4>All Services</h4>
          {loading ? (
            <div>Loading...</div>
          ) : services.length === 0 ? (
            <div>No services yet</div>
          ) : (
            <table className="services-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc._id}>
                    <td>{svc.name}</td>
                    <td>{svc.price}</td>
                    <td>{svc.duration} min</td>
                    <td className="row-actions">
                      <button
                        onClick={() => handleEdit(svc)}
                        className="btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(svc._id)}
                        className="btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
