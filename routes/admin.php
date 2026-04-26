<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\MechanicController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ServiceCategoryController;
use App\Http\Controllers\Admin\ServiceController;
use Illuminate\Support\Facades\Route;

// Admin Routes - Require authentication, email verification, and admin role
Route::middleware(['auth', 'verified', 'isAdmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');
        Route::get('/reports/revenue', [ReportController::class, 'revenue'])
            ->name('reports.revenue');
        Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])
            ->name('reports.export-pdf');

        // Service Categories
        Route::resource('service-categories', ServiceCategoryController::class);

        // Services
        Route::resource('services', ServiceController::class);
        Route::post('/services/{service}/sub-items', [ServiceController::class, 'storeSubItem'])
            ->name('services.sub-items.store');
        Route::put('/services/{service}/sub-items/{subItem}', [ServiceController::class, 'updateSubItem'])
            ->name('services.sub-items.update');
        Route::delete('/services/{service}/sub-items/{subItem}', [ServiceController::class, 'destroySubItem'])
            ->name('services.sub-items.destroy');

        // Bookings Management
        Route::get('/bookings', [AdminBookingController::class, 'index'])
            ->name('bookings.index');
        Route::get('/bookings/history', [AdminBookingController::class, 'history'])
            ->name('bookings.history');
        Route::get('/bookings/export-pdf', [AdminBookingController::class, 'exportTransactions'])
            ->name('bookings.export-pdf');
        Route::get('/bookings/{booking}', [AdminBookingController::class, 'show'])
            ->name('bookings.show');
        Route::get('/bookings/{booking}/invoice', [AdminBookingController::class, 'downloadInvoice'])
            ->name('bookings.invoice');
        Route::put('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus'])
            ->name('bookings.update-status');
        Route::put('/bookings/{booking}/assign', [AdminBookingController::class, 'assignMechanic'])
            ->name('bookings.assign-mechanic');
        Route::post('/bookings/{booking}/service-items', [AdminBookingController::class, 'storeServiceItem'])
            ->name('bookings.service-items.store');
        Route::delete('/bookings/{booking}', [AdminBookingController::class, 'destroy'])
            ->name('bookings.destroy');

        // Mechanics
        Route::resource('mechanics', MechanicController::class);

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');
        Route::get('/reports/revenue', [ReportController::class, 'revenue'])
            ->name('reports.revenue');
    });
