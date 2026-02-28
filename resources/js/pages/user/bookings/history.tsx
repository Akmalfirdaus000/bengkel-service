import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, CalendarCheck2, Clock3, Wallet, Activity, History as HistoryIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { BookingCard } from '@/components/booking/booking-card';
import { cn } from '@/lib/utils';

interface HistoryProps {
    bookings: Array<{
        id: number;
        booking_date: string;
        status: string;
        payment_status: string;
        final_amount: number | string;
        vehicle: {
            brand: string;
            model: string;
            plate_number: string;
        };
        services: Array<{ name: string }>;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Riwayat Servis', href: '/user/bookings/history' },
];

export default function History({ bookings }: HistoryProps) {
    const paidCount = bookings.filter((booking) => booking.payment_status === 'paid').length;
    const unpaidCount = bookings.filter((booking) => booking.payment_status !== 'paid' && booking.status !== 'cancelled').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Servis" />

            <div className="min-h-screen w-full min-w-0 space-y-6 overflow-x-hidden bg-slate-50 p-3 md:p-6">
                {/* Header Section */}
                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-8">
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
                                            Archive
                                        </Badge>
                                        <Badge variant="outline" className="border-white/30 text-white/90 text-xs">
                                            Bengkel Service
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Riwayat Servis
                                    </h1>
                                    <p className="max-w-2xl text-emerald-100">
                                        Daftar servis yang sudah selesai dikerjakan. Lihat detail dan riwayat transaksi.
                                    </p>
                                </div>

                                <Link href="/user/bookings/create">
                                    <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Booking Baru
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2">
                                    <CalendarCheck2 className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Booking</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {bookings.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2">
                                    <Clock3 className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Sudah Dibayar</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {paidCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-violet-500 p-2">
                                    <Wallet className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Belum Dibayar</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {unpaidCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                {/* <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                            <div className="space-y-1">
                                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Total Booking
                                </CardTitle>
                                <div className="text-2xl font-bold text-slate-900">{bookings.length}</div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
                                <CalendarCheck2 className="h-5 w-5" />
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                            <div className="space-y-1">
                                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Sudah Dibayar
                                </CardTitle>
                                <div className="text-2xl font-bold text-slate-900">{paidCount}</div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 text-white shadow-lg">
                                <Clock3 className="h-5 w-5" />
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                            <div className="space-y-1">
                                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Belum Dibayar
                                </CardTitle>
                                <div className="text-2xl font-bold text-slate-900">{unpaidCount}</div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3 text-white shadow-lg">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </CardHeader>
                    </Card>
                </section> */}

                {/* Bookings List */}
                {bookings.length > 0 ? (
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                <HistoryIcon className="h-5 w-5 text-emerald-600" />
                                Daftar Booking Selesai
                            </CardTitle>
                            <p className="text-sm text-slate-600">
                                {bookings.length} servis selesai tersimpan pada riwayat
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                                {bookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="rounded-full bg-slate-100 p-6">
                                <HistoryIcon className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Riwayat masih kosong</h3>
                            <p className="mt-2 text-sm text-slate-600 text-center max-w-md">
                                Servis yang sudah selesai akan tampil di sini.
                            </p>
                            <Link href="/user/bookings/create" className="mt-6">
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    <Plus className="mr-2 h-4 w-4" />
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
