import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import CustomerDashboard from "./components/CustomerDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Services from "./components/Services";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = token; //This adds the token in to header of every request of the axois.
    }
  }, []);

  const login = (token, role) => {
    const userData = { role };
    localStorage.setItem("token", token); //Storing the token on the browser local storage.
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); //storing the role of the user
    axios.defaults.headers.common["Authorization"] = token;
  };

  const logout = () => {
    localStorage.removeItem("token"); //Removing the token from browser local storage.
    localStorage.removeItem("user");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} logout={logout} />
        <div className="main-content container">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
            <Route
              path="/login"
              element={
                !user ? <Login login={login} /> : <Navigate to="/dashboard" /> //login function is pass as to provide the token and the role of the user.
              }
            />
            <Route
              path="/register"
              element={
                !user ? (
                  <Register login={login} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route path="/services" element={<Services user={user} />} />
            //user have the info of the token and the role
            <Route
              path="/dashboard"
              element={
                user ? (
                  user.role === "customer" ? (
                    <CustomerDashboard />
                  ) : user.role === "staff" ? (
                    <StaffDashboard />
                  ) : user.role === "admin" ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
