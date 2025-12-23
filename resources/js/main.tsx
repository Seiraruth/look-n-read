import "./bootstrap";
import "../css/app.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/errors/NotFoutnd";
import FormAddComic from "./pages/admin/FormAddComic";
import AdminAuth from "./pages/auth/AdminAuth";
import HomePage from "./pages/guest/HomePage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import FormEditComic from "./pages/admin/FormEditComic";
import { Toaster } from "./components/ui/sonner";
import Chapters from "./pages/admin/Chapters";
import FormAddChapter from "./pages/admin/FormAddChapter";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Guest Routes */}
                    <Route path="/" element={<HomePage />} />

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

                    {/* Route Add Form Admin */}
                    <Route
                        path="/admin/add"
                        element={
                            <ProtectedRoute>
                                <FormAddComic />
                            </ProtectedRoute>
                        }
                    />

                    {/* Route Edit Form Admin */}
                    <Route
                        path="/admin/edit/:id"
                        element={
                            <ProtectedRoute>
                                <FormEditComic />
                            </ProtectedRoute>
                        }
                    />

                    {/* Route Chapters Admin */}
                    <Route
                        path="/admin/comics/:id"
                        element={
                            <ProtectedRoute>
                                <Chapters />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/comics/:id/chapters"
                        element={
                            <ProtectedRoute>
                                <FormAddChapter />
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
            <Toaster />
        </React.StrictMode>
    );
}
