import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const savedUser = localStorage.getItem("smartspend_user");

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);

                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error("Failed to parse saved user:", error);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;