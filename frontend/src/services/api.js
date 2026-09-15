import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tnea_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

export const studentAPI = {
  getProfile: () => api.get("/student/profile"),
  updateProfile: (data) => api.put("/student/profile", data),
};

export const cutoffAPI = {
  calculate: (marks) => api.post("/cutoff/calculate", marks),
  predict: (params) => api.post("/cutoff/predict", params),
  getMlMetrics: () => api.get("/cutoff/ml-metrics"),
};

export const collegesAPI = {
  list: (params) => api.get("/colleges", { params }),
  getById: (id) => api.get(`/colleges/${id}`),
  getPlacements: (id) => api.get(`/colleges/${id}/placements`),
  getHostel: (id) => api.get(`/colleges/${id}/hostel`),
  getFees: (id) => api.get(`/colleges/${id}/fees`),
};

export const recommendationsAPI = {
  get: (profileData) => api.post("/recommendations", profileData || {}),
};

export const compareAPI = {
  compare: (collegeIds, profile) =>
    api.post("/compare", { college_ids: collegeIds, student_profile: profile }),
};

export const chatAPI = {
  sendMessage: (message, studentProfile) =>
    api.post("/chat", { message, student_profile: studentProfile }),
};

export const adminAPI = {
  getStatus: () => api.get("/admin/status"),
  retrain: () => api.post("/admin/retrain"),
};

export default api;
