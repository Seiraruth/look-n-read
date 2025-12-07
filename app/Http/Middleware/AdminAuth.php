<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
