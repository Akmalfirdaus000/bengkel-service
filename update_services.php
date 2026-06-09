<?php
use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\ServiceSubItem;
use Illuminate\Support\Str;

ServiceSubItem::truncate();
Service::truncate();
ServiceCategory::truncate();

$cat1 = ServiceCategory::create(['name' => 'Paket Servis', 'slug' => 'paket-servis', 'description' => 'Paket servis menyeluruh', 'is_active' => true, 'sort_order' => 1]);
$cat2 = ServiceCategory::create(['name' => 'Pergantian Sparepart & Cairan', 'slug' => 'sparepart-cairan', 'description' => 'Pembelian sparepart dan jasa pergantian', 'is_active' => true, 'sort_order' => 2]);

// Service Berkala
Service::create([
    'service_category_id' => $cat1->id,
    'name' => 'Service Berkala',
    'slug' => 'service-berkala',
    'description' => 'Servis komprehensif (pengecekan mesin, injeksi, kaki-kaki, dll)',
    'price' => 700000,
    'duration' => '2 jam',
    'is_active' => true,
    'sort_order' => 1
]);

// Service Ringan
Service::create([
    'service_category_id' => $cat1->id,
    'name' => 'Service Ringan',
    'slug' => 'service-ringan',
    'description' => 'Servis ringan dan pembersihan CVT/Injeksi',
    'price' => 200000,
    'duration' => '1 jam',
    'is_active' => true,
    'sort_order' => 2
]);

// Ganti Oli
$gantiOli = Service::create([
    'service_category_id' => $cat2->id,
    'name' => 'Ganti Oli Mesin',
    'slug' => 'ganti-oli-mesin',
    'description' => 'Jasa gratis, pilih jenis oli pada varian di bawah',
    'price' => 0,
    'duration' => '15 menit',
    'is_active' => true,
    'sort_order' => 1
]);

ServiceSubItem::create(['service_item_id' => $gantiOli->id, 'name' => 'Oli Yamaha Turbo', 'slug' => 'oli-yamaha-turbo', 'additional_price' => 100000, 'is_active' => true, 'sort_order' => 1]);
ServiceSubItem::create(['service_item_id' => $gantiOli->id, 'name' => 'Oli Motul 3000', 'slug' => 'oli-motul-3000', 'additional_price' => 150000, 'is_active' => true, 'sort_order' => 2]);
ServiceSubItem::create(['service_item_id' => $gantiOli->id, 'name' => 'Oli Enduro Racing', 'slug' => 'oli-enduro-racing', 'additional_price' => 85000, 'is_active' => true, 'sort_order' => 3]);

// Ganti Kampas Rem
$gantiRem = Service::create([
    'service_category_id' => $cat2->id,
    'name' => 'Ganti Kampas Rem',
    'slug' => 'ganti-kampas-rem',
    'description' => 'Jasa gratis, pilih jenis kampas rem',
    'price' => 0,
    'duration' => '30 menit',
    'is_active' => true,
    'sort_order' => 2
]);

ServiceSubItem::create(['service_item_id' => $gantiRem->id, 'name' => 'Kampas Rem Depan (Original)', 'slug' => 'kampas-depan-ori', 'additional_price' => 120000, 'is_active' => true, 'sort_order' => 1]);
ServiceSubItem::create(['service_item_id' => $gantiRem->id, 'name' => 'Kampas Rem Belakang (Original)', 'slug' => 'kampas-belakang-ori', 'additional_price' => 100000, 'is_active' => true, 'sort_order' => 2]);

echo "Services updated successfully!\n";
