<?php

use App\Http\Controllers\Owner\OwnerDashboardController;
use Illuminate\Support\Facades\Route;

// Owner Routes - Require authentication, email verification, and owner role
Route::middleware(['auth', 'verified', 'isOwner'])
    ->prefix('owner')
    ->name('owner.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [OwnerDashboardController::class, 'index'])
            ->name('dashboard');
        
        // Reports
        Route::get('/reports', [\App\Http\Controllers\Owner\ReportController::class, 'index'])
            ->name('reports.index');
        Route::get('/reports/export-pdf', [\App\Http\Controllers\Owner\ReportController::class, 'exportPdf'])
            ->name('reports.export-pdf');
        Route::get('/reports/revenue', [\App\Http\Controllers\Owner\ReportController::class, 'revenue'])
            ->name('reports.revenue');
        Route::get('/reports/transactions', [\App\Http\Controllers\Owner\ReportController::class, 'transactions'])
            ->name('reports.transactions');
        Route::get('/reports/transactions/export-pdf', [\App\Http\Controllers\Owner\ReportController::class, 'exportTransactions'])
            ->name('reports.transactions.export-pdf');
        Route::get('/reports/invoices', [\App\Http\Controllers\Owner\ReportController::class, 'invoices'])
            ->name('reports.invoices');
        Route::get('/reports/invoices/export-pdf', [\App\Http\Controllers\Owner\ReportController::class, 'exportInvoices'])
            ->name('reports.invoices.export-pdf');
        
        // Workshop Status & Mechanics (Placeholders for now, pointing to existing admin logic or custom ones)
        Route::get('/workshop-status', [OwnerDashboardController::class, 'workshopStatus'])
            ->name('workshop-status');
        Route::get('/mechanics', [OwnerDashboardController::class, 'mechanicPerformance'])
            ->name('mechanics.performance');
    });
