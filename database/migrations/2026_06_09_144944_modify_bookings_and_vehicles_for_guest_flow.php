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
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->string('customer_name')->after('user_id')->nullable();
            $table->string('customer_phone')->after('customer_name')->nullable();
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'customer_phone']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
