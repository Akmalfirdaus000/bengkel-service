import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Search,
    Calendar,
    CarFront,
    CheckCircle,
    ArrowLeft,
    Filter,
    ArrowUpRight,
    History,
    FileText,
    Download,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookingsHistoryProps {
    bookings: {
        data: Array<any>;
        links: Array<any>;
        total?: number;
    };
    filters: {
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Kelola Booking', href: '/admin/bookings' },
    { title: 'Riwayat Booking', href: '/admin/bookings/history' },
];

export default function AdminBookingsHistory({ bookings, filters }: BookingsHistoryProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        if (searchQuery) params.set('search', searchQuery);
        window.location.href = `/admin/bookings/history?${params.toString()}`;
    };

    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statsCards = [
        {
            title: 'Total Selesai',
            value: String(bookings.data.length),
            description: 'Booking已完成',
            icon: CheckCircle,
            accent: 'from-emerald-500 to-green-600',
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(bookings.data.reduce((sum: number, b: any) => sum + (b.final_amount || 0), 0)),
            description: 'Pendapatan dari riwayat',
            icon: FileText,
            accent: 'from-blue-500 to-indigo-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Booking" />

            <div className="space-y-6 bg-slate-50 p-4 md:p-6">
                {/* Header Section */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                                            <History className="mr-1 h-3 w-3" />
                                            Archive
                                        </Badge>
                                        <Badge variant="outline" className="border-white/30 text-white/90 text-xs">
                                            Completed Bookings
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Riwayat Booking
                                    </h1>
                                    <p className="max-w-2xl text-emerald-100">
                                        Daftar booking yang sudah selesai dikerjakan. Lihat detail dan riwayat transaksi.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Link href={`/admin/bookings/export-pdf?status=completed&date_from=${filters.date_from || ''}&date_to=${filters.date_to || ''}`}>
                                        <Button className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-md">
                                            <Download className="mr-2 h-4 w-4" />
                                            Ekspor PDF
                                        </Button>
                                    </Link>
                                    <Link href="/admin/bookings">
                                        <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Booking Aktif
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {statsCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                                    <div className="space-y-1">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            {stat.title}
                                        </CardDescription>
                                        <CardTitle className="text-2xl font-bold text-slate-900">
                                            {stat.value}
                                        </CardTitle>
                                    </div>
                                    <div className={cn('rounded-xl bg-gradient-to-br', stat.accent, 'p-3 text-white shadow-lg')}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-slate-600">{stat.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                {/* Filter Section */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="space-y-2 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Filter className="h-5 w-5 text-emerald-600" />
                            Filter Riwayat
                        </CardTitle>
                        <CardDescription>
                            Cari riwayat booking berdasarkan tanggal atau nama pelanggan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <Label htmlFor="search">Cari Booking</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="search"
                                        placeholder="Pelanggan atau plat nomor..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_from">Dari Tanggal</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => {
                                        const params = new URLSearchParams();
                                        if (e.target.value) params.set('date_from', e.target.value);
                                        if (filters.date_to) params.set('date_to', filters.date_to);
                                        if (filters.search) params.set('search', filters.search);
                                        window.location.href = `/admin/bookings/history?${params.toString()}`;
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_to">Sampai Tanggal</Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={filters.date_to || ''}
                                    onChange={(e) => {
                                        const params = new URLSearchParams();
                                        if (filters.date_from) params.set('date_from', filters.date_from);
                                        if (e.target.value) params.set('date_to', e.target.value);
                                        if (filters.search) params.set('search', filters.search);
                                        window.location.href = `/admin/bookings/history?${params.toString()}`;
                                    }}
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Booking History List */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                                Booking Selesai
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {bookings.data.length} booking telah selesai
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {bookings.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="rounded-full bg-slate-100 p-6">
                                    <CheckCircle className="h-12 w-12 text-slate-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">Belum ada riwayat</h3>
                                <p className="mt-2 text-sm text-slate-500 text-center max-w-md">
                                    Belum ada booking yang selesai. Booking yang sudah selesai akan muncul di halaman ini.
                                </p>
                                <Link href="/admin/bookings" className="mt-6">
                                    <Button variant="outline">
                                        Lihat Booking Aktif
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bookings.data.map((booking) => (
                                    <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                                        <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md">
                                            <div className="rounded-xl bg-emerald-100 p-3 group-hover:bg-emerald-200 group-hover:scale-110 transition-all shrink-0">
                                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-base font-bold text-slate-900">
                                                            {booking.vehicle?.brand} {booking.vehicle?.model}
                                                        </p>
                                                        <Badge variant="outline" className="text-xs text-slate-500">
                                                            #{booking.id}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="grid gap-2 sm:grid-cols-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3 text-slate-400" />
                                                        <span className="text-slate-600">{formatDate(booking.completed_at)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CarFront className="h-3 w-3 text-slate-400" />
                                                        <span className="font-medium text-slate-900">{booking.vehicle?.plate_number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-3 w-3 text-slate-400" />
                                                        <span className="font-medium text-slate-900">{booking.user?.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-lg font-bold text-emerald-600">
                                                    {formatCurrency(booking.final_amount)}
                                                </p>
                                                <p className="text-xs text-slate-500">Total Bayar</p>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {bookings.links && bookings.links.length > 3 && (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-600">
                                    Menampilkan {bookings.data.length} dari {bookings.total || bookings.data.length} riwayat
                                </p>
                                <div className="flex gap-1">
                                    {bookings.links.map((link: any, index: number) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={cn(
                                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                                    link.active
                                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-4 py-2 rounded-lg text-sm bg-slate-100 text-slate-400 opacity-50"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer Note */}
                <Card className="border-slate-200 bg-white">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-4">
                                <p>
                                    Booking yang masih aktif dapat dilihat di{' '}
                                    <Link href="/admin/bookings" className="font-semibold text-emerald-600 hover:text-emerald-700 underline">
                                        halaman booking aktif
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
