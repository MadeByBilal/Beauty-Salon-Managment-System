import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = ({ login }) => {
  // Add login prop
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // First register the user
      await axios.post("/auth/register", { name, email, password, role });

      // After successful registration, automatically login the user
      try {
        const response = await axios.post("/auth/login", { email, password });

        // Use the login function from App.jsx to set auth state
        login(response.data.token, response.data.role);

        setSuccess("Registration successful! Redirecting to dashboard...");

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (loginErr) {
        // If auto-login fails, show success but redirect to login
        setSuccess(
          "Registration successful! Please login with your credentials."
        );
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join our appointment system</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="register-select"
            >
              <option value="customer">Customer (Book appointments)</option>
              <option value="staff">Staff (Manage appointments)</option>
              <option value="admin">Admin (Full access)</option>
            </select>
          </div>

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
