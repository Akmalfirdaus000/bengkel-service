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
        Schema::table('booking_service_items', function (Blueprint $table) {
            $table->dropIndex(['service_sub_item_id']);
            $table->foreign('service_sub_item_id')
                ->references('id')
                ->on('service_sub_items')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_service_items', function (Blueprint $table) {
            $table->dropForeign(['service_sub_item_id']);
            $table->index('service_sub_item_id');
        });
    }
};
