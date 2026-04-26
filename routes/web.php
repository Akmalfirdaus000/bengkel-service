<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\User\BookingController;

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

// Check booking availability for a specific date
Route::get('/api/bookings/check-availability', [BookingController::class, 'checkAvailability'])
    ->name('bookings.check-availability');

require __DIR__.'/settings.php';
