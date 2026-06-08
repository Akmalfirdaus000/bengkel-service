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
    Users,
    Car,
    Activity,
    DollarSign
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    total_bookings: number;
    total_spent: number | null;
    vehicles: Array<{
        brand: string;
        model: string;
        plate_number: string;
    }>;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface CustomersReportProps {
    customers: {
        data: Customer[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    summary: {
        total_customers: number;
        active_period: number;
        total_vehicles: number;
    };
    filters: {
        date_from: string;
        date_to: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Owner', href: '/owner/dashboard' },
    { title: 'Laporan', href: '/owner/reports' },
    { title: 'Laporan Customer', href: '/owner/reports/customers' },
];

const formatCurrency = (value: number | null) => {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value || 0)}`;
};

export default function CustomersReport({ customers, summary, filters }: CustomersReportProps) {
    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams(formData as any).toString();
        window.location.href = `/owner/reports/customers?${params}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Customer" />

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
                                            <Users className="mr-1 h-3 w-3" />
                                            Pelanggan
                                        </Badge>
                                        <Badge variant="outline" className="border-white/30 text-white/90 text-xs">
                                            Owner Report
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Laporan Customer & Kendaraan
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Analisis aktivitas pelanggan, kepemilikan kendaraan, dan kontribusi pendapatan.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <a href={`/owner/reports/customers/export-pdf?date_from=${filters.date_from}&date_to=${filters.date_to}`}>
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

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Pelanggan Terdaftar
                            </CardTitle>
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-slate-900">{summary.total_customers}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Pelanggan Aktif (Periode Ini)
                            </CardTitle>
                            <div className="rounded-lg bg-emerald-100 p-2">
                                <Activity className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-emerald-600">{summary.active_period}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Kendaraan
                            </CardTitle>
                            <div className="rounded-lg bg-violet-100 p-2">
                                <Car className="h-4 w-4 text-violet-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-violet-600">{summary.total_vehicles}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Filter className="h-5 w-5 text-blue-600" />
                            Filter Aktivitas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">Dari Tanggal Transaksi</label>
                                <Input name="date_from" type="date" defaultValue={filters.date_from} className="border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">Sampai Tanggal Transaksi</label>
                                <Input name="date_to" type="date" defaultValue={filters.date_to} className="border-slate-200" />
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Terapkan Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Customers Table */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Users className="h-5 w-5 text-blue-600" />
                            Daftar Pelanggan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Pelanggan</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Kontak</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Kendaraan</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">Total Servis (Periode)</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Total Transaksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {customers.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Users className="mb-2 h-12 w-12 text-slate-300" />
                                                    <p>Tidak ada data pelanggan.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        customers.data.map((customer, idx) => (
                                            <tr key={customer.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="font-bold text-slate-900">{customer.name}</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="text-slate-900">{customer.phone || '-'}</div>
                                                    <div className="text-xs text-slate-500">{customer.email}</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    {customer.vehicles && customer.vehicles.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {customer.vehicles.map((v, i) => (
                                                                <div key={i} className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="text-xs font-medium">
                                                                        {v.plate_number}
                                                                    </Badge>
                                                                    <span className="text-xs text-slate-600">{v.brand} {v.model}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-xs">Belum ada kendaraan</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center text-sm font-semibold text-slate-900">
                                                    {customer.total_bookings}
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm font-bold text-emerald-600">
                                                    {formatCurrency(customer.total_spent)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {customers.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                    Menampilkan {customers.from} - {customers.to} dari {customers.total} data
                                </div>
                                <div className="flex gap-2">
                                    {customers.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
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
        </AppLayout>
    );
}
