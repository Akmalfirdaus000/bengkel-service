<?php

use App\Http\Controllers\User\BookingController as UserBookingController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\VehicleController;
use Illuminate\Support\Facades\Route;

// User Routes - Require authentication, email verification, and user role
Route::middleware(['auth', 'verified', 'isUser'])
    ->prefix('user')
    ->name('user.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [UserDashboardController::class, 'index'])
            ->name('dashboard');

        // Vehicles
        Route::resource('vehicles', VehicleController::class);

        // Bookings
        Route::get('/bookings', [UserBookingController::class, 'index'])
            ->name('bookings.index');
        Route::get('/bookings/create', [UserBookingController::class, 'create'])
            ->name('bookings.create');
        Route::post('/bookings', [UserBookingController::class, 'store'])
            ->name('bookings.store');
        Route::get('/bookings/history', [UserBookingController::class, 'history'])
            ->name('bookings.history');
        Route::get('/bookings/{booking}/success', [UserBookingController::class, 'success'])
            ->name('bookings.success');
        Route::get('/bookings/{booking}', [UserBookingController::class, 'show'])
            ->name('bookings.show');
        Route::get('/my-bookings', [UserBookingController::class, 'myBookings'])
            ->name('bookings.my-bookings');

        // Payments
        Route::get('/payments/{booking}', [PaymentController::class, 'show'])
            ->name('payments.show');
        Route::post('/payments/{booking}/pay', [PaymentController::class, 'pay'])
            ->name('payments.pay');
    });
