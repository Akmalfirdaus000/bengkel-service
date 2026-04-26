<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'owner@sujabengkel.com'],
            [
                'name' => 'Owner Pemilik',
                'email' => 'owner@sujabengkel.com',
                'password' => bcrypt('password'),
                'role' => 'owner',
                'phone' => '081122334455',
            ]
        );
    }
}
