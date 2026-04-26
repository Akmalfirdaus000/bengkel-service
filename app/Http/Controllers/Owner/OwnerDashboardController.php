<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Mechanic;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerDashboardController extends Controller
{
    /**
     * Display the owner dashboard.
     */
    public function index(Request $request)
    {
        $stats = [
            'total_revenue' => Booking::where('status', Booking::STATUS_COMPLETED)->sum('final_amount'),
            'revenue_this_month' => Booking::where('status', Booking::STATUS_COMPLETED)
                ->whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->sum('final_amount'),
            'total_bookings' => Booking::count(),
            'completed_bookings' => Booking::where('status', Booking::STATUS_COMPLETED)->count(),
            'total_customers' => User::where('role', 'user')->count(),
            'total_mechanics' => Mechanic::count(),
        ];

        // Monthly revenue for the last 6 months
        $revenueHistory = Booking::where('status', Booking::STATUS_COMPLETED)
            ->where('completed_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(completed_at, "%Y-%m") as month, SUM(final_amount) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent high-value bookings
        $recentHighValueBookings = Booking::with(['user', 'vehicle'])
            ->where('status', Booking::STATUS_COMPLETED)
            ->orderBy('final_amount', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('owner/dashboard', [
            'stats' => $stats,
            'revenueHistory' => $revenueHistory,
            'recentHighValueBookings' => $recentHighValueBookings,
        ]);
    }

    /**
     * Display workshop operational status for owner.
     */
    public function workshopStatus()
    {
        $activeStatuses = Booking::activeStatuses();
        
        $bookings = Booking::whereIn('status', $activeStatuses)
            ->with(['user', 'vehicle', 'mechanics'])
            ->orderBy('booking_date')
            ->get();

        return Inertia::render('owner/workshop-status', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Display mechanic performance report for owner.
     */
    public function mechanicPerformance()
    {
        $mechanics = Mechanic::withCount(['bookings' => function($query) {
                $query->where('status', Booking::STATUS_COMPLETED);
            }])
            ->get();

        return Inertia::render('owner/mechanics/performance', [
            'mechanics' => $mechanics,
        ]);
    }
}
