<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the reports index.
     */
    public function index(Request $request)
    {
        // Get default date range (current month)
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Booking statistics
        $bookingsByStatus = Booking::whereBetween('created_at', [$dateFrom, $dateTo])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Top vehicles
        $topVehicles = Booking::selectRaw('vehicle_id, COUNT(*) as booking_count')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with('vehicle')
            ->groupBy('vehicle_id')
            ->orderByDesc('booking_count')
            ->limit(10)
            ->get();

        // Revenue summary
        $revenueSummary = Booking::where('status', 'completed')
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->selectRaw('
                COUNT(*) as total_completed,
                SUM(final_amount) as total_revenue,
                AVG(final_amount) as avg_revenue
            ')
            ->first();

        return Inertia::render('admin/reports/index', [
            'bookingsByStatus' => $bookingsByStatus,
            'topVehicles' => $topVehicles,
            'revenueSummary' => $revenueSummary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Display revenue report.
     */
    public function revenue(Request $request)
    {
        $period = $request->get('period', 'monthly'); // daily, weekly, monthly, yearly

        $query = Booking::where('status', 'completed')
            ->selectRaw('DATE(completed_at) as date, SUM(final_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date');

        // Apply date filtering based on period
        switch ($period) {
            case 'daily':
                $query->where('completed_at', '>=', now()->subDays(30));
                break;
            case 'weekly':
                $query->where('completed_at', '>=', now()->subWeeks(12));
                break;
            case 'monthly':
                $query->where('completed_at', '>=', now()->subYear(1));
                break;
            case 'yearly':
                $query->where('completed_at', '>=', now()->subYears(5));
                break;
        }

        $revenueData = $query->get();

        return Inertia::render('admin/reports/revenue', [
            'revenueData' => $revenueData,
            'period' => $period,
        ]);
    }
}
