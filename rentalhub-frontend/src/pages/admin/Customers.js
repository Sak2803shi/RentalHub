import React, { useEffect, useState } from "react";
import { BASE_URL, getHeaders } from "../../utils/api";

function Customers() {
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    userId: null,
    firstName: "",
    lastName: "",
    email: "",
    phno: "",
    password: "",
    dob: "",
  });

  // Load customers list
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/customers`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError("Error fetching customers: " + res.status);
        console.error("LOAD ERROR:", res.status, errText);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setList(data);
    } catch (err) {
      setError("Network error: " + err.message);
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Modal open handlers
  const openAddModal = () => {
    setForm({
      userId: null,
      firstName: "",
      lastName: "",
      email: "",
      phno: "",
      password: "",
      dob: "",
    });
    setModalMode("add");
    setModalVisible(true);
  };

  const openEditModal = (customer) => {
    setForm({ ...customer, password: "" });
    setModalMode("edit");
    setModalVisible(true);
  };

  const openViewModal = (customer) => {
    setForm({ ...customer, password: "******" });
    setModalMode("view");
    setModalVisible(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit add or edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/api/customers/register`
        : `${BASE_URL}/api/customers/${form.userId}`;

    const bodyData = { ...form };
    if (modalMode === "edit" && !form.password) delete bodyData.password;

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError("Save failed: " + res.status + " - " + errText);
        setLoading(false);
        return;
      }

      setModalVisible(false);
      load();
    } catch (err) {
      setError("Network error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/customers/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        setError("Delete failed: " + res.status);
        setLoading(false);
        return;
      }

      load();
    } catch (err) {
      setError("Network error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Customers</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary mb-3" onClick={openAddModal} disabled={loading}>
        Add Customer
      </button>

      {loading && <p>Loading...</p>}

      {!loading && (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No customers found.
                </td>
              </tr>
            )}
            {list.map((c) => (
              <tr key={c.userId}>
                <td>{c.userId}</td>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email}</td>
                <td>{c.phno}</td>
                <td>{c.dob ? new Date(c.dob).toLocaleDateString() : ""}</td>
                <td>
                  <button className="btn btn-info btn-sm me-1" onClick={() => openViewModal(c)}>
                    View
                  </button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(c)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.userId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalVisible && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ position: "fixed", zIndex: 1050, top: 0, left: 0, width: "100vw", height: "100vh" }}
        >
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1040 }}
            // Disable closing on backdrop click intentionally
            // onClick={() => setModalVisible(false)}
          ></div>

          <div
            className="modal-dialog"
            role="document"
            style={{ zIndex: 1051, position: "relative", margin: "100px auto" }}
          >
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "add"
                    ? "Add Customer"
                    : modalMode === "edit"
                    ? "Edit Customer"
                    : "View Customer"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phno"
                    value={form.phno}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                {modalMode !== "view" && (
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleInputChange}
                      placeholder={modalMode === "edit" ? "Leave blank to keep current password" : ""}
                      required={modalMode === "add"}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={form.dob ? form.dob.split("T")[0] : ""}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </div>
              </div>

              {modalMode !== "view" && (
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {modalMode === "view" && (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
