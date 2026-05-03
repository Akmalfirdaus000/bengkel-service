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
    FileText,
    CreditCard,
    Wallet,
    Building,
    Smartphone
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Invoice {
    id: number;
    queue_number: string;
    booking_date: string;
    final_amount: number;
    payment_status: string;
    user: {
        name: string;
        phone: string;
    };
    vehicle: {
        brand: string;
        model: string;
        plate_number: string;
    };
    payments: Array<{
        payment_method: string;
        amount: number;
        status: string;
    }>;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
}

interface InvoicesReportProps {
    bookings: {
        data: Invoice[];
        links: any[];
        meta: Pagination;
    };
    summary: {
        total_invoices: number;
        total_amount: number;
        total_paid: number;
        payment_methods: Record<string, number>;
    };
    filters: {
        date_from: string;
        date_to: string;
        payment_status: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Owner', href: '/owner/dashboard' },
    { title: 'Laporan Bisnis', href: '/owner/reports' },
    { title: 'Laporan Invoice & Pembayaran', href: '/owner/reports/invoices' },
];

const formatCurrency = (value: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
};

const getPaymentMethodIcon = (method: string) => {
    const methodMap: Record<string, { icon: any; color: string; label: string }> = {
        cash: { icon: Wallet, color: 'text-emerald-600 bg-emerald-100', label: 'Tunai' },
        transfer: { icon: Building, color: 'text-blue-600 bg-blue-100', label: 'Transfer' },
        card: { icon: CreditCard, color: 'text-purple-600 bg-purple-100', label: 'Kartu' },
        e_wallet: { icon: Smartphone, color: 'text-orange-600 bg-orange-100', label: 'E-Wallet' },
        qr: { icon: Smartphone, color: 'text-pink-600 bg-pink-100', label: 'QRIS' },
    };

    return methodMap[method] || { icon: CreditCard, color: 'text-gray-600 bg-gray-100', label: method };
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

export default function OwnerInvoicesReport({ bookings, summary, filters }: InvoicesReportProps) {
    const { get } = useForm();

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams(formData as any).toString();
        window.location.href = `/owner/reports/invoices?${params}`;
    };

    const totalPayments = summary.total_paid || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Invoice & Pembayaran" />

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
                {/* Header Section */}
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Laporan Invoice & Pembayaran</h1>
                        <p className="text-slate-500">Analisis lengkap invoice dan metode pembayaran bengkel Anda.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={`/owner/reports/invoices/export-pdf?date_from=${filters.date_from}&date_to=${filters.date_to}&payment_status=${filters.payment_status}`} className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold transition-colors inline-flex items-center">
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
                                Total Invoice
                            </CardTitle>
                            <div className="bg-violet-100 p-2 rounded-xl">
                                <FileText className="h-4 w-4 text-violet-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black">{summary.total_invoices}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">INVOICES</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Total Tagihan
                            </CardTitle>
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-blue-600">{formatCurrency(summary.total_amount)}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">TOTAL AMOUNT</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Total Dibayar
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
                                Sisa Tagihan
                            </CardTitle>
                            <div className="bg-red-100 p-2 rounded-xl">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-red-600">{formatCurrency(summary.total_amount - summary.total_paid)}</div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">OUTSTANDING</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Methods Summary */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <CreditCard className="h-5 w-5 text-violet-600" />
                            Ringkasan Metode Pembayaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Object.entries(summary.payment_methods).map(([method, amount]) => {
                                const { icon: Icon, color, label } = getPaymentMethodIcon(method);
                                const percentage = totalPayments > 0 ? ((amount / totalPayments) * 100).toFixed(1) : '0.0';

                                return (
                                    <div key={method} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`rounded-lg p-2 ${color}`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-600 uppercase">{label}</p>
                                                    <p className="text-lg font-black text-slate-900">{formatCurrency(amount)}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-violet-100 text-violet-700 border-violet-200">
                                                {percentage}%
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Filter Card */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Filter className="h-5 w-5 text-violet-600" />
                            Filter Laporan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Dari Tanggal</label>
                                <Input name="date_from" type="date" defaultValue={filters.date_from} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Sampai Tanggal</label>
                                <Input name="date_to" type="date" defaultValue={filters.date_to} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase">Status Pembayaran</label>
                                <select
                                    name="payment_status"
                                    defaultValue={filters.payment_status}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="paid">Lunas</option>
                                    <option value="unpaid">Belum Bayar</option>
                                    <option value="partial">Sebagian</option>
                                </select>
                            </div>
                            <div className="lg:col-span-3">
                                <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Terapkan Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Invoices Table */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <FileText className="h-5 w-5 text-violet-600" />
                            Daftar Invoice
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">No. Invoice</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Tanggal</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Pelanggan</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Kendaraan</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Metode Pembayaran</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600">Total Tagihan</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600">Dibayar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="mb-2 h-12 w-12 text-slate-300" />
                                                    <p>Tidak ada data invoice untuk periode ini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.data.map((booking, idx) => {
                                            const paidAmount = booking.payments
                                                .filter(p => p.status === 'completed')
                                                .reduce((sum, p) => sum + p.amount, 0);

                                            return (
                                                <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className="font-mono font-bold text-violet-700">#INV-{String(booking.id).padStart(6, '0')}</span>
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
                                                        <div className="flex flex-wrap gap-1">
                                                            {booking.payments.slice(0, 2).map((payment, i) => {
                                                                const { icon: Icon, color } = getPaymentMethodIcon(payment.payment_method);
                                                                return (
                                                                    <div key={i} className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${color}`}>
                                                                        <Icon className="h-3 w-3" />
                                                                        <span>{formatCurrency(payment.amount)}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                            {booking.payments.length > 2 && (
                                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                                                    +{booking.payments.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center text-sm">
                                                        {getPaymentStatusBadge(booking.payment_status)}
                                                    </td>
                                                    <td className="px-4 py-4 text-right text-sm font-bold text-violet-700">
                                                        {formatCurrency(booking.final_amount)}
                                                    </td>
                                                    <td className="px-4 py-4 text-right text-sm font-bold text-emerald-600">
                                                        {formatCurrency(paidAmount)}
                                                    </td>
                                                </tr>
                                            );
                                        })
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
                                                    ? 'bg-violet-600 text-white'
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
