import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Search,
    Clock,
    AlertCircle,
    Wrench,
    Calendar,
    CarFront,
    User,
    Filter,
    ArrowUpRight,
    CheckCircle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { StatusBadge } from '@/components/booking/status-badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookingsIndexProps {
    bookings: {
        data: Array<any>;
        links: Array<any>;
    };
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Kelola Booking', href: '/admin/bookings' },
];

const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'assigned', label: 'Ditugaskan' },
    { value: 'in_progress', label: 'Dalam Proses' },
    { value: 'ready_to_pickup', label: 'Siap Diambil' },
];

export default function AdminBookingsIndex({ bookings, filters }: BookingsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
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
    const processingBookings = (bookings.data ?? [])
        .filter((booking) => processingStatuses.includes(booking.status))
        .sort(sortByQueue);
    const waitingBookings = (bookings.data ?? [])
        .filter((booking) => waitingStatuses.includes(booking.status))
        .sort(sortByQueue);
    const actionNeededBookings = (bookings.data ?? [])
        .filter((booking) => ['pending', 'confirmed'].includes(booking.status));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (filters.status) params.set('status', filters.status);
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        if (searchQuery) params.set('search', searchQuery);
        window.location.href = `/admin/bookings?${params.toString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const statsCards = [
        {
            title: 'Total Servis',
            value: String(bookings.data.length),
            description: 'Semua booking aktif',
            icon: Wrench,
            accent: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Butuh Tindakan',
            value: String(actionNeededBookings.length),
            description: 'Perlu konfirmasi admin',
            icon: AlertCircle,
            accent: 'from-amber-500 to-orange-600',
        },
        {
            title: 'Sedang Diproses',
            value: String(processingBookings.length),
            description: 'Dalam pengerjaan mekanik',
            icon: Clock,
            accent: 'from-emerald-500 to-green-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Booking" />

            <div className="space-y-6 bg-slate-50 p-4 md:p-6 min-w-0 overflow-x-hidden">
                {/* Header Section */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                                            <Calendar className="mr-1 h-3 w-3" />
                                            Active Queue
                                        </Badge>
                                        <Badge variant="outline" className="border-white/30 text-white/90 text-xs">
                                            Booking Management
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Kelola Booking
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Antrian aktif servis. Kelola status booking, tugaskan mekanik, dan pantau progres servis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statsCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={stat.title}
                                className="border-slate-200 bg-white transition-shadow hover:shadow-lg"
                            >
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

                {/* Filters */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="space-y-2 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Filter className="h-5 w-5 text-blue-600" />
                            Filter Booking
                        </CardTitle>
                        <CardDescription>
                            Cari dan filter booking berdasarkan kriteria tertentu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Cari</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="search"
                                        placeholder="Pelanggan atau plat..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) => {
                                        const params = new URLSearchParams();
                                        if (value !== 'all') params.set('status', value);
                                        if (filters.date_from) params.set('date_from', filters.date_from);
                                        if (filters.date_to) params.set('date_to', filters.date_to);
                                        if (filters.search) params.set('search', filters.search);
                                        window.location.href = `/admin/bookings?${params.toString()}`;
                                    }}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Filter berdasarkan status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_from">Dari Tanggal</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => {
                                        const params = new URLSearchParams();
                                        if (filters.status) params.set('status', filters.status);
                                        if (e.target.value) params.set('date_from', e.target.value);
                                        if (filters.date_to) params.set('date_to', filters.date_to);
                                        if (filters.search) params.set('search', filters.search);
                                        window.location.href = `/admin/bookings?${params.toString()}`;
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
                                        if (filters.status) params.set('status', filters.status);
                                        if (filters.date_from) params.set('date_from', filters.date_from);
                                        if (e.target.value) params.set('date_to', e.target.value);
                                        if (filters.search) params.set('search', filters.search);
                                        window.location.href = `/admin/bookings?${params.toString()}`;
                                    }}
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Processing Bookings */}
                <Card className="border-slate-200 bg-white overflow-hidden">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-blue-600" />
                                Sedang Diproses
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Booking yang sedang dikerjakan atau siap diambil
                            </CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            {processingBookings.length} Booking
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        {processingBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-slate-100 p-4">
                                    <Clock className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900">Tidak ada booking yang sedang diproses</p>
                                <p className="mt-1 text-xs text-slate-500">Semua booking telah selesai atau belum ada antrian</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {processingBookings.map((booking) => (
                                    <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                                        <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md">
                                            <div className="rounded-xl bg-blue-100 p-3 group-hover:bg-blue-200 group-hover:scale-110 transition-all">
                                                <CarFront className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-slate-900 truncate">
                                                            {booking.vehicle?.brand} {booking.vehicle?.model}
                                                        </p>
                                                        <span className="text-xs text-slate-400">#{booking.id}</span>
                                                    </div>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {booking.user?.name}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(booking.booking_date)}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {booking.vehicle?.plate_number}
                                                    </Badge>
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(booking.final_amount)}
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Waiting Bookings */}
                <Card className="border-slate-200 bg-white overflow-hidden">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                Menunggu Antrian
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Booking pending, dikonfirmasi, dan ditugaskan
                            </CardDescription>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            {waitingBookings.length} Booking
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        {waitingBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-slate-100 p-4">
                                    <CheckCircle className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900">Tidak ada booking yang menunggu</p>
                                <p className="mt-1 text-xs text-slate-500">Semua booking sedang diproses atau telah selesai</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {waitingBookings.map((booking) => (
                                    <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                                        <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md">
                                            <div className="rounded-xl bg-amber-100 p-3 group-hover:bg-amber-200 group-hover:scale-110 transition-all">
                                                <CarFront className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-slate-900 truncate">
                                                            {booking.vehicle?.brand} {booking.vehicle?.model}
                                                        </p>
                                                        <span className="text-xs text-slate-400">#{booking.id}</span>
                                                    </div>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {booking.user?.name}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(booking.booking_date)}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {booking.vehicle?.plate_number}
                                                    </Badge>
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(booking.final_amount)}
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
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
                                    Menampilkan {bookings.data.length} booking
                                </p>
                                <div className="flex gap-1">
                                    {bookings.links.map((link: any, index: number) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={cn(
                                                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                    link.active
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-3 py-2 rounded-md text-sm bg-slate-100 text-slate-400 opacity-50"
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
                        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                            <p>
                                Booking selesai akan otomatis dipindahkan ke{' '}
                                <Link href="/admin/bookings/history" className="font-medium text-blue-600 hover:text-blue-700 underline">
                                    riwayat booking
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
