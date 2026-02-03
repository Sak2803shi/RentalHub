import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "./pages/auth/Login";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AgentDashboard from "./pages/dashboards/AgentDashboard";
import OwnerDashboard from "./pages/dashboards/OwnerDashboard";

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        return;
      }

      console.log("Decoded in App:", decoded);
      setAuth(decoded);
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  const role = auth?.role;
  const email = auth?.email || auth?.sub;
  const userId = auth?.userId;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={role === "ROLE_ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/customer"
        element={
          role === "ROLE_CUSTOMER" ? (
            <CustomerDashboard email={email} customerId={userId} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
  path="/agent"
  element={
    role === "ROLE_AGENT" ? (
      <AgentDashboard email={email} userId={userId} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
  path="/owner"
  element={
    role === "ROLE_OWNER" ? (
      <OwnerDashboard email={email} userId={userId} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
