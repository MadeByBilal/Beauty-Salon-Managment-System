import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          AURA
        </Link>

        {/* Mobile Toggle Button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          <span className={`hamburger ${isOpen ? "open" : ""}`}></span>
        </button>

        {/* Links Section */}
        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          {user ? (
            <>
              
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <span className="user-badge">
                <span className="dot"></span> {user.role}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link nav-link-primary"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
