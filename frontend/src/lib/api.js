import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5678",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.REACT_APP_API_KEY,
  },
});

export default api;
