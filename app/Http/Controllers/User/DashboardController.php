<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'active_bookings' => Booking::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'confirmed', 'assigned', 'in_progress'])
                ->count(),
            'completed_bookings' => Booking::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
            'total_vehicles' => Vehicle::where('user_id', $user->id)
                ->active()
                ->count(),
        ];

        $activeBookings = Booking::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'assigned', 'in_progress'])
            ->with(['vehicle', 'services'])
            ->orderBy('booking_date')
            ->get();

        $recentBookings = Booking::where('user_id', $user->id)
            ->with(['vehicle', 'services'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('user/user-dashboard', [
            'stats' => $stats,
            'activeBookings' => $activeBookings,
            'recentBookings' => $recentBookings,
        ]);
    }
}
