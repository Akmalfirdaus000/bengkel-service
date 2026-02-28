<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceSubItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(Request $request)
    {
        $query = Service::with([
            'category',
            'subItems' => fn ($subItems) => $subItems->orderBy('sort_order')->orderBy('name'),
        ]);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->where('service_category_id', $request->category);
        }

        $services = $query->orderBy('sort_order')->orderBy('name')->paginate(10);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'categories' => ServiceCategory::active()->orderBy('sort_order')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create()
    {
        return Inertia::render('admin/services/create', [
            'categories' => ServiceCategory::active()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_category_id' => 'required|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:service_items',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        Service::create($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    /**
     * Show the form for editing the specified service.
     */
    public function edit(Service $service)
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service->load('category'),
            'categories' => ServiceCategory::active()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'service_category_id' => 'required|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:service_items,slug,' . $service->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $service->update($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }

    /**
     * Store a newly created sub item for a service item.
     */
    public function storeSubItem(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('service_sub_items', 'slug')
                    ->where('service_item_id', $service->id),
            ],
            'description' => 'nullable|string',
            'additional_price' => 'required|numeric|min:0',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $service->subItems()->create([
            ...$validated,
            'service_item_id' => $service->id,
        ]);

        return redirect()->route('admin.services.index')
            ->with('success', 'Sub item berhasil ditambahkan.');
    }

    /**
     * Update the specified sub item.
     */
    public function updateSubItem(Request $request, Service $service, ServiceSubItem $subItem)
    {
        if ($subItem->service_item_id !== $service->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('service_sub_items', 'slug')
                    ->where('service_item_id', $service->id)
                    ->ignore($subItem->id),
            ],
            'description' => 'nullable|string',
            'additional_price' => 'required|numeric|min:0',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $subItem->update($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Sub item berhasil diperbarui.');
    }

    /**
     * Remove the specified sub item.
     */
    public function destroySubItem(Service $service, ServiceSubItem $subItem)
    {
        if ($subItem->service_item_id !== $service->id) {
            abort(404);
        }

        $subItem->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Sub item berhasil dihapus.');
    }
}
