const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Auth ────────────────────────────────────────────────

export const register = async (email, password, lineId = "") => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, line_id: lineId }),
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.access_token) localStorage.setItem("token", data.access_token);
  return data;
};

export const logout = () => localStorage.removeItem("token");

// ─── Tasks ───────────────────────────────────────────────

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/`, { headers: getHeaders() });
  return res.json();
};

export const createTask = async (task) => {
  const res = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });
  return res.json();
};

export const updateTask = async (id, task) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });
  return res.json();
};

export const deleteTask = async (id) => {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
};

export const analyzeDashboard = async () => {
  const res = await fetch(`${API_URL}/tasks/analyze-dashboard`, {
    method: "POST",
    headers: getHeaders(),
  });
  return res.json();
};
