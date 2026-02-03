import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";

function OwnerDashboard({ email, userId }) {
  const BASE_URL = "http://localhost:8080/api";
  const PAYMENT_URL = "http://localhost:8082/api/payments";

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);

  const [properties, setProperties] = useState([]);
  const [leases, setLeases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Property modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [form, setForm] = useState({
    propertyId: null,
    title: "",
    description: "",
    address: "",
    rentAmount: "",
    propertyType: "",
    isAvailable: true,
  });

  // Lease modal states
  const [leaseModalVisible, setLeaseModalVisible] = useState(false);
  const [leaseForm, setLeaseForm] = useState({
    leaseId: null,
    propertyId: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: "",
    isSigned: false,
  });
  const [leaseLoading, setLeaseLoading] = useState(false);
  const [leaseError, setLeaseError] = useState("");

  // Payment form state

const [paymentForm, setPaymentForm] = useState({
  leaseId: "",
  customerUserId: "",
  ownerUserId: userId, // auto owner
  amount: "",
  paymentMethod: "UPI",
  status: "PAID",
});


  // Helper to do authorized fetch calls with token
  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) throw new Error("Unauthorized. Please login again.");
    if (res.status === 403) throw new Error("Access denied.");
    if (!res.ok) throw new Error("API request failed");

    return res.json();
  }, []);

  // Load data when email or userId changes
  useEffect(() => {
    if (!email || !userId) return;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        // Profile
        const profileData = await authFetch(`${BASE_URL}/owners/email/${email}`);
        setProfile(profileData);

        // Properties
        const allProperties = await authFetch(`${BASE_URL}/properties`);
        const ownerProperties = allProperties.filter((p) => p.ownerId === userId);
        setProperties(ownerProperties);

        // Leases
        const allLeases = await authFetch(`${BASE_URL}/leases`);
        const leasesForOwner = allLeases.filter((l) =>
          ownerProperties.some((p) => p.propertyId === l.propertyId)
        );
        setLeases(leasesForOwner);

        // Appointments
        const allAppointments = await authFetch(`${BASE_URL}/appointments/owner/${userId}`);
        const appointmentsForOwner = allAppointments.filter((a) =>
          ownerProperties.some((p) => p.propertyId === a.propertyId)
        );
        setAppointments(appointmentsForOwner);

        // Payments
        const allPayments = await authFetch(PAYMENT_URL);
        setPayments(allPayments);

        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [email, userId, authFetch]);

  // Property handlers
  const openAddModal = () => {
    setForm({
      propertyId: null,
      title: "",
      description: "",
      address: "",
      rentAmount: "",
      propertyType: "",
      isAvailable: true,
    });
    setModalMode("add");
    setModalVisible(true);
    setError("");
  };

  const openEditModal = (property) => {
    setForm({
      propertyId: property.propertyId,
      title: property.title || "",
      description: property.description || "",
      address: property.address || "",
      rentAmount: property.rentAmount || "",
      propertyType: property.propertyType || "",
      isAvailable: property.isAvailable ?? true,
    });
    setModalMode("edit");
    setModalVisible(true);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/properties`
        : `${BASE_URL}/properties/${form.propertyId}`;

    try {
      const payload = {
        title: form.title,
        description: form.description,
        address: form.address,
        rentAmount: Number(form.rentAmount),
        propertyType: form.propertyType,
        isAvailable: form.isAvailable,
        ownerId: userId,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = "Failed to save property";
        try {
          const errData = await res.json();
          if (errData.message) errMsg = errData.message;
        } catch {}
        setError(errMsg);
        setLoading(false);
        return;
      }

      setModalVisible(false);

      const allProperties = await authFetch(`${BASE_URL}/properties`);
      setProperties(allProperties.filter((p) => p.ownerId === userId));
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Delete this property?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        setError("Delete failed");
        setLoading(false);
        return;
      }

      const allProperties = await authFetch(`${BASE_URL}/properties`);
      setProperties(allProperties.filter((p) => p.ownerId === userId));
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Lease handlers
  const handleDeleteLease = async (leaseId) => {
    if (!window.confirm("Delete this lease?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/leases/${leaseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        setError("Failed to delete lease");
        setLoading(false);
        return;
      }

      const allLeases = await authFetch(`${BASE_URL}/leases`);
      const ownerPropertyIds = properties.map((p) => p.propertyId);
      setLeases(allLeases.filter((l) => ownerPropertyIds.includes(l.propertyId)));
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const saveProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/owners/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        let errMsg = "Failed to save profile";
        try {
          const errData = await res.json();
          if (errData.message) errMsg = errData.message;
        } catch {}
        setError(errMsg);
        setLoading(false);
        return;
      }
      alert("Profile updated successfully");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Lease modal handlers
  const openAddLeaseModal = () => {
    setLeaseForm({
      leaseId: null,
      propertyId: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      securityDeposit: "",
      isSigned: false,
    });
    setLeaseError("");
    setLeaseModalVisible(true);
  };

  const handleLeaseInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeaseForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setLeaseError("");
  };

  const closeLeaseModal = () => {
    if (!leaseLoading) setLeaseModalVisible(false);
  };

  const handleLeaseSubmit = async (e) => {
    e.preventDefault();
    setLeaseLoading(true);
    setLeaseError("");

    try {
      if (!leaseForm.propertyId || !leaseForm.startDate || !leaseForm.endDate || !leaseForm.monthlyRent) {
        setLeaseError("Please fill all required fields");
        setLeaseLoading(false);
        return;
      }

      const payload = {
        propertyId: leaseForm.propertyId,
        startDate: leaseForm.startDate,
        endDate: leaseForm.endDate,
        monthlyRent: Number(leaseForm.monthlyRent),
        securityDeposit: Number(leaseForm.securityDeposit) || 0,
        isSigned: leaseForm.isSigned,
      };

      const res = await fetch(`${BASE_URL}/leases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = "Failed to add lease";
        try {
          const errData = await res.json();
          if (errData.message) errMsg = errData.message;
        } catch {}
        setLeaseError(errMsg);
        setLeaseLoading(false);
        return;
      }

      setLeaseModalVisible(false);

      const allLeases = await authFetch(`${BASE_URL}/leases`);
      const ownerPropertyIds = properties.map((p) => p.propertyId);
      setLeases(allLeases.filter((l) => ownerPropertyIds.includes(l.propertyId)));
    } catch (e) {
      setLeaseError("Network error: " + e.message);
    } finally {
      setLeaseLoading(false);
    }
  };

  // Payment handlers
  const handlePaymentInput = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...paymentForm,
      leaseId: Number(paymentForm.leaseId),
      customerUserId: Number(paymentForm.customerUserId),
      ownerUserId: Number(userId),
      amount: Number(paymentForm.amount),
      paymentDate: paymentForm.paymentDate + "T00:00:00",
    };

    const res = await fetch(PAYMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Payment failed");

    const refreshed = await authFetch(`${PAYMENT_URL}/owner/${userId}`);
    setPayments(refreshed);

    setPaymentForm({
      leaseId: "",
      customerUserId: "",
      customerName: "",
      ownerUserId: userId,
      ownerName: profile?.firstName || "",
      amount: "",
      paymentMethod: "UPI",
      status: "PAID",
      paymentDate: "",
    });

    alert("Payment Added Successfully");
  } catch (err) {
    alert("Failed to add payment");
  }
};


  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <div>Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white vh-100 p-3">
          <h4 className="text-center mb-4">Owner Panel</h4>
          <ul className="nav flex-column nav-pills">
            {["profile", "properties", "leases", "appointments", "payments"].map((tab) => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link text-start ${
                    activeTab === tab ? "active bg-warning text-dark" : "text-white"
                  }`}
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
          {/* Profile */}
          {activeTab === "profile" && profile && (
            <div className="card shadow p-4">
              <h4>Profile Details</h4>

              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName || ""}
                  onChange={handleProfileChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName || ""}
                  onChange={handleProfileChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  disabled
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phno"
                  value={profile.phno || ""}
                  onChange={handleProfileChange}
                  className="form-control"
                />
              </div>

              <button className="btn btn-primary" onClick={saveProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}

          {/* Properties */}
          {activeTab === "properties" && (
            <div>
              <h4>My Properties</h4>
              <button className="btn btn-primary mb-3" onClick={openAddModal} disabled={loading}>
                Add Property
              </button>

              {properties.length === 0 ? (
                <p>No properties found.</p>
              ) : (
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Address</th>
                      <th>Rent Amount</th>
                      <th>Property Type</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.propertyId}>
                        <td>{p.title}</td>
                        <td>{p.description}</td>
                        <td>{p.address}</td>
                        <td>₹ {p.rentAmount}</td>
                        <td>{p.propertyType}</td>
                        <td>{p.isAvailable ? "Yes" : "No"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-1"
                            onClick={() => openEditModal(p)}
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProperty(p.propertyId)}
                            disabled={loading}
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
          )}

          {/* Leases */}
          {activeTab === "leases" && (
            <div>
              <h4>Lease Agreements</h4>
              <button
                className="btn btn-primary mb-3"
                onClick={openAddLeaseModal}
                disabled={loading || leaseLoading}
              >
                Add Lease
              </button>

              {leases.length === 0 ? (
                <p>No lease agreements found.</p>
              ) : (
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Property</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Rent</th>
                      <th>Deposit</th>
                      <th>Signed</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leases.map((l) => (
                      <tr key={l.leaseId}>
                        <td>{l.propertyTitle || l.propertyId}</td>
                        <td>{format(new Date(l.startDate), "dd MMM yyyy")}</td>
                        <td>{format(new Date(l.endDate), "dd MMM yyyy")}</td>
                        <td>₹ {l.monthlyRent}</td>
                        <td>₹ {l.securityDeposit}</td>
                        <td>{l.isSigned ? "Yes" : "No"}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteLease(l.leaseId)}
                            disabled={loading}
                          >
                            Delete Lease
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div>
              <h4>Appointments</h4>
              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Property</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Tenant</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.appointmentId}>
                        <td>{a.propertyTitle || a.propertyId}</td>
                        <td>{format(new Date(a.appointmentDate), "dd MMM yyyy")}</td>
                        <td>{a.appointmentTime}</td>
                        <td>{a.tenantName || a.tenantId}</td>
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <div>
              <h4>Payments</h4>

              {/* Add Payment */}
             <form className="card p-3 mb-3" onSubmit={handleAddPayment}>
  <h5>Add Payment</h5>

  <select
    name="leaseId"
    className="form-select mb-2"
    value={paymentForm.leaseId}
    onChange={handlePaymentInput}
    required
  >
    <option value="">Select Lease</option>
    {leases.map(l => (
      <option key={l.leaseId} value={l.leaseId}>
        Lease #{l.leaseId}
      </option>
    ))}
  </select>

  <input
    type="number"
    name="customerUserId"
    placeholder="Customer User ID"
    className="form-control mb-2"
    value={paymentForm.customerUserId}
    onChange={handlePaymentInput}
    required
  />

  <input
    type="text"
    name="customerName"
    placeholder="Customer Name"
    className="form-control mb-2"
    value={paymentForm.customerName}
    onChange={handlePaymentInput}
    required
  />

  <input
    type="text"
    name="ownerName"
    placeholder="Owner Name"
    className="form-control mb-2"
    value={paymentForm.ownerName}
    onChange={handlePaymentInput}
    required
  />

  <input
    type="number"
    name="amount"
    placeholder="Amount"
    className="form-control mb-2"
    value={paymentForm.amount}
    onChange={handlePaymentInput}
    required
  />

  <select
    name="paymentMethod"
    className="form-select mb-2"
    value={paymentForm.paymentMethod}
    onChange={handlePaymentInput}
  >
    <option>UPI</option>
    <option>CARD</option>
    <option>CASH</option>
    <option>BANK_TRANSFER</option>
  </select>

  <select
    name="status"
    className="form-select mb-2"
    value={paymentForm.status}
    onChange={handlePaymentInput}
  >
    <option>PAID</option>
    <option>PENDING</option>
    <option>FAILED</option>
  </select>

  <input
    type="date"
    name="paymentDate"
    className="form-control mb-2"
    value={paymentForm.paymentDate}
    onChange={handlePaymentInput}
    required
  />

  <button className="btn btn-success">Add Payment</button>
</form>

              {/* Payment Table */}
              {payments.length === 0 ? (
  <p>No payments found.</p>
) : (
  <table className="table table-bordered">
    <thead className="table-dark">
      <tr>
        <th>ID</th>
        <th>Lease</th>
        <th>Customer</th>
        <th>Owner</th>
        <th>Amount</th>
        <th>Method</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {payments.map((p) => (
        <tr key={p.paymentId}>
          <td>{p.paymentId}</td>
          <td>{p.leaseId}</td>
          <td>{p.customerName}</td>
          <td>{p.ownerName}</td>
          <td>₹ {p.amount}</td>
          <td>{p.paymentMethod}</td>
          <td>{p.status}</td>
          <td>
            {p.paymentDate
              ? new Date(p.paymentDate).toLocaleDateString()
              : "-"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

            </div>
          )}

          {/* Property Modal */}
          {modalVisible && (
            <div className="modal d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">{modalMode === "add" ? "Add Property" : "Edit Property"}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setModalVisible(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={form.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        value={form.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={form.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Rent Amount</label>
                      <input
                        type="number"
                        name="rentAmount"
                        className="form-control"
                        value={form.rentAmount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Property Type</label>
                      <input
                        type="text"
                        name="propertyType"
                        className="form-control"
                        value={form.propertyType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        id="availableCheck"
                        checked={form.isAvailable}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="availableCheck">
                        Available
                      </label>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModalVisible(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lease Modal */}
          {leaseModalVisible && (
            <div className="modal d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleLeaseSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add Lease</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeLeaseModal}
                      disabled={leaseLoading}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Property</label>
                      <select
                        name="propertyId"
                        className="form-select"
                        value={leaseForm.propertyId}
                        onChange={handleLeaseInputChange}
                        required
                      >
                        <option value="">Select property</option>
                        {properties.map((p) => (
                          <option key={p.propertyId} value={p.propertyId}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="form-control"
                        value={leaseForm.startDate}
                        onChange={handleLeaseInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        className="form-control"
                        value={leaseForm.endDate}
                        onChange={handleLeaseInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Monthly Rent</label>
                      <input
                        type="number"
                        name="monthlyRent"
                        className="form-control"
                        value={leaseForm.monthlyRent}
                        onChange={handleLeaseInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Security Deposit</label>
                      <input
                        type="number"
                        name="securityDeposit"
                        className="form-control"
                        value={leaseForm.securityDeposit}
                        onChange={handleLeaseInputChange}
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="isSigned"
                        id="signedCheck"
                        checked={leaseForm.isSigned}
                        onChange={handleLeaseInputChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="signedCheck">
                        Signed
                      </label>
                    </div>

                    {leaseError && <div className="alert alert-danger">{leaseError}</div>}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeLeaseModal}
                      disabled={leaseLoading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={leaseLoading}>
                      {leaseLoading ? "Saving..." : "Save Lease"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
