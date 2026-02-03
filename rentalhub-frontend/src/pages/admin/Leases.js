import { useEffect, useState } from "react";
import { BASE_URL, getHeaders } from "../../utils/api";

function Leases() {
  const [list, setList] = useState([]);
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [owners, setOwners] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view

  const [form, setForm] = useState({
    leaseId: null,
    propertyId: "",
    customerUserId: "",
    ownerUserId: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: "",
    isSigned: false,
  });

  const load = async () => {
    const [leaseRes, propRes, custRes, ownRes] = await Promise.all([
      fetch(`${BASE_URL}/api/leases`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/api/properties`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/api/customers`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/api/owners`, { headers: getHeaders() }),
    ]);
    setList(await leaseRes.json());
    setProperties(await propRes.json());
    setCustomers(await custRes.json());
    setOwners(await ownRes.json());
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setForm({
      leaseId: null,
      propertyId: "",
      customerUserId: "",
      ownerUserId: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      securityDeposit: "",
      isSigned: false,
    });
    setModalMode("add");
    setModalVisible(true);
  };

  const openEditModal = (l) => {
    setForm({
      leaseId: l.leaseId,
      propertyId: l.propertyId,
      customerUserId: l.customerUserId,
      ownerUserId: l.ownerUserId,
      startDate: l.startDate,
      endDate: l.endDate,
      monthlyRent: l.monthlyRent,
      securityDeposit: l.securityDeposit,
      isSigned: l.isSigned,
    });
    setModalMode("edit");
    setModalVisible(true);
  };

  const openViewModal = (l) => {
    setForm({
      leaseId: l.leaseId,
      propertyId: l.propertyId,
      customerUserId: l.customerUserId,
      ownerUserId: l.ownerUserId,
      startDate: l.startDate,
      endDate: l.endDate,
      monthlyRent: l.monthlyRent,
      securityDeposit: l.securityDeposit,
      isSigned: l.isSigned,
    });
    setModalMode("view");
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.propertyId || !form.customerUserId || !form.startDate || !form.endDate) {
      alert("Please fill all required fields");
      return;
    }
    if (isNaN(parseFloat(form.monthlyRent)) || isNaN(parseFloat(form.securityDeposit))) {
      alert("Rent and Deposit must be numbers");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("Start Date must be before End Date");
      return;
    }

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/api/leases`
        : `${BASE_URL}/api/leases/${form.leaseId}`;

    await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({
        propertyId: parseInt(form.propertyId),
        customerUserId: parseInt(form.customerUserId),
        ownerUserId: form.ownerUserId ? parseInt(form.ownerUserId) : null,
        startDate: form.startDate,
        endDate: form.endDate,
        monthlyRent: parseFloat(form.monthlyRent),
        securityDeposit: parseFloat(form.securityDeposit),
        isSigned: form.isSigned,
      }),
    });

    setModalVisible(false);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lease agreement?")) {
      await fetch(`${BASE_URL}/api/leases/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      load();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lease Agreements</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add Lease Agreement
      </button>

      {modalVisible && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="modal-title mb-3">
                {modalMode === "add" ? "Add Lease Agreement" : modalMode === "edit" ? "Edit Lease Agreement" : "View Lease Agreement"}
              </h5>

              <form onSubmit={handleSubmit}>
                <select
                  className="form-select mb-2"
                  value={form.propertyId}
                  onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                >
                  <option value="">Select Property</option>
                  {properties.map((p) => (
                    <option key={p.propertyId} value={p.propertyId}>
                      {p.title}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select mb-2"
                  value={form.customerUserId}
                  onChange={(e) => setForm({ ...form, customerUserId: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.userId} value={c.userId}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select mb-2"
                  value={form.ownerUserId || ""}
                  onChange={(e) => setForm({ ...form, ownerUserId: e.target.value })}
                  disabled={modalMode === "view"}
                >
                  <option value="">Select Owner (optional)</option>
                  {owners.map((o) => (
                    <option key={o.userId} value={o.userId}>
                      {o.firstName} {o.lastName}
                    </option>
                  ))}
                </select>

                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                />
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  className="form-control mb-2"
                  placeholder="Monthly Rent"
                  value={form.monthlyRent}
                  onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  className="form-control mb-2"
                  placeholder="Security Deposit"
                  value={form.securityDeposit}
                  onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                />

                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isSigned"
                    checked={form.isSigned}
                    onChange={(e) => setForm({ ...form, isSigned: e.target.checked })}
                    disabled={modalMode === "view"}
                  />
                  <label htmlFor="isSigned" className="form-check-label">
                    Is Signed
                  </label>
                </div>

                <div className="d-flex justify-content-between">
                  {modalMode !== "view" && (
                    <button type="submit" className="btn btn-primary">
                      {modalMode === "add" ? "Add Lease" : "Save Changes"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Property ID</th>
            <th>Customer ID</th>
            <th>Owner ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Monthly Rent</th>
            <th>Security Deposit</th>
            <th>Signed</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((l) => (
            <tr key={l.leaseId}>
              <td>{l.leaseId}</td>
              <td>{l.propertyId}</td>
              <td>{l.customerUserId}</td>
              <td>{l.ownerUserId || "-"}</td>
              <td>{l.startDate}</td>
              <td>{l.endDate}</td>
              <td>{l.monthlyRent}</td>
              <td>{l.securityDeposit}</td>
              <td>{l.isSigned ? "Yes" : "No"}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
              <td>
                <button className="btn btn-info btn-sm me-1" onClick={() => openViewModal(l)}>
                  View
                </button>
                <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(l)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.leaseId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leases;
