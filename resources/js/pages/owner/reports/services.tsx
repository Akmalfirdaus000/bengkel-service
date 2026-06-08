import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Download,
    Filter,
    ArrowLeft,
    Wrench,
    TrendingUp,
    ListChecks,
    Car
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ServiceItem {
    id: number;
    name: string;
    pivot?: {
        subtotal: number;
        quantity: number;
    };
}

interface Booking {
    id: number;
    queue_number: string;
    booking_date: string;
    final_amount: number;
    user: {
        name: string;
    };
    vehicle: {
        brand: string;
        model: string;
        plate_number: string;
    };
    mechanics: Array<{
        name: string;
    }>;
    service_items: ServiceItem[];
}

interface TopService {
    name: string;
    total_revenue: number;
    total_sold: number;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface ServicesReportProps {
    services: {
        data: Booking[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    topServices: TopService[];
    summary: {
        total_service_transactions: number;
        total_items_sold: number;
    };
    filters: {
        date_from: string;
        date_to: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Owner', href: '/owner/dashboard' },
    { title: 'Laporan', href: '/owner/reports' },
    { title: 'Laporan Servis', href: '/owner/reports/services' },
];

const formatCurrency = (value: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
};

export default function ServicesReport({ services, topServices, summary, filters }: ServicesReportProps) {
    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams(formData as any).toString();
        window.location.href = `/owner/reports/services?${params}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Servis" />

            <div className="min-h-screen w-full min-w-0 space-y-6 overflow-x-hidden bg-slate-50 p-3 md:p-6">
                {/* Header Section */}
                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-8">
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
                                            <Wrench className="mr-1 h-3 w-3" />
                                            Servis
                                        </Badge>
                                        <Badge variant="outline" className="border-white/30 text-white/90 text-xs">
                                            Owner Report
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Laporan Riwayat Servis
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Detail riwayat servis pelanggan, item servis yang digunakan, serta rekap layanan terpopuler.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <a href={`/owner/reports/services/export-pdf?date_from=${filters.date_from}&date_to=${filters.date_to}`}>
                                        <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export PDF
                                        </Button>
                                    </a>
                                    <Link href="/owner/reports">
                                        <Button className="bg-white/20 text-white hover:bg-white/30 border border-white/30">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column: Top Services & Filters */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-slate-200 bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trans. Selesai</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-blue-600">{summary.total_service_transactions}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">Item Servis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-emerald-600">{summary.total_items_sold}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filter Card */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <Filter className="h-5 w-5 text-blue-600" />
                                    Filter Tanggal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFilter} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-600">Dari Tanggal</label>
                                        <Input name="date_from" type="date" defaultValue={filters.date_from} className="border-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-600">Sampai Tanggal</label>
                                        <Input name="date_to" type="date" defaultValue={filters.date_to} className="border-slate-200" />
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                        Terapkan Filter
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Top Services Card */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Servis Terpopuler
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {topServices.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-4">Belum ada data servis terjual.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {topServices.map((service, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{service.name}</p>
                                                    <p className="text-xs text-slate-500">{service.total_sold}x dipesan</p>
                                                </div>
                                                <div className="text-right ml-2">
                                                    <p className="text-sm font-bold text-emerald-600">
                                                        {formatCurrency(service.total_revenue)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Services Table */}
                    <div className="lg:col-span-2">
                        <Card className="border-slate-200 bg-white h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <ListChecks className="h-5 w-5 text-blue-600" />
                                    Riwayat Detail Servis Pelanggan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tanggal/Antrian</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Pelanggan/Kendaraan</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Mekanik</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Item Servis</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {services.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Wrench className="mb-2 h-12 w-12 text-slate-300" />
                                                            <p>Tidak ada riwayat servis untuk periode ini.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                services.data.map((booking, idx) => (
                                                    <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                        <td className="px-4 py-4 text-sm align-top">
                                                            <div className="font-semibold text-slate-900">
                                                                {new Date(booking.booking_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-1">#{booking.queue_number}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm align-top">
                                                            <div className="font-semibold text-slate-900">{booking.user.name}</div>
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                                                                <Car className="h-3 w-3" />
                                                                <span>{booking.vehicle.plate_number}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm align-top">
                                                            {booking.mechanics.length > 0 ? (
                                                                <div className="flex flex-col gap-1">
                                                                    {booking.mechanics.map((m, i) => (
                                                                        <span key={i} className="text-xs font-medium text-slate-700">{m.name}</span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-slate-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm align-top">
                                                            {booking.service_items && booking.service_items.length > 0 ? (
                                                                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                                                    {booking.service_items.map((item, i) => (
                                                                        <li key={i}>{item.name}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span className="text-xs text-slate-400 italic">Tidak ada item tercatat</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm font-bold text-slate-900 align-top">
                                                            {formatCurrency(booking.final_amount)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {services.last_page > 1 && (
                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
                                        <div className="text-sm text-slate-600 hidden sm:block">
                                            {services.from} - {services.to} dari {services.total}
                                        </div>
                                        <div className="flex gap-2">
                                            {services.links.map((link, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={link.url || '#'}
                                                    className={`rounded-lg px-2 py-1 text-sm font-semibold transition-colors ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
