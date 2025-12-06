import "./bootstrap";
import "../css/app.css";
import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./pages/admin/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/errors/NotFoutnd";
import FormAddComic from "./pages/admin/FormAddComic";
import AdminAuth from "./pages/auth/AdminAuth";

const router = createBrowserRouter([
    {
        path: "/",
        element: "<h1>Hello World</h1>",
    },
    {
        path: "/admin",
        element: <AdminAuth />,
    },
    {
        path: "/admin/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/admin/add",
        element: <FormAddComic />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

const rootElement = document.getElementById("app");
if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}
