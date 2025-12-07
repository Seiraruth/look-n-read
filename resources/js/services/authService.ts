import axios, { AxiosInstance } from "axios";

interface LoginData {
    email: string;
    password: string;
}

interface Admin {
    id: number;
    name: string;
    email: string;
}

interface AuthResponse {
    message: string;
    token: string;
    admin: Admin;
}

const API_URL = "http://localhost:8000/api";

// Setup axios instance
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor untuk attach token ke setiap request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor untuk handle 401 response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            window.location.href = "/admin";
        }
        return Promise.reject(error);
    }
);

export const authService = {
    /**
     * Admin Login & simpan token
     */
    adminLogin: async (credentials: LoginData): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>(
            "/auth/admin/login",
            credentials
        );
        const data = response.data;

        // Simpan token ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));

        return data;
    },

    /**
     * Admin Logout & hapus token
     */
    adminLogout: async (): Promise<void> => {
        try {
            await axiosInstance.post("/auth/admin/logout");
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
        }
    },

    /**
     * Verify token & get admin info
     */
    getAdmin: async (): Promise<Admin> => {
        const response = await axiosInstance.get("/auth/admin/me");
        return response.data.admin;
    },

    /**
     * Get token dari localStorage
     */
    getToken: (): string | null => {
        return localStorage.getItem("token");
    },

    /**
     * Refresh admin token
     */
    refreshToken: async (): Promise<string> => {
        const response = await axiosInstance.post<{ token: string }>(
            "/auth/admin/refresh"
        );
        const token = response.data.token;
        localStorage.setItem("token", token);
        return token;
    },
};
