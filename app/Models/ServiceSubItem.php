<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceSubItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'service_item_id',
        'name',
        'slug',
        'description',
        'additional_price',
        'is_active',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'additional_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Parent service item.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_item_id');
    }

    /**
     * Booking line items that choose this sub item.
     */
    public function serviceItems(): HasMany
    {
        return $this->hasMany(ServiceItem::class);
    }

    /**
     * Scope to filter active sub items.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
