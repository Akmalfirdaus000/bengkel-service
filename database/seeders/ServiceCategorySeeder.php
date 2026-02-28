<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Service Berkala',
                'slug' => 'service-berkala',
                'description' => 'Servis rutin untuk menjaga performa dan usia kendaraan.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Service Ringan',
                'slug' => 'service-ringan',
                'description' => 'Perawatan ringan dan perbaikan cepat harian.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Service Berat',
                'slug' => 'service-berat',
                'description' => 'Perbaikan komponen utama dan pekerjaan mekanikal berat.',
                'sort_order' => 3,
            ],
        ];

        foreach ($categories as $category) {
            ServiceCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        ServiceCategory::query()
            ->whereNotIn('slug', collect($categories)->pluck('slug'))
            ->update(['is_active' => false]);
    }
}
