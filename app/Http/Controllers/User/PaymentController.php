<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display the payment page for a booking.
     */
    public function show(Request $request, Booking $booking)
    {
        // Verify ownership
        if ($booking->user_id !== $request->user()->id) {
            abort(403);
        }

        $booking->load(['payments']);

        return Inertia::render('user/payments/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Process payment for a booking.
     */
    public function pay(Request $request, Booking $booking)
    {
        // Verify ownership
        if ($booking->user_id !== $request->user()->id) {
            abort(403);
        }

        // Check if already paid
        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return redirect()->back()
                ->with('error', 'Booking is already paid.');
        }

        if (!in_array($booking->status, [Booking::STATUS_READY_TO_PICKUP, Booking::STATUS_COMPLETED], true)) {
            return redirect()->back()
                ->with('error', 'Pembayaran hanya bisa dilakukan saat booking siap diambil.');
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:cash,transfer,e-wallet,card',
            'amount' => 'required|numeric|min:0',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Create payment record
            Payment::create([
                'booking_id' => $booking->id,
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['amount'],
                'status' => 'completed',
                'transaction_id' => $validated['transaction_id'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'paid_at' => now(),
            ]);

            $booking->refreshFinancialSummary();

            DB::commit();
            return redirect()->route('user.bookings.show', $booking)
                ->with('success', 'Payment processed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to process payment. Please try again.');
        }
    }
}
