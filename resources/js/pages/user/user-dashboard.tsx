import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Car, CheckCircle, Clock, Plus, Wrench, Activity } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { BookingCard } from '@/components/booking/booking-card';
import { cn } from '@/lib/utils';

interface DashboardProps {
    stats: {
        active_bookings: number;
        completed_bookings: number;
        total_vehicles: number;
    };
    activeBookings: Array<any>;
    recentBookings: Array<any>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
    },
];

export default function UserDashboard({ stats, activeBookings, recentBookings }: DashboardProps) {
    const statCards = [
        {
            title: 'Booking Aktif',
            value: String(stats.active_bookings),
            description: 'Sedang diproses',
            icon: Clock,
            accent: 'from-amber-500 to-orange-600',
        },
        {
            title: 'Booking Selesai',
            value: String(stats.completed_bookings),
            description: 'Servis selesai',
            icon: CheckCircle,
            accent: 'from-emerald-500 to-green-600',
        },
        {
            title: 'Total Kendaraan',
            value: String(stats.total_vehicles),
            description: 'Terdaftar',
            icon: Car,
            accent: 'from-blue-500 to-blue-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen w-full min-w-0 space-y-6 overflow-x-hidden bg-slate-50 p-3 md:p-6">
                {/* Header Section */}
                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-8">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-start justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <Activity className="mr-1 h-3 w-3" />
                                            Live
                                        </Badge>
                                        <Badge variant="outline" className="border-white/30 text-white/90 text-xs">
                                            Bengkel Service
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Dashboard Pelanggan
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Selamat datang kembali! Kelola booking servis, pantau status, dan riwayat kendaraan Anda dengan mudah.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {statCards.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.title} className="flex min-w-0 items-center gap-3">
                                        <div className={cn('rounded-lg bg-gradient-to-br', stat.accent, 'p-2')}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="truncate text-xs font-medium text-slate-600">{stat.title}</p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-500">{stat.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                {/* <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={stat.title}
                                className="border-slate-200 bg-white transition-shadow hover:shadow-lg"
                            >
                                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            {stat.title}
                                        </CardTitle>
                                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    </div>
                                    <div
                                        className={cn('rounded-xl bg-gradient-to-br', stat.accent, 'p-3 text-white shadow-lg')}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-slate-600">{stat.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section> */}

                {/* Quick Actions */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    <Link href="/user/bookings/create">
                        <Card className="group border-slate-200 bg-white transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                    <Wrench className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">Booking Servis</h3>
                                    <p className="text-sm text-slate-600">
                                        Jadwalkan servis baru untuk kendaraan Anda
                                    </p>
                                </div>
                                <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-blue-100 transition-colors">
                                    <Plus className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/user/vehicles/create">
                        <Card className="group border-slate-200 bg-white transition-all hover:shadow-lg hover:border-emerald-300 cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                    <Car className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">Tambah Kendaraan</h3>
                                    <p className="text-sm text-slate-600">
                                        Tambah kendaraan baru ke akun Anda
                                    </p>
                                </div>
                                <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-emerald-100 transition-colors">
                                    <Plus className="h-5 w-5 text-slate-600 group-hover:text-emerald-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </section>

                {/* Active Bookings */}
                {activeBookings.length > 0 && (
                    <>
                        {/* Next Queue - Prominent Display */}
                        {activeBookings[0]?.queue_number && (
                            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        Antrian Selanjutnya
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Nomor Antrian</p>
                                            <p className="text-5xl font-bold text-blue-600">{activeBookings[0].queue_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-600 font-medium">Kendaraan</p>
                                            <p className="text-lg font-semibold text-slate-900">
                                                {activeBookings[0].vehicle.brand} {activeBookings[0].vehicle.model}
                                            </p>
                                            <p className="text-sm text-slate-500">{activeBookings[0].vehicle.plate_number}</p>
                                            {activeBookings[0].estimated_start_time && (
                                                <p className="text-sm font-semibold mt-2 text-blue-600">
                                                    {new Date(activeBookings[0].estimated_start_time).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Active Bookings List */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                        Booking Aktif
                                    </CardTitle>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Servis yang sedang diproses
                                    </p>
                                </div>
                                <Link href="/user/bookings">
                                    <Button variant="outline" className="border-slate-200">
                                        Lihat semua
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {activeBookings.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Recent Bookings */}
                {recentBookings.length > 0 && (
                    <Card className="border-slate-200 bg-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    Booking Terbaru
                                </CardTitle>
                                <p className="text-sm text-slate-600 mt-1">
                                    Riwayat servis terakhir
                                </p>
                            </div>
                            <Link href="/user/bookings">
                                <Button variant="outline" className="border-slate-200">
                                    Lihat semua
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {recentBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {activeBookings.length === 0 && recentBookings.length === 0 && (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="rounded-full bg-slate-100 p-6">
                                <Calendar className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Belum ada booking</h3>
                            <p className="mt-2 text-sm text-slate-600 text-center max-w-md">
                                Mulai dengan melakukan booking servis pertama Anda untuk kendaraan Anda
                            </p>
                            <Link href="/user/bookings/create" className="mt-6">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Wrench className="mr-2 h-4 w-4" />
                                    Booking Servis Sekarang
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
