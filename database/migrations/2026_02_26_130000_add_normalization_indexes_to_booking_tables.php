<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->index(['status', 'payment_status', 'booking_date'], 'bookings_status_payment_booking_date_idx');
        });

        Schema::table('booking_service_items', function (Blueprint $table) {
            $table->index(['booking_id', 'service_item_id', 'service_sub_item_id'], 'booking_service_items_lookup_idx');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index(['booking_id', 'status'], 'payments_booking_status_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_status_payment_booking_date_idx');
        });

        Schema::table('booking_service_items', function (Blueprint $table) {
            $table->dropIndex('booking_service_items_lookup_idx');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_booking_status_idx');
        });
    }
};
