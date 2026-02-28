import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, CalendarCheck2, Clock3, Wallet, Activity, Clock, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { BookingCard } from '@/components/booking/booking-card';
import { cn } from '@/lib/utils';

interface BookingsIndexProps {
    bookings: {
        data: Array<any>;
        links: Array<any>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Booking Saya', href: '/user/bookings' },
];

export default function BookingsIndex({ bookings }: BookingsIndexProps) {
    const data = bookings.data ?? [];
    const waitingStatuses = ['pending', 'confirmed', 'assigned'];
    const processingStatuses = ['in_progress', 'ready_to_pickup'];
    const sortByQueue = (a: any, b: any) => {
        const aQueue = Number(a.queue_order);
        const bQueue = Number(b.queue_order);
        const hasAQueue = Number.isFinite(aQueue) && aQueue > 0;
        const hasBQueue = Number.isFinite(bQueue) && bQueue > 0;

        if (hasAQueue && hasBQueue) return aQueue - bQueue;
        if (hasAQueue) return -1;
        if (hasBQueue) return 1;

        return new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime();
    };

    const waitingBookings = data.filter((booking) => waitingStatuses.includes(booking.status)).sort(sortByQueue);
    const processingBookings = data.filter((booking) => processingStatuses.includes(booking.status)).sort(sortByQueue);
    const waitingCount = waitingBookings.length;
    const inProgressCount = processingBookings.length;
    const unpaidCount = data.filter((booking) => booking.payment_status !== 'paid' && booking.status !== 'cancelled').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Saya" />

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
                                        Booking Saya
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Lihat progres servis, antrian, dan pembayaran Anda dalam satu tempat.
                                    </p>
                                </div>

                                <Link href="/user/bookings/create">
                                    <Button className="bg-white text-blue-700 hover:bg-blue-50">
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
                                            {data.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-amber-500 p-2">
                                    <Clock3 className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Menunggu</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {waitingCount}
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
                                        <p className="truncate text-xs font-medium text-slate-600">Belum Bayar</p>
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
                                <div className="text-2xl font-bold text-slate-900">{data.length}</div>
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
                                    Menunggu / Dijadwalkan
                                </CardTitle>
                                <div className="text-2xl font-bold text-slate-900">{waitingCount}</div>
                            </div>
                            <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-white shadow-lg">
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

                {/* Processing Bookings */}
                {data.length > 0 && (
                    <Card className="border-slate-200 bg-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Sedang Diproses
                                </CardTitle>
                                <p className="text-sm text-slate-600 mt-1">
                                    Booking yang saat ini sedang ditangani mekanik
                                </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                {processingBookings.length}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            {processingBookings.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                                    {processingBookings.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <Wrench className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Belum ada booking yang sedang diproses</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Waiting Bookings */}
                {data.length > 0 && (
                    <Card className="border-slate-200 bg-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <Clock3 className="h-5 w-5 text-amber-600" />
                                    Menunggu Antrian
                                </CardTitle>
                                <p className="text-sm text-slate-600 mt-1">
                                    Booking akan diproses sesuai nomor antrian
                                </p>
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                {waitingBookings.length}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            {waitingBookings.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                                    {waitingBookings.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <Clock3 className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Tidak ada booking yang menunggu antrian</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {data.length > 0 && bookings.links && bookings.links.length > 3 && (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-600">
                                    Menampilkan {data.length} booking
                                </p>
                                <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                                    {bookings.links.map((link: any, index: number) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={cn(
                                                    'rounded-lg px-3 py-2 text-sm transition',
                                                    link.active
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="rounded-lg px-3 py-2 text-sm text-slate-400"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {data.length === 0 && (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="rounded-full bg-slate-100 p-6">
                                <CalendarCheck2 className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Belum ada booking</h3>
                            <p className="mt-2 text-sm text-slate-600 text-center max-w-md">
                                Anda belum memiliki booking servis. Mulai dengan membuat booking servis pertama Anda.
                            </p>
                            <Link href="/user/bookings/create" className="mt-6">
                                <Button className="bg-blue-600 hover:bg-blue-700">
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
