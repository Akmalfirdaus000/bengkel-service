<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Booking;
use App\Models\Mechanic;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServiceSubItem;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'phone' => '081234567801',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'phone' => '081234567802',
            ],
            [
                'name' => 'Robert Johnson',
                'email' => 'robert@example.com',
                'password' => bcrypt('password'),
                'role' => 'user',
                'phone' => '081234567803',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // Get demo users
        $user1 = User::where('email', 'john@example.com')->first();
        $user2 = User::where('email', 'jane@example.com')->first();
        $user3 = User::where('email', 'robert@example.com')->first();

        // Create vehicles for users
        $vehicles = [
            [
                'user_id' => $user1->id,
                'brand' => 'Toyota',
                'model' => 'Avanza',
                'plate_number' => 'B 1234 ABC',
                'year' => '2020',
                'color' => 'Silver',
            ],
            [
                'user_id' => $user1->id,
                'brand' => 'Honda',
                'model' => 'Jazz',
                'plate_number' => 'B 5678 XYZ',
                'year' => '2021',
                'color' => 'Red',
            ],
            [
                'user_id' => $user2->id,
                'brand' => 'Suzuki',
                'model' => 'Ertiga',
                'plate_number' => 'D 1234 DEF',
                'year' => '2019',
                'color' => 'Blue',
            ],
            [
                'user_id' => $user3->id,
                'brand' => 'Mitsubishi',
                'model' => 'Xpander',
                'plate_number' => 'B 9012 GHI',
                'year' => '2022',
                'color' => 'White',
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::updateOrCreate(
                ['plate_number' => $vehicle['plate_number']],
                $vehicle
            );
        }

        // Get vehicles
        $avanza = Vehicle::where('plate_number', 'B 1234 ABC')->first();
        $jazz = Vehicle::where('plate_number', 'B 5678 XYZ')->first();
        $ertiga = Vehicle::where('plate_number', 'D 1234 DEF')->first();
        $xpander = Vehicle::where('plate_number', 'B 9012 GHI')->first();

        // Get services
        $oilChange = Service::where('slug', 'ganti-oli')->first();
        $tuneUp = Service::where('slug', 'tune-up')->first();
        $brakeService = Service::where('slug', 'servis-rem')->first();
        $acService = Service::where('slug', 'servis-ac')->first();
        $diagnostic = Service::where('slug', 'diagnosa-mesin')->first();

        $syntheticOil = ServiceSubItem::where('slug', 'oli-sintetik')->first();
        $semiSyntheticOil = ServiceSubItem::where('slug', 'oli-semi-sintetik')->first();
        $replaceBrakePad = ServiceSubItem::where('slug', 'ganti-kampas-rem')->first();

        // Get mechanics
        $mechanic1 = Mechanic::where('email', 'budi@sujabengkel.com')->first();
        $mechanic2 = Mechanic::where('email', 'ahmad@sujabengkel.com')->first();
        $mechanic3 = Mechanic::where('email', 'dedi@sujabengkel.com')->first();

        // Create demo bookings
        $today = now();
        $yesterday = now()->subDay();
        $tomorrow = now()->addDay();

        $bookings = [
            [
                'user_id' => $user1->id,
                'vehicle_id' => $avanza->id,
                'booking_date' => $today->copy()->addHours(2),
                'status' => 'in_progress',
                'payment_status' => 'unpaid',
                'total_amount' => 0,
                'final_amount' => 0,
                'services' => [
                    ['service' => $oilChange, 'sub_item' => $syntheticOil],
                    ['service' => $tuneUp, 'sub_item' => null],
                ],
                'mechanics' => [$mechanic1, $mechanic3],
            ],
            [
                'user_id' => $user2->id,
                'vehicle_id' => $ertiga->id,
                'booking_date' => $yesterday->copy()->setHour(10)->setMinute(0),
                'status' => 'completed',
                'payment_status' => 'paid',
                'total_amount' => 0,
                'final_amount' => 0,
                'services' => [
                    ['service' => $brakeService, 'sub_item' => $replaceBrakePad],
                ],
                'mechanics' => [$mechanic2],
                'completed_at' => $yesterday,
            ],
            [
                'user_id' => $user3->id,
                'vehicle_id' => $xpander->id,
                'booking_date' => $tomorrow->copy()->setHour(9)->setMinute(0),
                'status' => 'confirmed',
                'payment_status' => 'unpaid',
                'total_amount' => 0,
                'final_amount' => 0,
                'services' => [
                    ['service' => $diagnostic, 'sub_item' => null],
                    ['service' => $acService, 'sub_item' => null],
                ],
                'mechanics' => [$mechanic3],
            ],
            [
                'user_id' => $user1->id,
                'vehicle_id' => $jazz->id,
                'booking_date' => $tomorrow->copy()->addDay()->setHour(14)->setMinute(0),
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total_amount' => 0,
                'final_amount' => 0,
                'services' => [
                    ['service' => $oilChange, 'sub_item' => $semiSyntheticOil],
                    ['service' => $tuneUp, 'sub_item' => null],
                ],
                'mechanics' => [],
            ],
        ];

        foreach ($bookings as $bookingData) {
            $services = $bookingData['services'];
            $mechanics = $bookingData['mechanics'];
            unset($bookingData['services'], $bookingData['mechanics']);

            // Calculate total
            $total = collect($services)->sum(function (array $line) {
                $servicePrice = (float) ($line['service']?->price ?? 0);
                $subItemPrice = (float) ($line['sub_item']?->additional_price ?? 0);
                return $servicePrice + $subItemPrice;
            });
            $bookingData['total_amount'] = $total;
            $bookingData['final_amount'] = $total;

            $booking = Booking::updateOrCreate(
                [
                    'user_id' => $bookingData['user_id'],
                    'vehicle_id' => $bookingData['vehicle_id'],
                    'booking_date' => $bookingData['booking_date'],
                ],
                $bookingData
            );

            // Attach services
            foreach ($services as $line) {
                $service = $line['service'];
                if (!$service) {
                    continue;
                }

                $subItem = $line['sub_item'] ?? null;
                $linePrice = (float) $service->price + (float) ($subItem?->additional_price ?? 0);

                ServiceItem::updateOrCreate(
                    [
                        'booking_id' => $booking->id,
                        'service_item_id' => $service->id,
                    ],
                    [
                        'service_sub_item_id' => $subItem?->id,
                        'quantity' => 1,
                        'unit_price' => $linePrice,
                        'subtotal' => $linePrice,
                    ]
                );
            }

            // Attach mechanics
            if (!empty($mechanics)) {
                $booking->mechanics()->sync(collect($mechanics)->pluck('id'));
            }
        }

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Admin credentials: admin@sujabengkel.com / password');
        $this->command->info('Demo user credentials: john@example.com / password');
    }
}
