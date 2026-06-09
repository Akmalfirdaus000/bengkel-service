<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PublicBookingController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    $user = auth()->user();

    if ($user && $user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    if ($user && $user->isOwner()) {
        return redirect()->route('owner.dashboard');
    }

    if ($user && $user->isUser()) {
        return redirect()->route('user.dashboard');
    }

    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Public Booking Routes
Route::get('/booking', [PublicBookingController::class, 'create'])->name('booking.create');
Route::post('/booking', [PublicBookingController::class, 'store'])->name('booking.store');
Route::get('/booking/success', [PublicBookingController::class, 'success'])->name('booking.success');

// Check booking availability for a specific date
Route::get('/api/bookings/check-availability', [PublicBookingController::class, 'checkAvailability'])
    ->name('bookings.check-availability');

require __DIR__.'/settings.php';

