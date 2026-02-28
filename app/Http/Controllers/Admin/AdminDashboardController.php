<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Mechanic;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request)
    {
        $activeStatuses = Booking::activeStatuses();
        $waitingStatuses = Booking::waitingStatuses();
        $servicingStatuses = [Booking::STATUS_IN_PROGRESS, Booking::STATUS_READY_TO_PICKUP];

        $stats = [
            'total_bookings' => Booking::whereIn('status', $activeStatuses)->count(),
            'today_bookings' => Booking::today()->whereIn('status', $activeStatuses)->count(),
            'pending_bookings' => Booking::where('status', Booking::STATUS_PENDING)->count(),
            'need_action_bookings' => Booking::whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])->count(),
            'waiting_bookings' => Booking::whereIn('status', $waitingStatuses)->count(),
            'in_progress_bookings' => Booking::whereIn('status', $servicingStatuses)->count(),
            'completed_bookings' => Booking::where('status', Booking::STATUS_COMPLETED)->count(),
            'total_mechanics' => Mechanic::active()->count(),
            'active_services' => Service::active()->count(),
        ];

        // Revenue for current month
        $revenueThisMonth = Booking::where('status', Booking::STATUS_COMPLETED)
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->sum('final_amount');

        $stats['revenue_this_month'] = $revenueThisMonth;

        // Today's bookings
        $todayBookings = Booking::today()
            ->whereIn('status', $activeStatuses)
            ->with(['user', 'vehicle', 'mechanics'])
            ->orderBy('booking_date')
            ->get();

        // Recent bookings
        $recentBookings = Booking::with(['user', 'vehicle'])
            ->whereIn('status', $activeStatuses)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Revenue for last 7 days
        $revenueLast7Days = Booking::where('status', Booking::STATUS_COMPLETED)
            ->where('completed_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(completed_at) as date, SUM(final_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('admin/admin-dashboard', [
            'stats' => $stats,
            'todayBookings' => $todayBookings,
            'recentBookings' => $recentBookings,
            'revenueChart' => $revenueLast7Days,
        ]);
    }
}
