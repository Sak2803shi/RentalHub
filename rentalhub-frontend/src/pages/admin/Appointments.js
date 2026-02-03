import { useEffect, useState } from "react";
import { BASE_URL, getHeaders } from "../../utils/api";

function Appointments() {
  const [list, setList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [agents, setAgents] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view

  const [form, setForm] = useState({
    appointmentId: null,
    customerId: "",
    propertyId: "",
    ownerId: "",
    agentId: "",
  });

  const load = async () => {
    try {
      const [appRes, custRes, propRes, ownRes, agentRes] = await Promise.all([
        fetch(`${BASE_URL}/api/appointments`, { headers: getHeaders() }),
        fetch(`${BASE_URL}/api/customers`, { headers: getHeaders() }),
        fetch(`${BASE_URL}/api/properties`, { headers: getHeaders() }),
        fetch(`${BASE_URL}/api/owners`, { headers: getHeaders() }),
        fetch(`${BASE_URL}/api/agents`, { headers: getHeaders() }),
      ]);
      setList(await appRes.json());
      setCustomers(await custRes.json());
      setProperties(await propRes.json());
      setOwners(await ownRes.json());
      setAgents(await agentRes.json());
    } catch (error) {
      alert("Failed to load data: " + error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setForm({
      appointmentId: null,
      customerId: "",
      propertyId: "",
      ownerId: "",
      agentId: "",
    });
    setModalMode("add");
    setModalVisible(true);
  };

  const openEditModal = (a) => {
    setForm({
      appointmentId: a.appointmentId,
      customerId: a.customerId,
      propertyId: a.propertyId,
      ownerId: a.ownerId || "",
      agentId: a.agentId || "",
    });
    setModalMode("edit");
    setModalVisible(true);
  };

  const openViewModal = (a) => {
    setForm({
      appointmentId: a.appointmentId,
      customerId: a.customerId,
      propertyId: a.propertyId,
      ownerId: a.ownerId || "",
      agentId: a.agentId || "",
    });
    setModalMode("view");
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerId || !form.propertyId) {
      alert("Customer and Property are required");
      return;
    }

    const method = modalMode === "add" ? "POST" : "PUT";
    const url =
      modalMode === "add"
        ? `${BASE_URL}/api/appointments`
        : `${BASE_URL}/api/appointments/${form.appointmentId}`;

    try {
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          customerId: parseInt(form.customerId),
          propertyId: parseInt(form.propertyId),
          ownerId: form.ownerId ? parseInt(form.ownerId) : null,
          agentId: form.agentId ? parseInt(form.agentId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        return;
      }

      setModalVisible(false);
      load();
    } catch (error) {
      alert("Network or server error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/appointments/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || response.statusText}`);
          return;
        }
        load();
      } catch (error) {
        alert("Network or server error: " + error.message);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Appointments</h2>
      <button className="btn btn-primary mb-3" onClick={openAddModal}>
        Add Appointment
      </button>

      {modalVisible && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="modal-title mb-3">
                {modalMode === "add"
                  ? "Add Appointment"
                  : modalMode === "edit"
                  ? "Edit Appointment"
                  : "View Appointment"}
              </h5>

              <form onSubmit={handleSubmit}>
                <select
                  className="form-select mb-2"
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
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
                  value={form.ownerId || ""}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                  disabled={modalMode === "view"}
                >
                  <option value="">Select Owner (optional)</option>
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
                      {modalMode === "add" ? "Add Appointment" : "Save Changes"}
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
            <th>Customer</th>
            <th>Property</th>
            <th>Handled By</th>
            <th>Handler Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.appointmentId}>
              <td>{a.appointmentId}</td>
              <td>{a.customerName}</td>
              <td>{a.propertyTitle}</td>
              <td>{a.handledBy}</td>
              <td>{a.handlerName}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-1"
                  onClick={() => openViewModal(a)}
                >
                  View
                </button>
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => openEditModal(a)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(a.appointmentId)}
                >
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

export default Appointments;
