<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display the owner reports index.
     */
    public function index(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Financial Overview
        $revenue = Booking::where('status', Booking::STATUS_COMPLETED)
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->sum('final_amount');

        $bookingsCount = Booking::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $completedBookings = Booking::where('status', Booking::STATUS_COMPLETED)
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->count();

        // Top Services by Revenue
        $topServices = DB::table('booking_service_items')
            ->join('service_items', 'booking_service_items.service_item_id', '=', 'service_items.id')
            ->join('bookings', 'booking_service_items.booking_id', '=', 'bookings.id')
            ->where('bookings.status', Booking::STATUS_COMPLETED)
            ->whereBetween('bookings.completed_at', [$dateFrom, $dateTo])
            ->select('service_items.name', DB::raw('SUM(booking_service_items.subtotal) as total_revenue'), DB::raw('COUNT(*) as total_sold'))
            ->groupBy('service_items.id', 'service_items.name')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get();

        // Customer Growth
        $customerGrowth = User::where('role', 'user')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        return Inertia::render('owner/reports/index', [
            'overview' => [
                'total_revenue' => $revenue,
                'total_bookings' => $bookingsCount,
                'completed_bookings' => $completedBookings,
                'customer_growth' => $customerGrowth,
            ],
            'topServices' => $topServices,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Display detailed revenue analytics.
     */
    public function revenue(Request $request)
    {
        $year = $request->get('year', now()->year);

        $monthlyRevenue = Booking::where('status', Booking::STATUS_COMPLETED)
            ->whereYear('completed_at', $year)
            ->selectRaw('MONTH(completed_at) as month, SUM(final_amount) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('owner/reports/revenue', [
            'revenueData' => $monthlyRevenue,
            'year' => $year,
        ]);
    }
}
