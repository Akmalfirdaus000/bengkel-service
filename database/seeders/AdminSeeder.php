<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@sujabengkel.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@sujabengkel.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'phone' => '081234567890',
            ]
        );
    }
}
