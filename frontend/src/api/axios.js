import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // Don't set default Content-Type - let axios handle it automatically
    // This allows FormData to use multipart/form-data and JSON to use application/json
    timeout: 180000,
});

export default api;
