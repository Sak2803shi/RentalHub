import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8080";

function AgentDashboard({ email }) {
  const [agent, setAgent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    if (!email) return;

    // Load agent profile by email
    const loadAgentByEmail = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/agents/email/${encodeURIComponent(email)}`,
          {
            headers: getHeaders(),
          }
        );
        if (!res.ok) throw new Error("Failed to fetch agent profile by email");
        const data = await res.json();
        setAgent(data);
        setError("");

        if (data.userId) {
          loadAppointments(data.userId);
          loadProperties();
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load agent profile");
      }
    };

    // Load appointments for agent by agentId
    const loadAppointments = async (agentId) => {
      try {
        // Adjusted API endpoint for appointments of this agent
        const res = await fetch(`${BASE_URL}/api/appointments/agent/${agentId}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      }
    };

    // Load available properties
    const loadProperties = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/properties/available`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load properties");
      }
    };

    loadAgentByEmail();
  }, [email]);

  const handleChange = (e) => setAgent({ ...agent, [e.target.name]: e.target.value });

  const updateProfile = async () => {
    try {
      const agentUpdateDTO = {
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        phno: agent.phno,
        agencyName: agent.agencyName,
        commissionRate: agent.commissionRate,
      };

      const res = await fetch(`${BASE_URL}/api/agents/${agent.userId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(agentUpdateDTO),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated!");
      setEditing(false);
      const refreshed = await res.json();
      setAgent(refreshed);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (!agent) {
    return <div>Loading agent profile...</div>;
  }

  return (
    <div className="d-flex">
      {/* SIDEBAR */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "220px", minHeight: "100vh" }}
      >
        <h4>Agent Panel</h4>
        <hr />
        <button
          className={`btn w-100 mb-2 ${
            activeTab === "profile" ? "btn-primary" : "btn-dark"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`btn w-100 mb-2 ${
            activeTab === "appointments" ? "btn-primary" : "btn-dark"
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={`btn w-100 ${
            activeTab === "properties" ? "btn-primary" : "btn-dark"
          }`}
          onClick={() => setActiveTab("properties")}
        >
          Properties
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mt-4" style={{ flex: 1 }}>
        <h2 className="text-primary">Welcome, {email}</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="card shadow p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Agent Profile</h5>
              {!editing ? (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={updateProfile}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditing(false);
                      (async () => {
                        try {
                          const res = await fetch(
                            `${BASE_URL}/api/agents/email/${encodeURIComponent(email)}`,
                            {
                              headers: getHeaders(),
                            }
                          );
                          if (!res.ok) throw new Error("Failed to fetch agent profile");
                          const data = await res.json();
                          setAgent(data);
                          setError("");
                        } catch (err) {
                          console.error(err);
                          setError("Failed to load agent profile");
                        }
                      })();
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            <div>
              {[
                "firstName",
                "lastName",
                "email",
                "phno",
                "agencyName",
                "commissionRate",
              ].map((field) => (
                <div key={field} className="mb-2">
                  <strong>{field}:</strong>{" "}
                  {!editing ? (
                    <span>{agent[field] || "-"}</span>
                  ) : (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name={field}
                      value={agent[field] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div className="card shadow">
            <div className="card-header bg-primary text-white">My Appointments</div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Property</th>
                    <th>Handled By</th>
                    <th>Handler</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length ? (
                    appointments.map((a) => (
                      <tr key={a.appointmentId}>
                        <td>{a.appointmentId}</td>
                        <td>{a.customerName}</td>
                        <td>{a.propertyTitle}</td>
                        <td>{a.handledBy}</td>
                        <td>{a.handlerName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No appointments
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === "properties" && (
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              Available Properties
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Rent Amount</th>
                    <th>Property Type</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length ? (
                    properties.map((p) => (
                      <tr key={p.propertyId}>
                        <td>{p.title}</td>
                        <td>{p.description}</td>
                        <td>{p.address}</td>
                        <td>{p.rentAmount}</td>
                        <td>{p.propertyType}</td>
                        <td>{p.isAvailable ? "Available" : "Not Available"}</td>
                        <td>{p.ownerName || "-"}</td>
                        <td>{p.agentName || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No properties
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentDashboard;
