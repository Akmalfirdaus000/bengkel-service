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
            $table->string('queue_number')->nullable()->after('id')->index();
            $table->integer('queue_order')->nullable()->after('queue_number');
            $table->timestamp('estimated_start_time')->nullable()->after('booking_date');
            $table->timestamp('estimated_end_time')->nullable()->after('estimated_start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['queue_number']);
            $table->dropColumn([
                'queue_number',
                'queue_order',
                'estimated_start_time',
                'estimated_end_time'
            ]);
        });
    }
};
