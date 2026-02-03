const BASE_URL = "http://localhost:8082/api/payments";

// Helper function to get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getAllPayments = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }
  return response.json();
};

export const addPayment = async (payment) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payment),
  });
  if (!response.ok) {
    throw new Error("Failed to add payment");
  }
  return response.json();
};

export const deletePayment = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete payment");
  }
  return response.json();
};

export const updateStatus = async (id, newStatus) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) {
    throw new Error("Failed to update status");
  }
  return response.json();
};
