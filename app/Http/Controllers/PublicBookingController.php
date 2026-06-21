<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServiceSubItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PublicBookingController extends Controller
{
    public function create()
    {
        $categories = ServiceCategory::with(['services' => function ($query) {
            $query->active()
                ->with(['subItems' => function ($q) {
                    $q->active()->orderBy('sort_order');
                }]);
        }])
        ->whereHas('services', function($query) {
            $query->active();
        })
        ->where('name', 'not like', '%sparepart%')
        ->where('name', 'not like', '%Sparepart%')
        ->where('name', 'not like', '%SPAREPART%')
        ->active()
        ->orderBy('sort_order')
        ->get();

        return Inertia::render('public/booking/create', [
            'serviceCategories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'brand' => 'required|string|max:50',
            'model' => 'required|string|max:50',
            'plate_number' => 'required|string|max:20',
            'engine_number' => 'nullable|string|max:50',
            'frame_number' => 'nullable|string|max:50',
            'year' => 'nullable|string|max:4',
            'color' => 'nullable|string|max:30',
            'booking_date' => 'required|date|after_or_equal:today',
            'service_date' => 'required|date|after_or_equal:booking_date',
            'notes' => 'nullable|string',
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:service_items,id',
            'services.*.sub_item_id' => 'nullable|exists:service_sub_items,id',
            'services.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // First, find or create vehicle based on plate number
            $vehicle = Vehicle::firstOrCreate(
                ['plate_number' => strtoupper(str_replace(' ', '', $validated['plate_number']))],
                [
                    'brand' => $validated['brand'],
                    'model' => $validated['model'],
                    'engine_number' => $validated['engine_number'] ?? null,
                    'frame_number' => $validated['frame_number'] ?? null,
                    'year' => $validated['year'] ?? null,
                    'color' => $validated['color'] ?? null,
                    'is_active' => true,
                ]
            );

            // Generate queue number
            $date = Carbon::parse($validated['booking_date']);
            $todayBookingsCount = Booking::whereDate('booking_date', $date)->count();
            $queueOrder = $todayBookingsCount + 1;
            $queueNumber = 'Q-' . $date->format('ymd') . '-' . str_pad($queueOrder, 3, '0', STR_PAD_LEFT);

            // Calculate total amount
            $totalAmount = 0;
            $serviceItemsData = [];

            foreach ($validated['services'] as $serviceData) {
                $service = Service::find($serviceData['service_id']);
                $subItemPrice = 0;
                
                if (!empty($serviceData['sub_item_id'])) {
                    $subItem = ServiceSubItem::find($serviceData['sub_item_id']);
                    if ($subItem) {
                        $subItemPrice = $subItem->additional_price;
                    }
                }

                $unitPrice = $service->price + $subItemPrice;
                $quantity = $serviceData['quantity'];
                $subtotal = $unitPrice * $quantity;
                $totalAmount += $subtotal;

                $serviceItemsData[] = [
                    'service_item_id' => $service->id,
                    'service_sub_item_id' => $serviceData['sub_item_id'] ?? null,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            // Create booking
            $booking = Booking::create([
                'queue_number' => $queueNumber,
                'queue_order' => $queueOrder,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'vehicle_id' => $vehicle->id,
                'booking_date' => $validated['booking_date'],
                'service_date' => $validated['service_date'],
                'status' => Booking::STATUS_PENDING,
                'notes' => $validated['notes'] ?? null,
                'total_amount' => $totalAmount,
                'discount_amount' => 0,
                'final_amount' => $totalAmount,
                'payment_status' => Booking::PAYMENT_UNPAID,
            ]);

            // Save service items
            foreach ($serviceItemsData as $itemData) {
                ServiceItem::create(array_merge($itemData, ['booking_id' => $booking->id]));
            }

            DB::commit();

            return redirect()->route('booking.success')->with('success', 'Booking berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Terjadi kesalahan sistem, silakan coba lagi.');
        }
    }

    public function success()
    {
        return Inertia::render('public/booking/success');
    }

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
}
