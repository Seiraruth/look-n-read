import { useAuth } from "@/context/AuthContext";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoading, isAuthenticated } = useAuth();

    // Sedang loading - tampilkan spinner
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <img src="/assets/gifs/zoro-loading.gif" alt="Loading...." />
            </div>
        );
    }

    // Belum login - redirect ke login page
    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
}
