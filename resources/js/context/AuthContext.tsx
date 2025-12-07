import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/authService";

interface Admin {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    admin: Admin | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    adminLogin: (email: string, password: string) => Promise<void>;
    adminLogout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Check apakah admin sudah login
     * Jalankan saat app pertama kali load
     */
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = authService.getToken();

            if (!token) {
                setAdmin(null);
                setIsLoading(false);
                return;
            }

            // Verify token dengan backend
            const adminData = await authService.getAdmin();
            setAdmin(adminData);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            setAdmin(null);
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.adminLogin({ email, password });
            setAdmin(response.admin);
        } finally {
            setIsLoading(false);
        }
    };

    const adminLogout = async () => {
        setIsLoading(true);
        try {
            await authService.adminLogout();
            setAdmin(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                isLoading,
                isAuthenticated: !!admin,
                adminLogin,
                adminLogout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth harus digunakan dalam AuthProvider");
    }
    return context;
}
