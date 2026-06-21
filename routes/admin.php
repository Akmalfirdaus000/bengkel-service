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
        Route::get('/reports/transactions', [ReportController::class, 'transactions'])
            ->name('reports.transactions');
        Route::get('/reports/transactions/export-pdf', [ReportController::class, 'exportTransactions'])
            ->name('reports.transactions.export-pdf');
        Route::get('/reports/invoices', [ReportController::class, 'invoices'])
            ->name('reports.invoices');
        Route::get('/reports/invoices/export-pdf', [ReportController::class, 'exportInvoices'])
            ->name('reports.invoices.export-pdf');
        Route::get('/reports/customers', [ReportController::class, 'customers'])
            ->name('reports.customers');
        Route::get('/reports/customers/export-pdf', [ReportController::class, 'exportCustomers'])
            ->name('reports.customers.export-pdf');
        Route::get('/reports/services', [ReportController::class, 'services'])
            ->name('reports.services');
        Route::get('/reports/services/export-pdf', [ReportController::class, 'exportServices'])
            ->name('reports.services.export-pdf');

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
                Route::put('/bookings/{booking}/time', [AdminBookingController::class, 'updateTime'])
            ->name('bookings.update-time');
        Route::put('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus'])
            ->name('bookings.update-status');
        Route::put('/bookings/{booking}/payments/{payment}/validate', [AdminBookingController::class, 'validatePayment'])
            ->name('bookings.payments.validate');
        Route::post('/bookings/{booking}/payments', [AdminBookingController::class, 'addPayment'])
            ->name('bookings.payments.store');
        Route::put('/bookings/{booking}/assign', [AdminBookingController::class, 'assignMechanic'])
            ->name('bookings.assign-mechanic');
        Route::post('/bookings/{booking}/service-items', [AdminBookingController::class, 'storeServiceItem'])
            ->name('bookings.service-items.store');
        Route::put('/bookings/{booking}/service-items/{item}', [AdminBookingController::class, 'updateServiceItem'])
            ->name('bookings.service-items.update');
        Route::delete('/bookings/{booking}/service-items/{item}', [AdminBookingController::class, 'destroyServiceItem'])
            ->name('bookings.service-items.destroy');
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
