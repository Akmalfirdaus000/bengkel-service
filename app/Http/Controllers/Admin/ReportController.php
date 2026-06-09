<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * Display the reports index.
     */
    public function index(Request $request)
    {
        // Get default date range - broader range to show data
        $dateFrom = $request->get('date_from', now()->startOfYear()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfDay()->toDateString());

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

        // Revenue summary for filtered period
        $revenueSummary = Booking::where('status', 'completed')
            ->whereBetween('completed_at', [$dateFrom, $dateTo])
            ->selectRaw('
                COUNT(*) as total_completed,
                SUM(final_amount) as total_revenue,
                AVG(final_amount) as avg_revenue
            ')
            ->first();

        // All-time revenue (sejak bengkel beroperasi)
        $allTimeRevenue = Booking::where('status', 'completed')
            ->sum('final_amount');

        // This month revenue
        $thisMonthRevenue = Booking::where('status', 'completed')
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->sum('final_amount');

        // This month completed services
        $thisMonthCompleted = Booking::where('status', 'completed')
            ->whereMonth('completed_at', now()->month)
            ->whereYear('completed_at', now()->year)
            ->count();

        return Inertia::render('admin/reports/index', [
            'bookingsByStatus' => $bookingsByStatus,
            'topVehicles' => $topVehicles,
            'revenueSummary' => $revenueSummary,
            'allTimeRevenue' => $allTimeRevenue,
            'thisMonthRevenue' => $thisMonthRevenue,
            'thisMonthCompleted' => $thisMonthCompleted,
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
                $query->where('completed_at', '>=', now()->subYears(1));
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

    /**
     * Export reports as PDF.
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

        $html = view('pdf.report', [
            'bookings_by_status' => $bookingsByStatus,
            'top_vehicles' => $topVehicles,
            'revenue_summary' => $revenueSummary,
            'summary' => $summary,
            'transactions' => $transactions,
            'date_from' => $displayDateFrom,
            'date_to' => $displayDateTo,
        ])->render();

        return response()->streamDownload(function() use ($html) {
            echo $html;
        }, 'Laporan-Business-' . $dateFrom . '-ke-' . $dateTo . '.html', [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'attachment; filename="Laporan-Business-' . $dateFrom . '-ke-' . $dateTo . '.html"'
        ]);
    }

    /**
     * Display transaction report.
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

        return Inertia::render('admin/reports/transactions', [
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
     * Export transaction report as PDF.
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

        $html = view('pdf.transaction-report', [
            'bookings' => $bookings,
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ])->render();

        return response()->streamDownload(function() use ($html) {
            echo $html;
        }, 'Laporan-Transaksi-' . $dateFrom . '-ke-' . $dateTo . '.html', [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'attachment; filename="Laporan-Transaksi-' . $dateFrom . '-ke-' . $dateTo . '.html"'
        ]);
    }

    /**
     * Display invoice payment report.
     */
    public function invoices(Request $request)
    {
        // Filter by date range
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Build base query for summary
        $summaryQuery = Booking::with(['user', 'vehicle', 'payments'])
            ->whereHas('payments')
            ->whereBetween('booking_date', [$dateFrom, $dateTo]);

        // Filter by payment status for summary
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $summaryQuery->where('payment_status', $request->payment_status);
        }

        // Calculate summary BEFORE pagination
        $bookingsForSummary = $summaryQuery->get();

        // Get all payments for summary
        $payments = \App\Models\Payment::whereHas('booking', function ($q) use ($dateFrom, $dateTo) {
            $q->whereBetween('booking_date', [$dateFrom, $dateTo]);
        })->get();

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
            ->whereHas('payments')
            ->whereBetween('booking_date', [$dateFrom, $dateTo]);

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->paginate(50);

        return Inertia::render('admin/reports/invoices', [
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
     * Export invoice payment report as PDF.
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

        $html = view('pdf.invoice-payment-report', [
            'bookings' => $bookings,
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ])->render();

        return response()->streamDownload(function() use ($html) {
            echo $html;
        }, 'Laporan-Invoice-Pembayaran-' . $dateFrom . '-ke-' . $dateTo . '.html', [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'attachment; filename="Laporan-Invoice-Pembayaran-' . $dateFrom . '-ke-' . $dateTo . '.html"'
        ]);
    }

    /**
     * Display customer and vehicle report.
     */
    public function customers(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Get customers grouped by phone and name
        $customers = Booking::whereNotNull('customer_phone')
            ->whereBetween('booking_date', [$dateFrom, $dateTo])
            ->selectRaw('
                customer_name as name, 
                customer_phone as phone, 
                COUNT(id) as total_bookings, 
                SUM(CASE WHEN status = "completed" THEN final_amount ELSE 0 END) as total_spent
            ')
            ->groupBy('customer_name', 'customer_phone')
            ->orderByDesc('total_spent')
            ->paginate(50);

        $summary = [
            'total_customers' => Booking::distinct('customer_phone')->count('customer_phone'),
            'active_period' => $customers->total(),
            'total_vehicles' => \App\Models\Vehicle::count(),
        ];

        return Inertia::render('admin/reports/customers', [
            'customers' => $customers,
            'summary' => $summary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Export customer report as PDF.
     */
    public function exportCustomers(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        $customers = Booking::whereNotNull('customer_phone')
            ->whereBetween('booking_date', [$dateFrom, $dateTo])
            ->selectRaw('
                customer_name as name, 
                customer_phone as phone, 
                COUNT(id) as total_bookings, 
                SUM(CASE WHEN status = "completed" THEN final_amount ELSE 0 END) as total_spent
            ')
            ->groupBy('customer_name', 'customer_phone')
            ->orderByDesc('total_spent')
            ->get();

        $summary = [
            'total_customers' => Booking::distinct('customer_phone')->count('customer_phone'),
            'active_period' => $customers->count(),
            'total_vehicles' => \App\Models\Vehicle::count(),
        ];

        $html = view('pdf.customer-report', [
            'customers' => $customers,
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ])->render();

        return response()->streamDownload(function() use ($html) {
            echo $html;
        }, 'Laporan-Customer-' . $dateFrom . '-ke-' . $dateTo . '.html', [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'attachment; filename="Laporan-Customer-' . $dateFrom . '-ke-' . $dateTo . '.html"'
        ]);
    }

    /**
     * Display customer service history report.
     */
    public function services(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Get detailed service history
        $services = Booking::with(['user', 'vehicle', 'mechanics', 'serviceItems'])
            ->where('status', 'completed')
            ->whereBetween('booking_date', [$dateFrom, $dateTo])
            ->orderBy('booking_date', 'desc')
            ->paginate(50);

        // Top services summary
        $topServices = DB::table('booking_service_items')
            ->join('service_items', 'booking_service_items.service_item_id', '=', 'service_items.id')
            ->join('bookings', 'booking_service_items.booking_id', '=', 'bookings.id')
            ->where('bookings.status', 'completed')
            ->whereBetween('bookings.booking_date', [$dateFrom, $dateTo])
            ->select('service_items.name', DB::raw('SUM(booking_service_items.subtotal) as total_revenue'), DB::raw('COUNT(*) as total_sold'))
            ->groupBy('service_items.id', 'service_items.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        $summary = [
            'total_service_transactions' => $services->total(),
            'total_items_sold' => $topServices->sum('total_sold'),
        ];

        return Inertia::render('admin/reports/services', [
            'services' => $services,
            'topServices' => $topServices,
            'summary' => $summary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    /**
     * Export customer service history as PDF.
     */
    public function exportServices(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        $services = Booking::with(['user', 'vehicle', 'mechanics', 'serviceItems.service'])
            ->where('status', 'completed')
            ->whereBetween('booking_date', [$dateFrom, $dateTo])
            ->orderBy('booking_date', 'desc')
            ->get();

        $topServices = DB::table('booking_service_items')
            ->join('service_items', 'booking_service_items.service_item_id', '=', 'service_items.id')
            ->join('bookings', 'booking_service_items.booking_id', '=', 'bookings.id')
            ->where('bookings.status', 'completed')
            ->whereBetween('bookings.booking_date', [$dateFrom, $dateTo])
            ->select('service_items.name', DB::raw('SUM(booking_service_items.subtotal) as total_revenue'), DB::raw('COUNT(*) as total_sold'))
            ->groupBy('service_items.id', 'service_items.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        $summary = [
            'total_service_transactions' => $services->count(),
            'total_items_sold' => $topServices->sum('total_sold'),
        ];

        $html = view('pdf.service-report', [
            'services' => $services,
            'topServices' => $topServices,
            'summary' => $summary,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ])->render();

        return response()->streamDownload(function() use ($html) {
            echo $html;
        }, 'Laporan-Service-Customer-' . $dateFrom . '-ke-' . $dateTo . '.html', [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'attachment; filename="Laporan-Service-Customer-' . $dateFrom . '-ke-' . $dateTo . '.html"'
        ]);
    }
}
