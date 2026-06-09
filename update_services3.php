<?php
use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\ServiceSubItem;

// We'll just add Service Berat to the most recent 'Paket Servis' category
$cat1 = ServiceCategory::where('name', 'Paket Servis')->orderBy('id', 'desc')->first();

if ($cat1) {
    Service::firstOrCreate(
        ['slug' => 'service-berat-' . time()],
        [
            'service_category_id' => $cat1->id,
            'name' => 'Service Berat',
            'description' => 'Servis berat / overhaul mesin',
            'price' => 1500000,
            'duration' => '3 hari',
            'is_active' => true,
            'sort_order' => 3
        ]
    );
}

// Add more spareparts to Pergantian Sparepart & Cairan
$cat2 = ServiceCategory::where('name', 'Pergantian Sparepart & Cairan')->orderBy('id', 'desc')->first();

if ($cat2) {
    // Busi
    $busi = Service::firstOrCreate(
        ['slug' => 'ganti-busi-' . time()],
        [
            'service_category_id' => $cat2->id,
            'name' => 'Ganti Busi',
            'description' => 'Jasa pemasangan gratis, pilih merk busi',
            'price' => 0,
            'duration' => '10 menit',
            'is_active' => true,
            'sort_order' => 3
        ]
    );
    ServiceSubItem::create(['service_item_id' => $busi->id, 'name' => 'Busi NGK', 'slug' => 'busi-ngk-' . time(), 'additional_price' => 25000, 'is_active' => true, 'sort_order' => 1]);
    ServiceSubItem::create(['service_item_id' => $busi->id, 'name' => 'Busi Denso', 'slug' => 'busi-denso-' . time(), 'additional_price' => 20000, 'is_active' => true, 'sort_order' => 2]);
    ServiceSubItem::create(['service_item_id' => $busi->id, 'name' => 'Busi TDR Racing', 'slug' => 'busi-tdr-' . time(), 'additional_price' => 65000, 'is_active' => true, 'sort_order' => 3]);

    // V-Belt / Rantai
    $penggerak = Service::firstOrCreate(
        ['slug' => 'ganti-vbelt-rantai-' . time()],
        [
            'service_category_id' => $cat2->id,
            'name' => 'Ganti V-Belt / Rantai',
            'description' => 'Jasa pemasangan gratis, pilih jenis komponen',
            'price' => 0,
            'duration' => '30 menit',
            'is_active' => true,
            'sort_order' => 4
        ]
    );
    ServiceSubItem::create(['service_item_id' => $penggerak->id, 'name' => 'V-Belt Original Honda', 'slug' => 'vbelt-honda-' . time(), 'additional_price' => 150000, 'is_active' => true, 'sort_order' => 1]);
    ServiceSubItem::create(['service_item_id' => $penggerak->id, 'name' => 'V-Belt Original Yamaha', 'slug' => 'vbelt-yamaha-' . time(), 'additional_price' => 135000, 'is_active' => true, 'sort_order' => 2]);
    ServiceSubItem::create(['service_item_id' => $penggerak->id, 'name' => 'Gear Set Rantai (Full)', 'slug' => 'gear-set-' . time(), 'additional_price' => 250000, 'is_active' => true, 'sort_order' => 3]);

    // Filter Udara
    $filter = Service::firstOrCreate(
        ['slug' => 'ganti-filter-udara-' . time()],
        [
            'service_category_id' => $cat2->id,
            'name' => 'Ganti Filter Udara',
            'description' => 'Jasa pemasangan gratis, pilih filter',
            'price' => 0,
            'duration' => '10 menit',
            'is_active' => true,
            'sort_order' => 5
        ]
    );
    ServiceSubItem::create(['service_item_id' => $filter->id, 'name' => 'Filter Udara Original', 'slug' => 'filter-ori-' . time(), 'additional_price' => 60000, 'is_active' => true, 'sort_order' => 1]);
    ServiceSubItem::create(['service_item_id' => $filter->id, 'name' => 'Filter Udara Ferrox Racing', 'slug' => 'filter-ferrox-' . time(), 'additional_price' => 350000, 'is_active' => true, 'sort_order' => 2]);
}

echo "Extra Services updated successfully!\n";
