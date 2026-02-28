<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Mechanic;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServiceSubItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'vehicle', 'mechanics']);
        $activeStatuses = Booking::activeStatuses();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'completed') {
                return redirect()->route('admin.bookings.history');
            }

            $query->where('status', $request->status);
        } else {
            $query->whereIn('status', $activeStatuses);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('booking_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('booking_date', '<=', $request->date_to);
        }

        // Search by customer name or plate number
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($subQ) use ($request) {
                    $subQ->where('name', 'like', '%' . $request->search . '%');
                })->orWhereHas('vehicle', function ($subQ) use ($request) {
                    $subQ->where('plate_number', 'like', '%' . $request->search . '%');
                });
            });
        }

        $bookings = $query->orderBy('booking_date', 'desc')->paginate(20);

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
        ]);
    }

    /**
     * Display completed bookings history.
     */
    public function history(Request $request)
    {
        $query = Booking::with(['user', 'vehicle', 'mechanics'])
            ->where('status', Booking::STATUS_COMPLETED);

        if ($request->has('date_from')) {
            $query->whereDate('completed_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('completed_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($subQ) use ($request) {
                    $subQ->where('name', 'like', '%' . $request->search . '%');
                })->orWhereHas('vehicle', function ($subQ) use ($request) {
                    $subQ->where('plate_number', 'like', '%' . $request->search . '%');
                });
            });
        }

        $bookings = $query->orderByDesc('completed_at')->paginate(20);

        return Inertia::render('admin/bookings/history', [
            'bookings' => $bookings,
            'filters' => $request->only(['date_from', 'date_to', 'search']),
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        $booking->load(['user', 'vehicle', 'mechanics', 'payments']);

        // Load booking service items and selected sub item.
        $serviceItems = ServiceItem::where('booking_id', $booking->id)
            ->with(['service', 'serviceSubItem'])
            ->get();

        // Add selected sub item name.
        $serviceItems->each(function ($item) {
            $item->sub_item_name = $item->serviceSubItem?->name;
        });

        $booking->serviceItems = $serviceItems;

        $availableMechanics = Mechanic::active()->available()->get();

        $allServices = Service::active()
            ->with([
                'category',
                'subItems' => fn ($query) => $query->active()->orderBy('sort_order')->orderBy('name'),
            ])
            ->get();

        return Inertia::render('admin/bookings/show', [
            'booking' => $booking,
            'availableMechanics' => $availableMechanics,
            'allServices' => $allServices,
        ]);
    }

    /**
     * Update the booking status.
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        $allowedStatuses = [
            Booking::STATUS_PENDING,
            Booking::STATUS_CONFIRMED,
            Booking::STATUS_ASSIGNED,
            Booking::STATUS_IN_PROGRESS,
            Booking::STATUS_READY_TO_PICKUP,
            Booking::STATUS_COMPLETED,
            Booking::STATUS_CANCELLED,
        ];

        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', $allowedStatuses),
            'admin_notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $booking->update([
                'status' => $validated['status'],
                'admin_notes' => $validated['admin_notes'] ?? $booking->admin_notes,
            ]);

            // Set completed_at when status is completed
            if ($validated['status'] === Booking::STATUS_COMPLETED) {
                $booking->update([
                    'completed_at' => now(),
                    'cancelled_at' => null,
                ]);
            }

            // Set cancelled_at when status is cancelled
            if ($validated['status'] === Booking::STATUS_CANCELLED) {
                $booking->update([
                    'cancelled_at' => now(),
                    'completed_at' => null,
                ]);
            }

            DB::commit();
            return redirect()->back()
                ->with('success', 'Status booking berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Gagal mengupdate status booking.');
        }
    }

    /**
     * Assign mechanics to the booking.
     */
    public function assignMechanic(Request $request, Booking $booking)
    {
        if (in_array($booking->status, Booking::terminalStatuses(), true)) {
            return redirect()->back()
                ->with('error', 'Booking selesai/dibatalkan, mekanik tidak bisa diubah.');
        }

        $validated = $request->validate([
            'mechanic_ids' => 'required|array',
            'mechanic_ids.*' => 'exists:mechanics,id',
        ]);

        $booking->mechanics()->sync($validated['mechanic_ids']);

        // Update status to assigned if it was confirmed
        if ($booking->status === Booking::STATUS_CONFIRMED) {
            $booking->update(['status' => Booking::STATUS_ASSIGNED]);
        }

        return redirect()->back()
            ->with('success', 'Mekanik berhasil ditugaskan.');
    }

    /**
     * Add extra service item to existing booking.
     */
    public function storeServiceItem(Request $request, Booking $booking)
    {
        if (in_array($booking->status, Booking::terminalStatuses(), true)) {
            return redirect()->back()
                ->with('error', 'Booking selesai/dibatalkan, layanan tidak bisa ditambah.');
        }

        $validated = $request->validate([
            'service_item_id' => 'required|exists:service_items,id',
            'service_sub_item_id' => 'nullable|exists:service_sub_items,id',
            'quantity' => 'required|integer|min:1|max:20',
        ]);

        $service = Service::query()
            ->with(['subItems' => fn ($query) => $query->active()])
            ->findOrFail($validated['service_item_id']);

        $subItem = null;
        if (!empty($validated['service_sub_item_id'])) {
            $subItem = ServiceSubItem::query()
                ->where('id', $validated['service_sub_item_id'])
                ->where('service_item_id', $service->id)
                ->first();

            if (!$subItem) {
                return redirect()->back()->with('error', 'Sub item tidak valid untuk layanan tersebut.');
            }
        }

        DB::beginTransaction();
        try {
            $unitPrice = (float) $service->price + (float) ($subItem?->additional_price ?? 0);
            $quantity = (int) $validated['quantity'];
            $existingLine = ServiceItem::query()
                ->where('booking_id', $booking->id)
                ->where('service_item_id', $service->id)
                ->when($subItem?->id, fn ($query, $id) => $query->where('service_sub_item_id', $id))
                ->when(!$subItem?->id, fn ($query) => $query->whereNull('service_sub_item_id'))
                ->first();

            if ($existingLine) {
                $newQuantity = $existingLine->quantity + $quantity;
                $existingLine->update([
                    'quantity' => $newQuantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $unitPrice * $newQuantity,
                ]);
            } else {
                ServiceItem::create([
                    'booking_id' => $booking->id,
                    'service_item_id' => $service->id,
                    'service_sub_item_id' => $subItem?->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $unitPrice * $quantity,
                ]);
            }

            $booking->refreshFinancialSummary();

            DB::commit();
            return redirect()->back()->with('success', 'Layanan tambahan berhasil ditambahkan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menambahkan layanan tambahan.');
        }
    }

    /**
     * Remove the specified booking.
     */
    public function destroy(Booking $booking)
    {
        if ($booking->status !== 'pending' && $booking->status !== 'cancelled') {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus booking dengan status: ' . $booking->status);
        }

        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking berhasil dihapus.');
    }
}
