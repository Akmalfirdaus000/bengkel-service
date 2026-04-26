import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Car, TrendingUp, Activity, Calendar, DollarSign, Calculator, Download } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ReportsIndexProps {
    bookingsByStatus: Record<string, number>;
    topVehicles: Array<{
        vehicle_id: number;
        booking_count: number;
        vehicle?: {
            brand: string;
            model: string;
            plate_number: string;
        } | null;
    }>;
    revenueSummary: {
        total_completed: number | string | null;
        total_revenue: number | string | null;
        avg_revenue: number | string | null;
    };
    filters: {
        date_from: string;
        date_to: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Laporan', href: '/admin/reports' },
];

const toNumber = (value: number | string | null | undefined) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (value: number | string | null | undefined) =>
    `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(toNumber(value))}`;

export default function ReportsIndex({ bookingsByStatus, topVehicles, revenueSummary, filters }: ReportsIndexProps) {
    const statusEntries = Object.entries(bookingsByStatus || {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />

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
                                        Laporan Operasional
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Ringkasan booking dan pendapatan bengkel. Analisis performa operasional secara real-time.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Link href={`/admin/reports/export-pdf?date_from=${filters.date_from}&date_to=${filters.date_to}`}>
                                        <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                                            <Download className="mr-2 h-4 w-4" />
                                            Ekspor PDF
                                        </Button>
                                    </Link>
                                    <Link href="/admin/reports/revenue">
                                        <Button className="bg-white text-blue-700 hover:bg-blue-50">
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            Laporan Pendapatan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2">
                                    <Calculator className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Servis Selesai</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {toNumber(revenueSummary?.total_completed)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-violet-500 p-2">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Pendapatan</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {formatCurrency(revenueSummary?.total_revenue)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2">
                                    <BarChart3 className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Rata-rata/Booking</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {formatCurrency(revenueSummary?.avg_revenue)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Filter Tanggal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="/admin/reports" method="get" className="grid gap-4 md:grid-cols-3">
                            <Input name="date_from" type="date" defaultValue={filters.date_from} className="border-slate-200" />
                            <Input name="date_to" type="date" defaultValue={filters.date_to} className="border-slate-200" />
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Terapkan</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Servis Selesai</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-slate-900">{toNumber(revenueSummary?.total_completed)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Pendapatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(revenueSummary?.total_revenue)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-rata per Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(revenueSummary?.avg_revenue)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                Booking per Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {statusEntries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <BarChart3 className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Tidak ada data pada rentang tanggal ini.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {statusEntries.map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                            <span className="font-semibold text-slate-900 capitalize">{status.replace('_', ' ')}</span>
                                            <span className="text-lg font-bold text-blue-600">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                <Car className="h-5 w-5 text-blue-600" />
                                Kendaraan Teratas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topVehicles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <Car className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Belum ada data kendaraan.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topVehicles.map((item) => (
                                        <div key={item.vehicle_id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model}` : 'Kendaraan dihapus'}
                                                </p>
                                                <p className="text-sm text-slate-600">{item.vehicle?.plate_number || '-'}</p>
                                            </div>
                                            <span className="text-lg font-bold text-blue-600">{item.booking_count}x</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
