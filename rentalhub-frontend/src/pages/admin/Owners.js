import { useEffect, useState } from "react";
import { BASE_URL, getHeaders } from "../../utils/api";

function Owners() {
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view

  const [form, setForm] = useState({
    userId: null,
    firstName: "",
    lastName: "",
    email: "",
    phno: "",
    password: "",
    dob: "",
    verifiedStatus: false,
  });

  const load = async () => {
    const res = await fetch(`${BASE_URL}/api/owners`, { headers: getHeaders() });
    setList(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setForm({
      userId: null,
      firstName: "",
      lastName: "",
      email: "",
      phno: "",
      password: "",
      dob: "",
      verifiedStatus: false,
    });
    setModalMode("add");
    setModalVisible(true);
  };

  const openEditModal = (owner) => {
    setForm({
      userId: owner.userId,
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phno: owner.phno,
      password: "",
      dob: owner.dob,
      verifiedStatus: owner.verifiedStatus || false,
    });
    setModalMode("edit");
    setModalVisible(true);
  };

  const openViewModal = (owner) => {
    setForm({
      userId: owner.userId,
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phno: owner.phno,
      password: "******",
      dob: owner.dob,
      verifiedStatus: owner.verifiedStatus || false,
    });
    setModalMode("view");
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalMode === "add" && form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(form.phno)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/api/owners/register`
        : `${BASE_URL}/api/owners/${form.userId}`;

    const bodyData = { ...form };
    if (modalMode === "edit" && !form.password) {
      delete bodyData.password;
    }

    await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(bodyData),
    });

    setModalVisible(false);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      await fetch(`${BASE_URL}/api/owners/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      load();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Owners</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add Owner
      </button>

      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5 className="modal-title mb-3">
                {modalMode === "add" ? "Add Owner" : modalMode === "edit" ? "Edit Owner" : "View Owner"}
              </h5>

              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-2"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Phone (10 digits)"
                  value={form.phno}
                  onChange={(e) => setForm({ ...form, phno: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                {(modalMode === "add" || modalMode === "edit") && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder={modalMode === "edit" ? "New Password (leave blank to keep current)" : "Password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={modalMode === "add"}
                    minLength={6}
                    disabled={modalMode === "view"}
                  />
                )}
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />

                {/* Verified Status checkbox */}
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="verifiedStatus"
                    checked={form.verifiedStatus}
                    onChange={(e) => setForm({ ...form, verifiedStatus: e.target.checked })}
                    disabled={modalMode === "view"}
                  />
                  <label className="form-check-label" htmlFor="verifiedStatus">
                    Verified Status
                  </label>
                </div>

                <div className="d-flex justify-content-between">
                  {modalMode !== "view" && (
                    <button type="submit" className="btn btn-primary">
                      {modalMode === "add" ? "Add Owner" : "Save Changes"}
                    </button>
                  )}
                  <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
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
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.userId}>
              <td>{o.userId}</td>
              <td>{o.firstName} {o.lastName}</td>
              <td>{o.email}</td>
              <td>{o.phno}</td>
              <td>{o.dob}</td>
              <td>{o.verifiedStatus ? "Yes" : "No"}</td>
              <td>
                <button className="btn btn-info btn-sm me-1" onClick={() => openViewModal(o)}>View</button>
                <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(o)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Owners;
