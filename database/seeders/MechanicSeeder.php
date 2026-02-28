<?php

namespace Database\Seeders;

use App\Models\Mechanic;
use Illuminate\Database\Seeder;

class MechanicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mechanics = [
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567891',
                'email' => 'budi@sujabengkel.com',
                'specialization' => 'Engine Specialist',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Ahmad Pratama',
                'phone' => '081234567892',
                'email' => 'ahmad@sujabengkel.com',
                'specialization' => 'Brake & Suspension',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Dedi Kurniawan',
                'phone' => '081234567893',
                'email' => 'dedi@sujabengkel.com',
                'specialization' => 'Electrical Systems',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Rudi Hartono',
                'phone' => '081234567894',
                'email' => 'rudi@sujabengkel.com',
                'specialization' => 'AC & Climate Control',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Fajar Nugraha',
                'phone' => '081234567895',
                'email' => 'fajar@sujabengkel.com',
                'specialization' => 'General Service',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Hendra Wijaya',
                'phone' => '081234567896',
                'email' => 'hendra@sujabengkel.com',
                'specialization' => 'Engine Specialist',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Irfan Maulana',
                'phone' => '081234567897',
                'email' => 'irfan@sujabengkel.com',
                'specialization' => 'Transmission',
                'is_available' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Joko Susilo',
                'phone' => '081234567898',
                'email' => 'joko@sujabengkel.com',
                'specialization' => 'General Service',
                'is_available' => true,
                'is_active' => true,
            ],
        ];

        foreach ($mechanics as $mechanic) {
            Mechanic::updateOrCreate(
                ['email' => $mechanic['email']],
                $mechanic
            );
        }
    }
}
