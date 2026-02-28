<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mechanic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MechanicController extends Controller
{
    /**
     * Display a listing of mechanics.
     */
    public function index(Request $request)
    {
        $query = Mechanic::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $mechanics = $query->withCount('bookings')->orderBy('name')->paginate(10);

        return Inertia::render('admin/mechanics/index', [
            'mechanics' => $mechanics,
        ]);
    }

    /**
     * Show the form for creating a new mechanic.
     */
    public function create()
    {
        return Inertia::render('admin/mechanics/create');
    }

    /**
     * Store a newly created mechanic.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'specialization' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        Mechanic::create($validated);

        return redirect()->route('admin.mechanics.index')
            ->with('success', 'Mechanic created successfully.');
    }

    /**
     * Show the form for editing the specified mechanic.
     */
    public function edit(Mechanic $mechanic)
    {
        return Inertia::render('admin/mechanics/edit', [
            'mechanic' => $mechanic->loadCount('bookings'),
        ]);
    }

    /**
     * Update the specified mechanic.
     */
    public function update(Request $request, Mechanic $mechanic)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'specialization' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $mechanic->update($validated);

        return redirect()->route('admin.mechanics.index')
            ->with('success', 'Mechanic updated successfully.');
    }

    /**
     * Remove the specified mechanic.
     */
    public function destroy(Mechanic $mechanic)
    {
        $mechanic->delete();

        return redirect()->route('admin.mechanics.index')
            ->with('success', 'Mechanic deleted successfully.');
    }
}
