<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceSubItem;
use Illuminate\Database\Seeder;

class ServiceSubItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $oilService = Service::where('slug', 'ganti-oli')->firstOrFail();
        $brakeService = Service::where('slug', 'servis-rem')->firstOrFail();

        $subItems = [
            // Oli: 3 sub item
            [
                'service_item_id' => $oilService->id,
                'name' => 'Oli Mineral',
                'slug' => 'oli-mineral',
                'description' => 'Pilihan ekonomis untuk penggunaan normal.',
                'additional_price' => 0,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'service_item_id' => $oilService->id,
                'name' => 'Oli Semi-Sintetik',
                'slug' => 'oli-semi-sintetik',
                'description' => 'Performa lebih stabil dengan harga menengah.',
                'additional_price' => 75000,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'service_item_id' => $oilService->id,
                'name' => 'Oli Sintetik',
                'slug' => 'oli-sintetik',
                'description' => 'Perlindungan maksimum untuk performa tinggi.',
                'additional_price' => 150000,
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Rem: 3 sub item
            [
                'service_item_id' => $brakeService->id,
                'name' => 'Pembersihan Rem',
                'slug' => 'pembersihan-rem',
                'description' => 'Pembersihan kampas dan komponen rem.',
                'additional_price' => 0,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'service_item_id' => $brakeService->id,
                'name' => 'Ganti Kampas Rem',
                'slug' => 'ganti-kampas-rem',
                'description' => 'Penggantian kampas rem depan/belakang.',
                'additional_price' => 200000,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'service_item_id' => $brakeService->id,
                'name' => 'Servis Kaliper Rem',
                'slug' => 'servis-kaliper-rem',
                'description' => 'Perbaikan dan penyetelan kaliper rem.',
                'additional_price' => 300000,
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($subItems as $subItem) {
            ServiceSubItem::updateOrCreate(
                [
                    'service_item_id' => $subItem['service_item_id'],
                    'slug' => $subItem['slug'],
                ],
                $subItem
            );
        }
    }
}
