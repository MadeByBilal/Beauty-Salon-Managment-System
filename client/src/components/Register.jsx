import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = ({ login }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  //-------------------------------------------------------
  const API_URL = import.meta.env.VITE_BACKEND_URL; //from env
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      //confrim the both pass are correct
      return setError("Passwords do not match");
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        //with that also log the user
        email: formData.email,
        password: formData.password,//login the user
      });

      login(response.data.token, response.data.role); //that keeps the user login and keep the user is the correct dashboard
      setSuccess("Account created! Welcome to Aura.");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="register-card">
      <div className="register-header">
        <h2>Create Account</h2>
        <p>Begin your journey with Aura</p>
      </div>

      {error && <div className="status-msg error">{error}</div>}
      {success && <div className="status-msg success">{success}</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Jane Doe"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="jane@example.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="+1 (555) 000-0000"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="role">Account Type</label>
          <select id="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Customer (Book appointments)</option>
            <option value="staff">Staff (Professional)</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button type="submit" className="register-button">
          Create Account
        </button>
      </form>

      <p className="login-prompt">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
