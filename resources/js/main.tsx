import "./bootstrap";
import "../css/app.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/errors/NotFoutnd";
import FormAddComic from "./pages/admin/FormAddComic";
import AdminAuth from "./pages/auth/AdminAuth";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Guest Routes */}
                    <Route path="/" element={<div>HomePage</div>} />

                    {/* Admin Auth Routes */}
                    <Route path="/admin/login" element={<AdminAuth />} />
                    <Route
                        path="/admin"
                        element={<Navigate to="/admin/login" replace />}
                    />

                    {/* Admin Protected Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/add"
                        element={
                            <ProtectedRoute>
                                <FormAddComic />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("app");
if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
