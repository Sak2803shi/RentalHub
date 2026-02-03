// src/components/PaymentPage.jsx

import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  addPayment,
  deletePayment,
  updateStatus,
} from "../services/paymentService";

export default function PaymentPage() {
  const role = localStorage.getItem("role"); // ADMIN / OWNER

  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    leaseId: "",
    customerUserId: "",
    ownerUserId: "",
    amount: "",
    paymentMethod: "",
    status: "",
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res.data);
    } catch (error) {
      alert("Failed to load payments");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.leaseId ||
      !form.customerUserId ||
      !form.ownerUserId ||
      !form.amount ||
      !form.paymentMethod ||
      !form.status
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addPayment({
        leaseId: Number(form.leaseId),
        customerUserId: Number(form.customerUserId),
        ownerUserId: Number(form.ownerUserId),
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        status: form.status,
      });

      alert("Payment added successfully!");
      setForm({
        leaseId: "",
        customerUserId: "",
        ownerUserId: "",
        amount: "",
        paymentMethod: "",
        status: "",
      });

      loadPayments();
    } catch (error) {
      alert("Failed to add payment");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      await deletePayment(id);
      alert("Payment deleted successfully");
      loadPayments();
    } catch (error) {
      alert("Failed to delete payment");
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id) => {
    const newStatus = prompt("Enter new status:");
    if (!newStatus) return;

    try {
      await updateStatus(id, newStatus);
      alert("Status updated successfully");
      loadPayments();
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Payment Management</h2>

      {(role === "ADMIN" || role === "OWNER") && (
        <form onSubmit={handleSubmit} className="card p-3 mb-4">
          <h5>Add Payment</h5>

          <input
            type="number"
            placeholder="Lease ID"
            className="form-control mb-2"
            value={form.leaseId}
            onChange={(e) => setForm({ ...form, leaseId: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Customer User ID"
            className="form-control mb-2"
            value={form.customerUserId}
            onChange={(e) => setForm({ ...form, customerUserId: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Owner User ID"
            className="form-control mb-2"
            value={form.ownerUserId}
            onChange={(e) => setForm({ ...form, ownerUserId: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            className="form-control mb-2"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Payment Method"
            className="form-control mb-2"
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Status"
            className="form-control mb-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            required
          />

          <button className="btn btn-primary">Add Payment</button>
        </form>
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Lease ID</th>
            <th>Customer User ID</th>
            <th>Owner User ID</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.paymentId}>
              <td>{p.paymentId}</td>
              <td>{p.leaseId}</td>
              <td>{p.customerUserId}</td>
              <td>{p.ownerUserId}</td>
              <td>{p.amount}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.status}</td>
              <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}</td>
              <td>
                {role === "ADMIN" && (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleStatusUpdate(p.paymentId)}
                    >
                      Update Status
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.paymentId)}
                    >
                      Delete
                    </button>
                  </>
                )}

                {role === "OWNER" && <span className="text-muted">View Only</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
