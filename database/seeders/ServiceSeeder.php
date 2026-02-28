<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $berkala = ServiceCategory::where('slug', 'service-berkala')->firstOrFail();
        $ringan = ServiceCategory::where('slug', 'service-ringan')->firstOrFail();
        $berat = ServiceCategory::where('slug', 'service-berat')->firstOrFail();

        $services = [
            // Service Berkala
            [
                'service_category_id' => $berkala->id,
                'name' => 'Ganti Oli',
                'slug' => 'ganti-oli',
                'description' => 'Ganti oli mesin sesuai kebutuhan kendaraan.',
                'price' => 250000,
                'duration' => '30 menit',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'service_category_id' => $berkala->id,
                'name' => 'Servis Rem',
                'slug' => 'servis-rem',
                'description' => 'Pemeriksaan dan perawatan sistem pengereman.',
                'price' => 200000,
                'duration' => '45 menit',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'service_category_id' => $berkala->id,
                'name' => 'Tune Up',
                'slug' => 'tune-up',
                'description' => 'Penyetelan menyeluruh untuk menjaga performa mesin.',
                'price' => 350000,
                'duration' => '1 jam',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Service Ringan
            [
                'service_category_id' => $ringan->id,
                'name' => 'Servis AC',
                'slug' => 'servis-ac',
                'description' => 'Pengecekan dan perawatan sistem AC.',
                'price' => 180000,
                'duration' => '45 menit',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'service_category_id' => $ringan->id,
                'name' => 'Balancing & Rotasi Ban',
                'slug' => 'balancing-rotasi-ban',
                'description' => 'Menjaga kestabilan dan umur ban kendaraan.',
                'price' => 150000,
                'duration' => '30 menit',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'service_category_id' => $ringan->id,
                'name' => 'Diagnosa Mesin',
                'slug' => 'diagnosa-mesin',
                'description' => 'Pemeriksaan menggunakan scanner untuk deteksi masalah awal.',
                'price' => 175000,
                'duration' => '30 menit',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Service Berat
            [
                'service_category_id' => $berat->id,
                'name' => 'Overhaul Mesin',
                'slug' => 'overhaul-mesin',
                'description' => 'Perbaikan besar pada mesin kendaraan.',
                'price' => 2500000,
                'duration' => '2-3 hari',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'service_category_id' => $berat->id,
                'name' => 'Servis Transmisi',
                'slug' => 'servis-transmisi',
                'description' => 'Perawatan dan perbaikan pada sistem transmisi.',
                'price' => 1200000,
                'duration' => '1 hari',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'service_category_id' => $berat->id,
                'name' => 'Servis Kaki-kaki',
                'slug' => 'servis-kaki-kaki',
                'description' => 'Perbaikan suspensi dan komponen kaki-kaki kendaraan.',
                'price' => 900000,
                'duration' => '1 hari',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }

        Service::query()
            ->whereNotIn('slug', collect($services)->pluck('slug'))
            ->update(['is_active' => false]);
    }
}
