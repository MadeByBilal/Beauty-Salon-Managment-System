import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import the styles

const Login = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      login(response.data.token, response.data.role);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1>AURA</h1>
          <p>Beauty Salon Management</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. claire@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" id="forgot-link">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
