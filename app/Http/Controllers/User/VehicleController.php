<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Display a listing of user's vehicles.
     */
    public function index(Request $request)
    {
        $vehicles = Vehicle::where('user_id', $request->user()->id)
            ->orderBy('brand')
            ->orderBy('model')
            ->paginate(10);

        return Inertia::render('user/vehicles/index', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Show the form for creating a new vehicle.
     */
    public function create()
    {
        return Inertia::render('user/vehicles/create');
    }

    /**
     * Store a newly created vehicle.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'plate_number' => 'required|string|max:20|unique:vehicles',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'color' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        Vehicle::create($validated);

        return redirect()->route('user.vehicles.index')
            ->with('success', 'Vehicle added successfully.');
    }

    /**
     * Show the form for editing the specified vehicle.
     */
    public function edit(Request $request, Vehicle $vehicle)
    {
        // Verify ownership
        if ($vehicle->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('user/vehicles/edit', [
            'vehicle' => $vehicle,
        ]);
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        // Verify ownership
        if ($vehicle->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'plate_number' => 'required|string|max:20|unique:vehicles,plate_number,' . $vehicle->id,
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'color' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $vehicle->update($validated);

        return redirect()->route('user.vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    /**
     * Remove the specified vehicle.
     */
    public function destroy(Request $request, Vehicle $vehicle)
    {
        // Verify ownership
        if ($vehicle->user_id !== $request->user()->id) {
            abort(403);
        }

        // Soft delete by setting is_active to false
        $vehicle->update(['is_active' => false]);

        return redirect()->route('user.vehicles.index')
            ->with('success', 'Vehicle deleted successfully.');
    }
}
