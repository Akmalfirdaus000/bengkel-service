<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServiceSubItem;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Check booking availability for a specific date.
     */
    public function checkAvailability(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json(['count' => 0]);
        }

        $count = Booking::whereDate('booking_date', $date)
            ->whereNot('status', Booking::STATUS_CANCELLED)
            ->count();

        return response()->json([
            'count' => $count,
            'available' => $count < 10,
        ]);
    }

    /**
     * Display a listing of user's bookings.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->whereIn('status', Booking::activeStatuses())
            ->with(['vehicle', 'services', 'payments'])
            ->orderBy('booking_date', 'desc')
            ->paginate(10);

        return Inertia::render('user/bookings/index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new booking.
     */
    public function create(Request $request)
    {
        $user = $request->user();

        $vehicles = Vehicle::where('user_id', $user->id)
            ->active()
            ->orderBy('brand')
            ->orderBy('model')
            ->get();

        $services = Service::active()
            ->with([
                'category',
                'subItems' => fn ($query) => $query->active()->orderBy('sort_order')->orderBy('name'),
            ])
            ->orderBy('service_category_id')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('user/bookings/create', [
            'vehicles' => $vehicles,
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(Request $request)
    {
        Log::info('Booking store - START', ['request_data' => $request->all()]);

        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'exists:service_items,id',
            'service_quantities' => 'required|array|min:1',
            'service_quantities.*' => 'integer|min:1',
            'sub_item_ids' => 'array',
            'sub_item_ids.*' => 'nullable|exists:service_sub_items,id',
            'notes' => 'nullable|string',
        ]);

        Log::info('Booking store - Validation passed', ['validated' => $validated]);

        // Verify vehicle ownership.
        Vehicle::where('id', $validated['vehicle_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $bookingDate = Carbon::parse($validated['booking_date']);

        // Check max 10 bookings per day.
        $existingBookingsCount = Booking::whereDate('booking_date', $bookingDate)
            ->whereNot('status', Booking::STATUS_CANCELLED)
            ->count();

        Log::info('Booking store - Existing bookings count', [
            'count' => $existingBookingsCount,
            'date' => $bookingDate,
        ]);

        if ($existingBookingsCount >= 10) {
            Log::info('Booking store - Slot full', ['count' => $existingBookingsCount]);
            return redirect()->back()
                ->with('error', 'Maaf, kuota booking untuk tanggal tersebut sudah penuh (maksimal 10 booking per hari). Silakan pilih tanggal lain.');
        }

        DB::beginTransaction();
        try {
            $serviceIds = $validated['service_ids'];
            $quantities = $validated['service_quantities'];
            $subItemIds = $validated['sub_item_ids'] ?? [];

            $services = Service::query()
                ->whereIn('id', $serviceIds)
                ->with(['subItems' => fn ($query) => $query->active()])
                ->get()
                ->keyBy('id');

            Log::info('Booking store - Starting calculation', [
                'service_ids' => $serviceIds,
                'quantities' => $quantities,
                'sub_item_ids' => $subItemIds,
            ]);

            // Calculate total amount with selected sub item pricing.
            $totalAmount = 0;
            foreach ($serviceIds as $index => $serviceId) {
                $service = $services->get((int) $serviceId);
                if (!$service) {
                    throw ValidationException::withMessages([
                        "service_ids.$index" => 'Layanan tidak ditemukan.',
                    ]);
                }

                $quantity = (int) ($quantities[$index] ?? 1);
                $subItemId = $subItemIds[$index] ?? null;
                $serviceSubItem = $this->resolveSubItem($service, $subItemId, $index);

                $price = $this->resolveUnitPrice($service, $serviceSubItem);
                $totalAmount += $price * $quantity;
            }

            Log::info('Booking store - Total amount calculated', ['total_amount' => $totalAmount]);

            // Generate queue number and order.
            $queueOrder = $existingBookingsCount + 1;
            $queueNumber = $this->generateQueueNumber($bookingDate, $queueOrder);

            // Calculate estimated time (1 hour work + 30 min break per queue).
            $estimatedStartTime = $this->calculateEstimatedStartTime($bookingDate, $queueOrder);
            $estimatedEndTime = $estimatedStartTime->copy()->addHour();

            $booking = Booking::create([
                'queue_number' => $queueNumber,
                'queue_order' => $queueOrder,
                'user_id' => $request->user()->id,
                'vehicle_id' => $validated['vehicle_id'],
                'booking_date' => $estimatedStartTime,
                'estimated_start_time' => $estimatedStartTime,
                'estimated_end_time' => $estimatedEndTime,
                'status' => Booking::STATUS_PENDING,
                'notes' => $validated['notes'] ?? null,
                'total_amount' => $totalAmount,
                'final_amount' => $totalAmount,
            ]);

            Log::info('Booking store - Booking created', [
                'booking_id' => $booking->id,
                'queue_number' => $booking->queue_number,
                'queue_order' => $booking->queue_order,
            ]);

            foreach ($serviceIds as $index => $serviceId) {
                $service = $services->get((int) $serviceId);
                if (!$service) {
                    throw ValidationException::withMessages([
                        "service_ids.$index" => 'Layanan tidak ditemukan.',
                    ]);
                }

                $quantity = (int) ($quantities[$index] ?? 1);
                $subItemId = $subItemIds[$index] ?? null;
                $serviceSubItem = $this->resolveSubItem($service, $subItemId, $index);

                $price = $this->resolveUnitPrice($service, $serviceSubItem);

                ServiceItem::create([
                    'booking_id' => $booking->id,
                    'service_item_id' => $serviceId,
                    'service_sub_item_id' => $serviceSubItem?->id,
                    'quantity' => $quantity,
                    'unit_price' => $price,
                    'subtotal' => $price * $quantity,
                ]);
            }

            $booking->refreshFinancialSummary();

            DB::commit();
            Log::info('Booking store - SUCCESS', [
                'booking_id' => $booking->id,
                'queue_number' => $booking->queue_number,
            ]);

            return redirect()->route('user.bookings.index')
                ->with('success', 'Booking berhasil dibuat. Nomor antrian: ' . $booking->queue_number);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking store - ERROR', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Gagal membuat booking. Silakan coba lagi.');
        }
    }

    /**
     * Generate queue number (e.g., A001, A002, etc.)
     */
    private function generateQueueNumber($bookingDate, $queueOrder): string
    {
        $dayPrefix = strtoupper($bookingDate->format('D'));
        $queueNumber = str_pad($queueOrder, 3, '0', STR_PAD_LEFT);

        return $dayPrefix . $queueNumber;
    }

    /**
     * Calculate estimated start time based on queue order.
     * Each slot: 1 hour work + 30 min break = 1.5 hours.
     */
    private function calculateEstimatedStartTime($bookingDate, $queueOrder): Carbon
    {
        $startTime = $bookingDate->copy()->setHour(8)->setMinute(0)->setSecond(0);
        $minutesToAdd = ($queueOrder - 1) * 90;

        return $startTime->addMinutes($minutesToAdd);
    }

    /**
     * Show booking success page with queue number.
     */
    public function success(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            abort(403);
        }

        $booking->load(['vehicle', 'serviceItems.service']);

        return Inertia::render('user/bookings/success', [
            'booking' => $booking,
        ]);
    }

    /**
     * Resolve selected sub item and validate ownership to service.
     */
    private function resolveSubItem(Service $service, mixed $subItemId, int $index): ?ServiceSubItem
    {
        if (!$subItemId) {
            return null;
        }

        $subItem = $service->subItems->firstWhere('id', (int) $subItemId);
        if ($subItem) {
            return $subItem;
        }

        throw ValidationException::withMessages([
            "sub_item_ids.$index" => 'Sub item tidak valid untuk layanan yang dipilih.',
        ]);
    }

    /**
     * Resolve booking unit price with selected sub item.
     */
    private function resolveUnitPrice(Service $service, ?ServiceSubItem $serviceSubItem): float
    {
        $price = (float) $service->price;

        if ($serviceSubItem) {
            $price += (float) $serviceSubItem->additional_price;
        }

        return $price;
    }

    /**
     * Display the specified booking.
     */
    public function show(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            abort(403);
        }

        $booking->load(['vehicle', 'payments']);

        $serviceItems = ServiceItem::where('booking_id', $booking->id)
            ->with(['service', 'serviceSubItem'])
            ->get();

        $serviceItems->each(function ($item) {
            $item->sub_item_name = $item->serviceSubItem?->name;
        });

        $booking->serviceItems = $serviceItems;
        $booking->load('services', 'mechanics');

        return Inertia::render('user/bookings/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Get user's completed bookings for service history page.
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->where('status', Booking::STATUS_COMPLETED)
            ->with(['vehicle', 'services'])
            ->orderBy('booking_date', 'desc')
            ->get();

        return Inertia::render('user/bookings/history', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Backward compatibility for old route alias.
     */
    public function myBookings(Request $request)
    {
        return $this->history($request);
    }
}
