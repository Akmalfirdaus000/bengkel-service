<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsOwner
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || (!auth()->user()->isOwner() && !auth()->user()->isAdmin())) {
            // Owner can see owner pages, admin can also see them for management
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
