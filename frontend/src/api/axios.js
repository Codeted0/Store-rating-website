import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to include JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(); // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
