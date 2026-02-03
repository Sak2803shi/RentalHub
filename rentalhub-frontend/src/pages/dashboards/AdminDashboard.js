import { useState } from "react";
import Customers from "../admin/Customers";
import Agents from "../admin/Agents";
import Owners from "../admin/Owners";
import Properties from "../admin/Properties";
import Appointments from "../admin/Appointments";
import Leases from "../admin/Leases";
import AdminPayments from "../admin/AdminPayments";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("customers");

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        className="bg-dark text-white p-3"
        style={{ width: "220px", minHeight: "100vh" }}
      >
        <h3 className="text-center mb-4">Admin Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-white ${
                activeSection === "customers" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveSection("customers")}
            >
              Customers
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-white ${
                activeSection === "agents" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveSection("agents")}
            >
              Agents
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-white ${
                activeSection === "owners" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveSection("owners")}
            >
              Owners
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-white ${
                activeSection === "properties" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveSection("properties")}
            >
              Properties
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-white ${
                activeSection === "appointments" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveSection("appointments")}
            >
              Appointments
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-link text-white ${
                activeSection === "leases" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveSection("leases")}
            >
              Lease Agreements
            </button>
          </li>
          <li className="nav-item mb-2">
  <button
    className={`btn btn-link text-white ${activeSection === "payments" ? "fw-bold" : ""}`}
    onClick={() => setActiveSection("payments")}
  >
    Payments
  </button>
</li>

        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        {activeSection === "customers" && <Customers />}
        {activeSection === "agents" && <Agents />}
        {activeSection === "owners" && <Owners />}
        {activeSection === "properties" && <Properties />}
        {activeSection === "appointments" && <Appointments />}
        {activeSection === "leases" && <Leases />}
        {activeSection === "payments" && <AdminPayments />}

      </div>
    </div>
  );
}

export default AdminDashboard;
