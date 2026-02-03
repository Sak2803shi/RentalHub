import { useEffect, useState } from "react";
import { BASE_URL, getHeaders } from "../../utils/api";

function Agents() {
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
    agencyName: "",
    commissionRate: "",
  });

  const load = async () => {
    const res = await fetch(`${BASE_URL}/api/agents`, { headers: getHeaders() });
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
      agencyName: "",
      commissionRate: "",
    });
    setModalMode("add");
    setModalVisible(true);
  };

  const openEditModal = (agent) => {
    setForm({
      userId: agent.userId,
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      phno: agent.phno,
      password: "",
      dob: agent.dob,
      agencyName: agent.agencyName,
      commissionRate: agent.commissionRate,
    });
    setModalMode("edit");
    setModalVisible(true);
  };

  const openViewModal = (agent) => {
    setForm({
      userId: agent.userId,
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      phno: agent.phno,
      password: "******",
      dob: agent.dob,
      agencyName: agent.agencyName,
      commissionRate: agent.commissionRate,
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

    if (isNaN(parseFloat(form.commissionRate))) {
      alert("Commission Rate must be a number");
      return;
    }

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/api/agents/register`
        : `${BASE_URL}/api/agents/${form.userId}`;

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
    if (window.confirm("Are you sure you want to delete this agent?")) {
      await fetch(`${BASE_URL}/api/agents/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      load();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agents</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add Agent
      </button>

      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5 className="modal-title mb-3">
                {modalMode === "add" ? "Add Agent" : modalMode === "edit" ? "Edit Agent" : "View Agent"}
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
                <input
                  className="form-control mb-2"
                  placeholder="Agency Name"
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <input
                  type="number"
                  step="0.01"
                  className="form-control mb-2"
                  placeholder="Commission Rate"
                  value={form.commissionRate}
                  onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />

                <div className="d-flex justify-content-between">
                  {modalMode !== "view" && (
                    <button type="submit" className="btn btn-primary">
                      {modalMode === "add" ? "Add Agent" : "Save Changes"}
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
            <th>Agency</th>
            <th>Commission Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.userId}>
              <td>{a.userId}</td>
              <td>{a.firstName} {a.lastName}</td>
              <td>{a.email}</td>
              <td>{a.phno}</td>
              <td>{a.dob}</td>
              <td>{a.agencyName}</td>
              <td>{a.commissionRate}</td>
              <td>
                <button className="btn btn-info btn-sm me-1" onClick={() => openViewModal(a)}>View</button>
                <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(a)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Agents;
