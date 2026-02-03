import { useEffect, useState } from "react";
import { BASE_URL, getHeaders } from "../../utils/api";

function Properties() {
  const [list, setList] = useState([]);
  const [owners, setOwners] = useState([]);
  const [agents, setAgents] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view

  const [form, setForm] = useState({
    propertyId: null,
    title: "",
    description: "",
    address: "",
    rentAmount: "",
    propertyType: "",
    isAvailable: true,
    ownerId: "",
    agentId: "",
  });

  const load = async () => {
    const [propertiesRes, ownersRes, agentsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/properties`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/api/owners`, { headers: getHeaders() }),
      fetch(`${BASE_URL}/api/agents`, { headers: getHeaders() }),
    ]);
    setList(await propertiesRes.json());
    setOwners(await ownersRes.json());
    setAgents(await agentsRes.json());
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setForm({
      propertyId: null,
      title: "",
      description: "",
      address: "",
      rentAmount: "",
      propertyType: "",
      isAvailable: true,
      ownerId: "",
      agentId: "",
    });
    setModalMode("add");
    setModalVisible(true);
  };

  const openEditModal = (p) => {
    setForm({
      propertyId: p.propertyId,
      title: p.title,
      description: p.description,
      address: p.address,
      rentAmount: p.rentAmount,
      propertyType: p.propertyType,
      isAvailable: p.isAvailable,
      ownerId: p.ownerId || "",
      agentId: p.agentId || "",
    });
    setModalMode("edit");
    setModalVisible(true);
  };

  const openViewModal = (p) => {
    setForm({
      propertyId: p.propertyId,
      title: p.title,
      description: p.description,
      address: p.address,
      rentAmount: p.rentAmount,
      propertyType: p.propertyType,
      isAvailable: p.isAvailable,
      ownerId: p.ownerId || "",
      agentId: p.agentId || "",
    });
    setModalMode("view");
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.address || !form.propertyType || !form.ownerId) {
      alert("Please fill all required fields");
      return;
    }
    if (isNaN(parseFloat(form.rentAmount))) {
      alert("Rent Amount must be a number");
      return;
    }

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/api/properties`
        : `${BASE_URL}/api/properties/${form.propertyId}`;

    await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        address: form.address,
        rentAmount: parseFloat(form.rentAmount),
        propertyType: form.propertyType,
        isAvailable: form.isAvailable,
        ownerId: parseInt(form.ownerId),
        agentId: form.agentId ? parseInt(form.agentId) : null,
      }),
    });

    setModalVisible(false);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      await fetch(`${BASE_URL}/api/properties/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      load();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Properties</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add Property
      </button>

      {modalVisible && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="modal-title mb-3">
                {modalMode === "add" ? "Add Property" : modalMode === "edit" ? "Edit Property" : "View Property"}
              </h5>

              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                  rows={3}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <input
                  type="number"
                  step="0.01"
                  className="form-control mb-2"
                  placeholder="Rent Amount"
                  value={form.rentAmount}
                  onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Property Type"
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  required
                  disabled={modalMode === "view"}
                />

                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isAvailable"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    disabled={modalMode === "view"}
                  />
                  <label htmlFor="isAvailable" className="form-check-label">
                    Available
                  </label>
                </div>

                <select
                  className="form-select mb-2"
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                  disabled={modalMode === "view"}
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map((o) => (
                    <option key={o.userId} value={o.userId}>
                      {o.firstName} {o.lastName}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select mb-2"
                  value={form.agentId || ""}
                  onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  disabled={modalMode === "view"}
                >
                  <option value="">Select Agent (optional)</option>
                  {agents.map((a) => (
                    <option key={a.userId} value={a.userId}>
                      {a.firstName} {a.lastName}
                    </option>
                  ))}
                </select>

                <div className="d-flex justify-content-between">
                  {modalMode !== "view" && (
                    <button type="submit" className="btn btn-primary">
                      {modalMode === "add" ? "Add Property" : "Save Changes"}
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
            <th>Title</th>
            <th>Description</th>
            <th>Address</th>
            <th>Rent</th>
            <th>Type</th>
            <th>Available</th>
            <th>Owner</th>
            <th>Agent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.propertyId}>
              <td>{p.propertyId}</td>
              <td>{p.title}</td>
              <td>{p.description}</td>
              <td>{p.address}</td>
              <td>{p.rentAmount}</td>
              <td>{p.propertyType}</td>
              <td>{p.isAvailable ? "Yes" : "No"}</td>
              <td>{p.ownerName}</td>
              <td>{p.agentName || "-"}</td>
              <td>
                <button className="btn btn-info btn-sm me-1" onClick={() => openViewModal(p)}>
                  View
                </button>
                <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(p)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.propertyId)}>
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

export default Properties;
