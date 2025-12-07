<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Admin Login - return token
     * POST /api/auth/admin/login
     */
    public function adminLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8']
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
