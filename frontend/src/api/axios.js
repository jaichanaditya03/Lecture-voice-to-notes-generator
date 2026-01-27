import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // Don't set default Content-Type - let axios handle it automatically
    // This allows FormData to use multipart/form-data and JSON to use application/json
    timeout: 600000, // 10 minutes (Render free tier can be slow + cold start)
});

export default api;
