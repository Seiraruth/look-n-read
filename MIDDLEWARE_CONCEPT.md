# 🔐 Konsep Middleware Auth - React + Laravel

## Overview

Sistem authentication untuk aplikasi **Look 'N Read** dengan dua tier akses:

-   **Admin**: Kelola komik, chapter, genre (butuh login)
-   **Guest**: Hanya baca komik & chapter (tidak perlu login)

Backend: Laravel REST API + Middleware
Frontend: React + Protected Routes

---

## BACKEND - Laravel (REST API)

### 1. Database Schema

```php
// database/migrations/2024_01_01_create_users_table.php
// HANYA untuk Admin - Guest tidak perlu account
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');              // Nama admin
    $table->string('email')->unique();   // Email login (unique)
    $table->string('password');          // Password terenkripsi
    $table->timestamps();
    $table->softDeletes();               // Soft delete untuk audit
});
```

**Catatan:**

-   Tabel `users` **HANYA untuk Admin** - tidak ada guest account
-   Guest adalah **public access** tanpa authentication
-   Admin menggunakan **Sanctum tokens** untuk API authentication

### 2. Auth Controller (Login/Logout)

```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Admin Login - return token
     * POST /api/auth/admin/login
     */
    public function adminLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        // Cek apakah admin ada dan password benar
        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        $admin = Auth::user();

        // Generate token menggunakan Sanctum
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ]
        ], 200);
    }

    /**
     * Admin Logout - invalidate token
     * POST /api/auth/admin/logout
     */
    public function adminLogout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ], 200);
    }

    /**
     * Verify token & get admin info
     * GET /api/auth/admin/me
     */
    public function adminMe(Request $request)
    {
        return response()->json([
            'admin' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ]
        ], 200);
    }

    /**
     * Refresh admin token
     * POST /api/auth/admin/refresh
     */
    public function adminRefresh(Request $request)
    {
        $admin = $request->user();

        // Invalidate old token
        $admin->currentAccessToken()->delete();

        // Create new token
        $newToken = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed',
            'token' => $newToken,
        ], 200);
    }
}
```

### 3. Middleware untuk Protect Admin Routes

```php
// app/Http/Middleware/AdminAuth.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth
{
    /**
     * Middleware untuk check apakah request adalah dari admin yang authenticated
     * Gunakan di admin routes
     */
    public function handle(Request $request, Closure $next)
    {
        // Cek apakah user authenticated (punya valid token)
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthorized - Silakan login terlebih dahulu'
            ], 401);
        }

        // User yang authenticated pasti admin (karena hanya admin punya account)
        return $next($request);
    }
}
```

**Catatan:**

-   Middleware ini **hanya check authentication**, bukan authorization (role check)
-   Karena hanya admin yang bisa login, setiap user yang authenticated = admin
-   Jika di masa depan ada multiple roles, tambahkan role check di sini

````

### 4. Routes dengan Middleware

```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ComicController;
use App\Http\Controllers\GenreController;

// ============================================================
// PUBLIC/GUEST Routes (tidak butuh authentication)
// ============================================================

// Komik - Guest Read Only
Route::prefix('guest')->group(function () {
    Route::get('/comics', [ComicController::class, 'index']);
    Route::get('/comics/{slug}', [ComicController::class, 'show']);
    Route::get('/chapters/{id}', [ComicController::class, 'getChapter']);
    Route::get('/genres', [GenreController::class, 'index']);
});

// ============================================================
// ADMIN Authentication Routes (public, untuk login/logout)
// ============================================================

Route::prefix('auth/admin')->group(function () {
    Route::post('/login', [AuthController::class, 'adminLogin']);
    Route::post('/logout', [AuthController::class, 'adminLogout'])
        ->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'adminMe'])
        ->middleware('auth:sanctum');
    Route::post('/refresh', [AuthController::class, 'adminRefresh'])
        ->middleware('auth:sanctum');
});

// ============================================================
// ADMIN PROTECTED Routes (butuh token authentication)
// ============================================================

Route::prefix('admin')->middleware('auth:sanctum', 'admin.auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Comic Management
    Route::post('/comics', [AdminController::class, 'storeComic']);
    Route::put('/comics/{id}', [AdminController::class, 'updateComic']);
    Route::delete('/comics/{id}', [AdminController::class, 'deleteComic']);
    Route::get('/comics/{id}', [AdminController::class, 'editComic']);
    Route::get('/comics', [AdminController::class, 'listComics']);

    // Chapter Management
    Route::post('/comics/{id}/chapters', [AdminController::class, 'storeChapter']);
    Route::put('/chapters/{id}', [AdminController::class, 'updateChapter']);
    Route::delete('/chapters/{id}', [AdminController::class, 'deleteChapter']);
    Route::post('/chapters/{id}/upload-pages', [AdminController::class, 'uploadPages']);

    // Genre Management
    Route::post('/genres', [GenreController::class, 'store']);
    Route::put('/genres/{id}', [GenreController::class, 'update']);
    Route::delete('/genres/{id}', [GenreController::class, 'destroy']);
});
````

### 5. Daftar Middleware di Kernel

```php
// app/Http/Kernel.php
protected $routeMiddleware = [
    // ... middleware lainnya
    'admin.auth' => \App\Http\Middleware\AdminAuth::class,
];
```

---

## FRONTEND - React

### 1. API Service untuk Auth (dengan Axios)

```typescript
// src/services/authService.ts
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
            "/auth/login",
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
            await axiosInstance.post("/auth/logout");
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
            "/auth/refresh"
        );
        const token = response.data.token;
        localStorage.setItem("token", token);
        return token;
    },
};
```

### 2. Auth Context (Manage State)

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/authService";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
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
```

### 3. Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string; // 'admin', 'editor', dll
}

export function ProtectedRoute({
    children,
    requiredRole,
}: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();

    // Sedang loading - tampilkan spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    // Belum login - redirect ke login page
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Butuh role tertentu tapi user tidak punya - redirect ke dashboard
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
}
```

### 4. Login Page

```typescript
// src/pages/admin/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await adminLogin(email, password);
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Email atau password salah");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}
```

### 5. Admin Dashboard

```typescript
// src/pages/admin/DashboardPage.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/admin");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">
                                Welcome, {admin?.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stats Cards */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-gray-600 font-semibold">
                            Total Comics
                        </h2>
                        <p className="text-3xl font-bold mt-2">12</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-gray-600 font-semibold">
                            Total Chapters
                        </h2>
                        <p className="text-3xl font-bold mt-2">45</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-gray-600 font-semibold">
                            Total Views
                        </h2>
                        <p className="text-3xl font-bold mt-2">1,234</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Add New Comic
                        </button>
                        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                            Manage Genres
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
```

### 6. Main App Router Setup

```typescript
// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/admin/LoginPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { HomePage } from "./pages/guest/HomePage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Guest Routes */}
                    <Route path="/" element={<HomePage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<LoginPage />} />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
```

### 7. Usage Example - Fetch Comics (dengan Axios)

```typescript
// src/services/comicService.ts
import { axiosInstance } from "./authService";

interface Comic {
    id: number;
    title: string;
    slug: string;
    synopsis: string;
    author: string;
    cover_image: string;
    status: string;
}

export const comicService = {
    /**
     * Get semua comics (Guest API)
     */
    getComics: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get<{ comics: Comic[] }>(
            "/comics",
            {
                params: { page, limit },
            }
        );
        return response.data.comics;
    },

    /**
     * Get detail comic by slug (Guest API)
     */
    getComicBySlug: async (slug: string) => {
        const response = await axiosInstance.get<{ comic: Comic }>(
            `/comics/${slug}`
        );
        return response.data.comic;
    },

    /**
     * Create comic (Admin API)
     */
    createComic: async (data: FormData) => {
        const response = await axiosInstance.post<{ comic: Comic }>(
            "/admin/comics",
            data,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data.comic;
    },

    /**
     * Update comic (Admin API)
     */
    updateComic: async (id: number, data: Partial<Comic>) => {
        const response = await axiosInstance.put<{ comic: Comic }>(
            `/admin/comics/${id}`,
            data
        );
        return response.data.comic;
    },

    /**
     * Delete comic (Admin API)
     */
    deleteComic: async (id: number) => {
        await axiosInstance.delete(`/admin/comics/${id}`);
    },
};
```

**Keuntungan Axios vs Fetch:**

-   ✅ Auto serialize/deserialize JSON
-   ✅ Request/Response interceptors built-in (untuk attach token & handle 401)
-   ✅ Timeout support
-   ✅ Upload dengan FormData lebih mudah & clean
-   ✅ Cancel request support
-   ✅ Smaller bundle size
-   ✅ Better error handling

**Install Axios:**

```bash
npm install axios
```

---

## FLOW DIAGRAM

```
USER MEMBUKA APP
    ↓
AuthContext.useEffect -> checkAuth()
    ↓
Cek localStorage apakah ada token?
    ├─ ADA token? -> Verify ke backend (/api/auth/me)
    │  ├─ Valid -> set user state ✅
    │  └─ Invalid -> clear storage, set user = null
    └─ TIDAK ada? -> set user = null
    ↓
Render routes berdasarkan user state
    ├─ user === null -> hanya bisa akses /admin/login & /
    └─ user !== null -> bisa akses /admin/dashboard (jika role='admin')


USER LOGIN
    ↓
Form submit ke /api/auth/login
    ↓
Laravel return token + user data
    ↓
React simpan token ke localStorage
    ↓
Set user state di AuthContext
    ↓
Navigate ke /admin/dashboard
    ↓
ProtectedRoute check: user ada? role admin? ✅
    ↓
Render DashboardPage


USER LOGOUT
    ↓
Call /api/auth/logout (invalidate token)
    ↓
React clear localStorage
    ↓
Clear user state
    ↓
Navigate ke /admin/login


USER AKSES /admin/dashboard TANPA LOGIN
    ↓
ProtectedRoute check: isAuthenticated?
    ├─ FALSE -> Navigate to /admin/login
    └─ TRUE -> Render page
```

---

## POIN PENTING

✅ **Token Storage**: localStorage aman untuk dev, tapi production gunakan secure http-only cookies
✅ **Middleware Layer**: Backend HARUS validate token - jangan trust frontend saja
✅ **Error Handling**: 401 = token invalid, 403 = permission denied
✅ **Auto Logout**: Jika token expired, redirect ke login
✅ **Refresh Token**: Implementasikan token refresh untuk UX yang lebih smooth
