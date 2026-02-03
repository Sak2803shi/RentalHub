import React, { useEffect, useState, useCallback } from "react";

function CustomerDashboard({ email, customerId }) {
  const BASE_URL = "http://localhost:8080/api";

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [handlerType, setHandlerType] = useState(""); // OWNER or AGENT

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phno: ""
  });

  // 🔐 JWT Fetch Helper
  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) throw new Error("Unauthorized. Login again.");
    if (res.status === 403) throw new Error("Access denied.");
    if (!res.ok) throw new Error("API request failed");

    return res.json();
  }, []);

  // 📦 Load data
  useEffect(() => {
    if (!email || !customerId) return;

    async function loadData() {
      setLoading(true);
      try {
        const prof = await authFetch(`${BASE_URL}/customers/email/${email}`);
        setProfile(prof);
        setEditProfile({
          firstName: prof.firstName || "",
          lastName: prof.lastName || "",
          email: prof.email || "",
          phno: prof.phno || "",
          agencyName: prof.agencyName || "",
          commissionRate: prof.commissionRate || 0,
        });

        setAppointments(await authFetch(`${BASE_URL}/appointments/customer/${customerId}`));
        setLeases(await authFetch(`${BASE_URL}/leases/customer/${customerId}`));
        setProperties(await authFetch(`${BASE_URL}/properties/available`));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [email, customerId, authFetch]);

  // 📅 Book Appointment — DTO PERFECT
  const bookAppointment = async () => {
    try {
      if (!handlerType) {
        alert("Please select Owner or Agent");
        return;
      }

      const requestBody = {
        customerId: customerId,
        propertyId: selectedProperty.propertyId,
      };

      if (handlerType === "OWNER") {
        requestBody.ownerId = selectedProperty.ownerId;
      } else if (handlerType === "AGENT") {
        requestBody.agentId = selectedProperty.agentId;
      }

      await authFetch(`${BASE_URL}/appointments`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      alert("Appointment booked successfully!");
      setShowModal(false);
      setHandlerType("");
      setAppointments(await authFetch(`${BASE_URL}/appointments/customer/${customerId}`));
    } catch (e) {
      alert(e.message);
    }
  };

  // Save updated profile
  const saveProfile = async () => {
    try {
      await authFetch(`${BASE_URL}/customers/${customerId}`, {
        method: "PUT",
        body: JSON.stringify(editProfile),
      });

      const updatedProfile = await authFetch(`${BASE_URL}/customers/email/${email}`);
      setProfile(updatedProfile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (e) {
      alert("Failed to update profile: " + e.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white vh-100 p-3">
          <h4 className="text-center mb-4">Customer Panel</h4>
          <ul className="nav flex-column nav-pills">
            {["profile", "appointments", "leases", "properties"].map(tab => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link text-start ${activeTab === tab ? "active bg-warning text-dark" : "text-white"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="col-md-10 p-4 bg-light">

          {activeTab === "profile" && profile && (
            <div className="card shadow p-4">
              <h4>Profile Details</h4>

              {isEditing ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProfile.firstName}
                      onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProfile.lastName}
                      onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProfile.phno}
                      onChange={(e) => setEditProfile({ ...editProfile, phno: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Agency Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProfile.agencyName}
                      onChange={(e) => setEditProfile({ ...editProfile, agencyName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Commission Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={editProfile.commissionRate}
                      onChange={(e) => setEditProfile({ ...editProfile, commissionRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <button className="btn btn-success me-2" onClick={saveProfile}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <p><b>Name:</b> {profile.firstName} {profile.lastName}</p>
                  <p><b>Email:</b> {profile.email}</p>
                  <p><b>Phone:</b> {profile.phno}</p>
                  

                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                </>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="card shadow p-3">
              <h4>My Appointments</h4>
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Property</th>
                    <th>Handled By</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.appointmentId}>
                      <td>{a.propertyTitle}</td>
                      <td>{a.handlerName} ({a.handledBy})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "leases" && (
            <div className="card shadow p-3">
              <h4>My Lease Agreements</h4>
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Property</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Rent</th>
                    <th>Deposit</th>
                    <th>Signed</th>
                  </tr>
                </thead>
                <tbody>
                  {leases.map(l => (
                    <tr key={l.leaseId}>
                      <td>{l.propertyId}</td>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td>₹ {l.monthlyRent}</td>
                      <td>₹ {l.securityDeposit}</td>
                      <td>{l.isSigned ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "properties" && (
            <div className="card shadow p-3">
              <h4>Available Properties</h4>
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Rent</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.propertyId}>
                      <td>{p.title}</td>
                      <td>{p.propertyType}</td>
                      <td>₹ {p.rentAmount}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => {
                            setSelectedProperty(p);
                            setShowModal(true);
                          }}
                        >
                          Book Appointment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal Form */}
      {showModal && (
        <div className="modal show fade d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Book Appointment</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <p><b>Property:</b> {selectedProperty?.title}</p>

                {selectedProperty?.ownerId && (
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      checked={handlerType === "OWNER"}
                      onChange={() => setHandlerType("OWNER")}
                    />
                    <label className="form-check-label">
                      Owner: {selectedProperty.ownerName}
                    </label>
                  </div>
                )}

                {selectedProperty?.agentId && (
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      checked={handlerType === "AGENT"}
                      onChange={() => setHandlerType("AGENT")}
                    />
                    <label className="form-check-label">
                      Agent: {selectedProperty.agentName}
                    </label>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={bookAppointment}>Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
