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
    DollarSign,
    CheckCircle2,
    XCircle,
    Clock,
    Wrench,
    TrendingUp
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Transaction {
    id: number;
    queue_number: string;
    booking_date: string;
    status: string;
    payment_status: string;
    final_amount: number;
    user: {
        name: string;
        phone: string;
    };
    vehicle: {
        brand: string;
        model: string;
        plate_number: string;
    };
    mechanics: Array<{
        name: string;
    }>;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface TransactionsReportProps {
    bookings: {
        data: Transaction[];
        links: any[];
        meta: Pagination;
    };
    summary: {
        total_bookings: number;
        total_revenue: number;
        total_paid: number;
        total_unpaid: number;
    };
    filters: {
        date_from: string;
        date_to: string;
        status: string;
        payment_status: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Owner', href: '/owner/dashboard' },
    { title: 'Laporan Bisnis', href: '/owner/reports' },
    { title: 'Laporan Transaksi', href: '/owner/reports/transactions' },
];

const formatCurrency = (value: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
};

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
        completed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Selesai' },
        cancelled: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Dibatalkan' },
        in_progress: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Proses' },
        pending: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Menunggu' },
        confirmed: { color: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Dikonfirmasi' },
        assigned: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Ditugaskan' },
        ready_to_pickup: { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'Siap Ambil' },
    };

    const { color, label } = statusMap[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', label: status };
    return <Badge className={color}>{label}</Badge>;
};

const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
        paid: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Lunas' },
        unpaid: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Belum Bayar' },
        partial: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Sebagian' },
        refunded: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Dikembalikan' },
    };

    const { color, label } = statusMap[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', label: status };
    return <Badge className={color}>{label}</Badge>;
};

export default function OwnerTransactionsReport({ bookings, summary, filters }: TransactionsReportProps) {
    const { get } = useForm();

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams(formData as any).toString();
        window.location.href = `/owner/reports/transactions?${params}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Transaksi" />

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
                {/* Header Section */}
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Laporan Transaksi</h1>
                        <p className="text-slate-500">Analisis lengkap transaksi service bengkel Anda.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={`/owner/reports/transactions/export-pdf?date_from=${filters.date_from}&date_to=${filters.date_to}&status=${filters.status}&payment_status=${filters.payment_status}`} className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold transition-colors inline-flex items-center">
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </a>
                        <Link href="/owner/reports">
                            <Button className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Total Transaksi
                            </CardTitle>
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <Wrench className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{summary.total_bookings}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">BOOKING RECORDS</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Total Pendapatan
                            </CardTitle>
                            <div className="bg-emerald-100 p-2 rounded-xl">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-emerald-600">{formatCurrency(summary.total_revenue)}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">REVENUE</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Sudah Dibayar
                            </CardTitle>
                            <div className="bg-emerald-100 p-2 rounded-xl">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-emerald-600">{formatCurrency(summary.total_paid)}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">PAID AMOUNT</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Belum Dibayar
                            </CardTitle>
                            <div className="bg-red-100 p-2 rounded-xl">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-red-600">{formatCurrency(summary.total_unpaid)}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">OUTSTANDING</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Card */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Filter className="h-5 w-5 text-blue-600" />
                            Filter Laporan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Dari Tanggal</label>
                                <Input name="date_from" type="date" defaultValue={filters.date_from} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Sampai Tanggal</label>
                                <Input name="date_to" type="date" defaultValue={filters.date_to} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Status Booking</label>
                                <select
                                    name="status"
                                    defaultValue={filters.status}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="confirmed">Dikonfirmasi</option>
                                    <option value="assigned">Ditugaskan</option>
                                    <option value="in_progress">Proses</option>
                                    <option value="ready_to_pickup">Siap Ambil</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Status Pembayaran</label>
                                <select
                                    name="payment_status"
                                    defaultValue={filters.payment_status}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="paid">Lunas</option>
                                    <option value="unpaid">Belum Bayar</option>
                                    <option value="partial">Sebagian</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 lg:col-span-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Terapkan Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Clock className="h-5 w-5 text-blue-600" />
                            Daftar Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">No. Antrian</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Tanggal</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Pelanggan</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Kendaraan</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Mekanik</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Pembayaran</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Wrench className="mb-2 h-12 w-12 text-slate-300" />
                                                    <p>Tidak ada data transaksi untuk periode ini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.data.map((booking, idx) => (
                                            <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className="font-bold text-slate-900">#{booking.queue_number}</span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-600">
                                                    {new Date(booking.booking_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="font-semibold text-slate-900">{booking.user.name}</div>
                                                    <div className="text-xs text-slate-500">{booking.user.phone || '-'}</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="font-semibold text-slate-900">{booking.vehicle.brand} {booking.vehicle.model}</div>
                                                    <div className="text-xs text-slate-500">{booking.vehicle.plate_number}</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    {booking.mechanics.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {booking.mechanics.slice(0, 2).map((mechanic, i) => (
                                                                <span key={i} className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                                                                    {mechanic.name}
                                                                </span>
                                                            ))}
                                                            {booking.mechanics.length > 2 && (
                                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                                                    +{booking.mechanics.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center text-sm">
                                                    {getStatusBadge(booking.status)}
                                                </td>
                                                <td className="px-4 py-4 text-center text-sm">
                                                    {getPaymentStatusBadge(booking.payment_status)}
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                                                    {formatCurrency(booking.final_amount)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {bookings.meta.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                    Menampilkan {bookings.meta.from} - {bookings.meta.to} dari {bookings.meta.total} data
                                </div>
                                <div className="flex gap-2">
                                    {bookings.links.map((link, idx) => (
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
