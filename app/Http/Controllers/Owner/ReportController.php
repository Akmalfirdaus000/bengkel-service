<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

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

        // All-time revenue (sejak bengkel beroperasi)
        $allTimeRevenue = Booking::where('status', Booking::STATUS_COMPLETED)
            ->sum('final_amount');

        // This month revenue
        $thisMonthRevenue = Booking::where('status', Booking::STATUS_COMPLETED)
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->sum('final_amount');

        // This month completed services
        $thisMonthCompleted = Booking::where('status', Booking::STATUS_COMPLETED)
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->count();

        // Total customers
        $totalCustomers = User::where('role', 'user')->count();

        return Inertia::render('owner/reports/index', [
            'overview' => [
                'total_revenue' => $revenue,
                'total_bookings' => $bookingsCount,
                'completed_bookings' => $completedBookings,
                'customer_growth' => $customerGrowth,
            ],
            'allTimeRevenue' => $allTimeRevenue,
            'thisMonthRevenue' => $thisMonthRevenue,
            'thisMonthCompleted' => $thisMonthCompleted,
            'totalCustomers' => $totalCustomers,
            'topServices' => $topServices,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Export business reports as PDF for owner.
     */
    public function exportPdf(Request $request)
    {
        $dateFrom = $request->get('date_from', null);
        $dateTo = $request->get('date_to', null);

        // Get bookings for the period - use booking_date for consistency
        $baseQuery = Booking::query();

        // Only apply date filter if provided
        if ($dateFrom && $dateTo) {
            $baseQuery->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }

        $bookingsByStatus = (clone $baseQuery)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $topVehiclesQuery = Booking::query();
        if ($dateFrom && $dateTo) {
            $topVehiclesQuery->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }
        $topVehicles = $topVehiclesQuery->selectRaw('vehicle_id, COUNT(*) as booking_count')
            ->with('vehicle')
            ->groupBy('vehicle_id')
            ->orderByDesc('booking_count')
            ->limit(10)
            ->get();

        $revenueQuery = Booking::where('status', 'completed');
        if ($dateFrom && $dateTo) {
            $revenueQuery->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }
        $revenueSummary = $revenueQuery->selectRaw('COUNT(*) as total_completed, SUM(final_amount) as total_revenue')
            ->first();

        $summary = (object)[
            'total_bookings' => (clone $baseQuery)->count()
        ];

        // Get detailed transactions with all relationships
        $transactionsQuery = Booking::with(['user', 'vehicle', 'mechanics', 'payments', 'serviceItems']);
        if ($dateFrom && $dateTo) {
            $transactionsQuery->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }
        $transactions = $transactionsQuery->orderBy('booking_date', 'desc')->get();

        // Use actual date range if no filter provided
        $displayDateFrom = $dateFrom;
        $displayDateTo = $dateTo;
        if (!$displayDateFrom && $transactions->count() > 0) {
            $displayDateFrom = $transactions->min('booking_date')->format('Y-m-d');
        }
        if (!$displayDateTo && $transactions->count() > 0) {
            $displayDateTo = $transactions->max('booking_date')->format('Y-m-d');
        }
        if (!$displayDateFrom) {
            $displayDateFrom = now()->startOfYear()->format('Y-m-d');
        }
        if (!$displayDateTo) {
            $displayDateTo = now()->format('Y-m-d');
        }

        $pdf = Pdf::loadView('pdf.report', [
            'bookings_by_status' => $bookingsByStatus,
            'top_vehicles' => $topVehicles,
            'revenue_summary' => $revenueSummary,
            'summary' => $summary,
            'transactions' => $transactions,
            'date_from' => $displayDateFrom,
            'date_to' => $displayDateTo,
        ])->setOptions(['defaultFont' => 'Helvetica']);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'Laporan-Bisnis-' . $dateFrom . '-ke-' . $dateTo . '.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="Laporan-Bisnis-' . $dateFrom . '-ke-' . $dateTo . '.pdf"'
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

    /**
     * Display transaction report for owner.
     */
    public function transactions(Request $request)
    {
        // Filter by date range - broader default to show data
        $dateFrom = $request->get('date_from', null);
        $dateTo = $request->get('date_to', null);

        // Build base query for summary
        $summaryQuery = Booking::query();

        // Apply date filter only if provided
        if ($dateFrom && $dateTo) {
            $summaryQuery->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }

        // Filter by status for summary
        if ($request->has('status') && $request->status !== 'all') {
            $summaryQuery->where('status', $request->status);
        }

        // Filter by payment status for summary
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $summaryQuery->where('payment_status', $request->payment_status);
        }

        // Calculate summary BEFORE pagination
        $summary = [
            'total_bookings' => (clone $summaryQuery)->count(),
            'total_revenue' => (clone $summaryQuery)->where('status', 'completed')->sum('final_amount'),
            'total_paid' => (clone $summaryQuery)->where('payment_status', 'paid')->sum('final_amount'),
            'total_unpaid' => (clone $summaryQuery)->where('payment_status', 'unpaid')->sum('final_amount'),
        ];

        // Query for pagination with relationships
        $query = Booking::with(['user', 'vehicle', 'mechanics', 'payments']);

        // Apply date filter only if provided
        if ($dateFrom && $dateTo) {
            $query->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->paginate(50);

        return Inertia::render('owner/reports/transactions', [
            'bookings' => $bookings,
            'summary' => $summary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'status' => $request->get('status', 'all'),
                'payment_status' => $request->get('payment_status', 'all'),
            ],
        ]);
    }

    /**
     * Export transaction report as PDF for owner.
     */
    public function exportTransactions(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Build query
        $query = Booking::with(['user', 'vehicle', 'mechanics', 'payments', 'serviceItems'])
            ->whereBetween('booking_date', [$dateFrom, $dateTo]);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->get();

        // Calculate summary from fetched data
        $summary = [
            'total_bookings' => $bookings->count(),
            'total_revenue' => $bookings->where('status', 'completed')->sum('final_amount'),
            'total_paid' => $bookings->where('payment_status', 'paid')->sum('final_amount'),
            'total_unpaid' => $bookings->where('payment_status', 'unpaid')->sum('final_amount'),
        ];

        $pdf = Pdf::loadView('pdf.transaction-report', [
            'bookings' => $bookings,
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ])->setOptions(['defaultFont' => 'Helvetica']);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'Laporan-Transaksi-' . $dateFrom . '-ke-' . $dateTo . '.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="Laporan-Transaksi-' . $dateFrom . '-ke-' . $dateTo . '.pdf"'
        ]);
    }

    /**
     * Display invoice payment report for owner.
     */
    public function invoices(Request $request)
    {
        // Filter by date range - broader default to show data
        $dateFrom = $request->get('date_from', null);
        $dateTo = $request->get('date_to', null);

        // Build base query for summary
        $summaryQuery = Booking::with(['user', 'vehicle', 'payments'])
            ->whereHas('payments');

        // Apply date filter only if provided
        if ($dateFrom && $dateTo) {
            $summaryQuery->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }

        // Filter by payment status for summary
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $summaryQuery->where('payment_status', $request->payment_status);
        }

        // Calculate summary BEFORE pagination
        $bookingsForSummary = $summaryQuery->get();

        // Get all payments for summary
        if ($dateFrom && $dateTo) {
            $payments = \App\Models\Payment::whereHas('booking', function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('booking_date', [$dateFrom, $dateTo]);
            })->get();
        } else {
            $payments = \App\Models\Payment::whereHas('booking', function ($q) {
                // No date filter, get all payments
            })->get();
        }

        $summary = [
            'total_invoices' => $bookingsForSummary->count(),
            'total_amount' => $bookingsForSummary->sum('final_amount'),
            'total_paid' => $payments->where('status', 'completed')->sum('amount'),
            'payment_methods' => $payments->groupBy('payment_method')->map(function ($group) {
                return $group->sum('amount');
            }),
        ];

        // Query for pagination
        $query = Booking::with(['user', 'vehicle', 'payments'])
            ->whereHas('payments');

        // Apply date filter only if provided
        if ($dateFrom && $dateTo) {
            $query->whereBetween('booking_date', [$dateFrom, $dateTo]);
        }

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->paginate(50);

        return Inertia::render('owner/reports/invoices', [
            'bookings' => $bookings,
            'summary' => $summary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'payment_status' => $request->get('payment_status', 'all'),
            ],
        ]);
    }

    /**
     * Export invoice payment report as PDF for owner.
     */
    public function exportInvoices(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        $query = Booking::with(['user', 'vehicle', 'payments'])
            ->whereHas('payments')
            ->whereBetween('booking_date', [$dateFrom, $dateTo]);

        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->get();

        $payments = \App\Models\Payment::whereHas('booking', function ($q) use ($dateFrom, $dateTo) {
            $q->whereBetween('booking_date', [$dateFrom, $dateTo]);
        })->get();

        $summary = [
            'total_invoices' => $bookings->count(),
            'total_amount' => $bookings->sum('final_amount'),
            'total_paid' => $payments->where('status', 'completed')->sum('amount'),
            'payment_methods' => $payments->groupBy('payment_method')->map(function ($group) {
                return $group->sum('amount');
            }),
        ];

        $pdf = Pdf::loadView('pdf.invoice-payment-report', [
            'bookings' => $bookings,
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ])->setOptions(['defaultFont' => 'Helvetica']);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'Laporan-Invoice-Pembayaran-' . $dateFrom . '-ke-' . $dateTo . '.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="Laporan-Invoice-Pembayaran-' . $dateFrom . '-ke-' . $dateTo . '.pdf"'
        ]);
    }
}
