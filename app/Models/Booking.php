<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_READY_TO_PICKUP = 'ready_to_pickup';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const PAYMENT_UNPAID = 'unpaid';
    public const PAYMENT_PARTIAL = 'partial';
    public const PAYMENT_PAID = 'paid';
    public const PAYMENT_REFUNDED = 'refunded';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'queue_number',
        'queue_order',
        'user_id',
        'vehicle_id',
        'booking_date',
        'estimated_start_time',
        'estimated_end_time',
        'status',
        'notes',
        'admin_notes',
        'total_amount',
        'discount_amount',
        'final_amount',
        'payment_status',
        'completed_at',
        'cancelled_at',
    ];

    public static function activeStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_ASSIGNED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_READY_TO_PICKUP,
        ];
    }

    public static function waitingStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_ASSIGNED,
        ];
    }

    public static function terminalStatuses(): array
    {
        return [
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
        ];
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'booking_date' => 'datetime',
            'estimated_start_time' => 'datetime',
            'estimated_end_time' => 'datetime',
            'total_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vehicle for the booking.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get all services for the booking.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'booking_service_items', 'booking_id', 'service_item_id')
            ->withPivot('quantity', 'unit_price', 'subtotal', 'service_sub_item_id')
            ->withTimestamps();
    }

    /**
     * Get all service items for the booking.
     */
    public function serviceItems(): HasMany
    {
        return $this->hasMany(ServiceItem::class);
    }

    /**
     * Get all mechanics for the booking.
     */
    public function mechanics(): BelongsToMany
    {
        return $this->belongsToMany(Mechanic::class, 'booking_mechanics')
            ->withTimestamps();
    }

    /**
     * Get all payments for the booking.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope to filter bookings by status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get upcoming bookings.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('booking_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed', 'assigned']);
    }

    /**
     * Scope to get today's bookings.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('booking_date', today());
    }

    /**
     * Get formatted final amount.
     */
    public function getFormattedFinalAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->final_amount, 0, ',', '.');
    }

    /**
     * Get status badge color.
     */
    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'confirmed' => 'blue',
            'assigned' => 'purple',
            'in_progress' => 'orange',
            'ready_to_pickup' => 'cyan',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    /**
     * Check if booking can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED], true);
    }

    /**
     * Check if booking is paid.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === self::PAYMENT_PAID;
    }

    /**
     * Recalculate booking totals and payment status from detail rows.
     */
    public function refreshFinancialSummary(): void
    {
        $totalAmount = (float) $this->serviceItems()->sum('subtotal');
        $discount = (float) $this->discount_amount;
        $finalAmount = max(0, $totalAmount - $discount);
        $totalPaid = (float) $this->payments()->where('status', 'completed')->sum('amount');

        $paymentStatus = self::PAYMENT_UNPAID;
        if ($totalPaid >= $finalAmount && $finalAmount > 0) {
            $paymentStatus = self::PAYMENT_PAID;
        } elseif ($totalPaid > 0) {
            $paymentStatus = self::PAYMENT_PARTIAL;
        }

        if ($finalAmount == 0.0 && $totalPaid == 0.0) {
            $paymentStatus = self::PAYMENT_UNPAID;
        }

        $this->update([
            'total_amount' => $totalAmount,
            'final_amount' => $finalAmount,
            'payment_status' => $paymentStatus,
        ]);
    }
}
