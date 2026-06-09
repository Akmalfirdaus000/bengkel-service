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
use Barryvdh\DomPDF\Facade\Pdf;

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
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($subQ) use ($request) {
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
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($subQ) use ($request) {
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
        $booking->setRelation('serviceItems', $serviceItems);

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
    
    /**
     * Update booking estimated times.
     */
    public function updateTime(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'estimated_start_time' => 'nullable|date_format:H:i',
            'estimated_end_time' => 'nullable|date_format:H:i|after:estimated_start_time',
        ]);

        $dateOnly = \Carbon\Carbon::parse($booking->booking_date)->format('Y-m-d');
        
        $booking->update([
            'estimated_start_time' => $validated['estimated_start_time'] ? $dateOnly . ' ' . $validated['estimated_start_time'] . ':00' : null,
            'estimated_end_time' => $validated['estimated_end_time'] ? $dateOnly . ' ' . $validated['estimated_end_time'] . ':00' : null,
        ]);

        return redirect()->back()->with('success', 'Estimasi waktu berhasil diperbarui.');
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $allowedStatuses = [
            Booking::STATUS_PENDING,
            Booking::STATUS_CONFIRMED,
            Booking::STATUS_IN_PROGRESS,
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
     * Validate payment for a booking.
     */
    public function validatePayment(Request $request, Booking $booking, \App\Models\Payment $payment)
    {
        if ($payment->booking_id !== $booking->id) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:completed,failed',
        ]);

        DB::beginTransaction();
        try {
            $payment->update([
                'status' => $validated['status'],
            ]);

            $booking->refreshFinancialSummary();

            DB::commit();
            return redirect()->back()->with('success', 'Status pembayaran berhasil diupdate.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal mengupdate status pembayaran.');
        }
    }

    /**
     * Add manual payment by admin.
     */
    public function addPayment(Request $request, Booking $booking)
    {
        DB::beginTransaction();
        try {
            $booking->payments()->create([
                'payment_method' => 'cash',
                'amount' => $booking->final_amount,
                'status' => 'completed',
                'paid_at' => now(),
                'payment_proof' => null,
            ]);

            $booking->refreshFinancialSummary();

            DB::commit();
            return redirect()->back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal mengonfirmasi pembayaran.');
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

    /**
     * Download invoice as PDF.
     */
    public function downloadInvoice(Booking $booking)
    {
        $booking->load(['user', 'vehicle', 'mechanics', 'payments']);

        $serviceItems = ServiceItem::where('booking_id', $booking->id)
            ->with(['service', 'serviceSubItem'])
            ->get();
        $booking->setRelation('serviceItems', $serviceItems);

        $pdf = Pdf::loadView('pdf.invoice', ['booking' => $booking])
            ->setOptions(['defaultFont' => 'Helvetica']);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'Invoice-' . $booking->queue_number . '.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="Invoice-' . $booking->queue_number . '.pdf"'
        ]);
    }

    /**
     * Export transactions as PDF.
     */
    public function exportTransactions(Request $request)
    {
        $query = Booking::with(['user', 'vehicle', 'mechanics']);

        if ($request->has('date_from')) {
            $query->whereDate('booking_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('booking_date', '<=', $request->date_to);
        }
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->get();

        $pdf = Pdf::loadView('pdf.transactions', ['bookings' => $bookings])
            ->setOptions(['defaultFont' => 'Helvetica']);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'Daftar-Transaksi-' . date('Y-m-d') . '.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="Daftar-Transaksi-' . date('Y-m-d') . '.pdf"'
        ]);
    }
}
