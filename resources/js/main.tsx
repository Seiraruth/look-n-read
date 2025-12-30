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
import FormEditChapter from "./pages/admin/FormEditChapter";
import DetailPage from "./pages/guest/DetailPage";
import ReadChapter from "./pages/guest/ReadChapter";
import GenreComic from "./pages/guest/GenreComic";
import SearchComic from "./pages/guest/SearchComic";
import ContextProvider from "./context/Context";
import ListComic from "./pages/guest/ListComic";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/*****************  Guest Routes *****************/}
                    <Route path="/" element={<HomePage />} />

                    <Route
                        path="/comic-detail/:slug"
                        element={<DetailPage />}
                    />

                    <Route
                        path="/read/:slug/:chapterNumber"
                        element={<ReadChapter />}
                    />

                    <Route path="/genre/:slug" element={<GenreComic />} />

                    <Route path="/comics" element={<SearchComic />} />

                    <Route path="/list-comic" element={<ListComic />} />

                    {/*****************  Admin Routes *****************/}
                    <Route path="/admin/login" element={<AdminAuth />} />

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
                        path="/admin/edit/:slug"
                        element={
                            <ProtectedRoute>
                                <FormEditComic />
                            </ProtectedRoute>
                        }
                    />

                    {/* Route Chapters Admin */}
                    <Route
                        path="/admin/comics/:slug"
                        element={
                            <ProtectedRoute>
                                <Chapters />
                            </ProtectedRoute>
                        }
                    />

                    {/* Form Add Chapter Comic */}
                    <Route
                        path="/admin/comics/add/chapter/:slug/:id"
                        element={
                            <ProtectedRoute>
                                <FormAddChapter />
                            </ProtectedRoute>
                        }
                    />

                    {/* Form Edit Chapter Comic */}
                    <Route
                        path="/admin/comics/edit/chapter/:slug/:id"
                        element={
                            <ProtectedRoute>
                                <FormEditChapter />
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
            <ContextProvider>
                <App />
                <Toaster />
            </ContextProvider>
        </React.StrictMode>
    );
}
