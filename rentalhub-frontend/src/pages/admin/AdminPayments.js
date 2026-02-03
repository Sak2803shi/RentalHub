import { useEffect, useState } from "react";

const PAYMENT_URL = "http://localhost:8082/api/payments";

export default function AdminPayments() {
  const token = localStorage.getItem("token");

  const [payments, setPayments] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [showForm, setShowForm] = useState(false); // ⭐ NEW

  const [form, setForm] = useState({
    leaseId: "",
    customerUserId: "",
    ownerUserId: "",
    amount: "",
    paymentMethod: "UPI",
    status: "PAID",
  });

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error("API Error");
    return res.json();
  };

  const loadPayments = async () => {
    const data = await authFetch(PAYMENT_URL);
    setPayments(data);
  };

  useEffect(() => { loadPayments(); }, []);

  const handleInput = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();

    await authFetch(PAYMENT_URL, {
      method: "POST",
      body: JSON.stringify({
        leaseId: Number(form.leaseId),
        customerUserId: Number(form.customerUserId),
        ownerUserId: Number(form.ownerUserId),
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        status: form.status,
      }),
    });

    setForm({
      leaseId: "",
      customerUserId: "",
      ownerUserId: "",
      amount: "",
      paymentMethod: "UPI",
      status: "PAID",
    });

    setShowForm(false);
    loadPayments();
  };

  const handleDelete = async id => {
    await authFetch(`${PAYMENT_URL}/${id}`, { method: "DELETE" });
    loadPayments();
  };

  const handleStatusUpdate = async id => {
    const status = prompt("Enter new status:");
    if (!status) return;
    await authFetch(`${PAYMENT_URL}/${id}/status?status=${status}`, { method: "PUT" });
    loadPayments();
  };

  const handleSearch = async () => {
    if (!searchId) return;
    const data = await authFetch(`${PAYMENT_URL}/${searchId}`);
    setPayments([data]);
  };

  return (
    <div>
      <h3>Payment Management</h3>

      {/* ⭐ ADD PAYMENT BUTTON FIRST */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Payment"}
      </button>

      {/* ⭐ FORM SHOWS ONLY AFTER CLICK */}
      {showForm && (
        <form className="card p-3 mb-3" onSubmit={handleAdd}>
          <h5>Add Payment</h5>

          <input name="leaseId" placeholder="Lease ID" className="form-control mb-2" onChange={handleInput} required />
          <input name="customerUserId" placeholder="Customer ID" className="form-control mb-2" onChange={handleInput} required />
          <input name="ownerUserId" placeholder="Owner ID" className="form-control mb-2" onChange={handleInput} required />
          <input name="amount" placeholder="Amount" className="form-control mb-2" onChange={handleInput} required />

          <select name="paymentMethod" className="form-select mb-2" onChange={handleInput}>
            <option>UPI</option>
            <option>CARD</option>
            <option>CASH</option>
            <option>BANK_TRANSFER</option>
          </select>

          <select name="status" className="form-select mb-2" onChange={handleInput}>
            <option>PAID</option>
            <option>PENDING</option>
            <option>FAILED</option>
          </select>

          <button className="btn btn-primary">Submit Payment</button>
        </form>
      )}

      {/* SEARCH */}
      <div className="mb-3">
        <input
          placeholder="Search Payment by ID"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
        <button className="btn btn-secondary mt-2 ms-2" onClick={loadPayments}>Reset</button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Lease</th><th>Customer</th><th>Owner</th>
            <th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.paymentId}>
              <td>{p.paymentId}</td>
              <td>{p.leaseId}</td>
              <td>{p.customerUserId}</td>
              <td>{p.ownerUserId}</td>
              <td>₹ {p.amount}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.status}</td>
              <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleStatusUpdate(p.paymentId)}>Status</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.paymentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
