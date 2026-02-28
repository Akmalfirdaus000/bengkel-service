import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    CheckCircle,
    Clock,
    Users,
    Wrench,
    TrendingUp,
    DollarSign,
    ArrowUp,
    ArrowDown,
    Activity,
    CarFront,
    MapPin,
    RefreshCw,
    Waypoints,
    Shield,
    Building2,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { StatusBadge } from '@/components/booking/status-badge';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
    stats: {
        total_bookings: number;
        today_bookings: number;
        pending_bookings: number;
        need_action_bookings: number;
        waiting_bookings: number;
        in_progress_bookings: number;
        completed_bookings: number;
        total_mechanics: number;
        active_services: number;
        revenue_this_month: number;
    };
    todayBookings: Array<any>;
    recentBookings: Array<any>;
    revenueChart: Array<{
        date: string;
        revenue: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: '/admin/dashboard',
    },
];

type MasterStat = {
    title: string;
    value: string;
    description: string;
    icon: typeof Users;
    accent: string;
    trend?: 'up' | 'down' | 'neutral';
};

export default function AdminDashboard({
    stats,
    todayBookings,
    recentBookings,
    revenueChart,
}: AdminDashboardProps) {
    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const formatTimeShort = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const masterStats: MasterStat[] = [
        {
            title: 'Booking Aktif',
            value: String(stats.total_bookings),
            description: `${stats.today_bookings} booking hari ini`,
            icon: Calendar,
            accent: 'from-blue-500 to-blue-600',
            trend: 'up',
        },
        {
            title: 'Dalam Proses',
            value: String(stats.in_progress_bookings),
            description: `${stats.waiting_bookings} dalam antrian`,
            icon: Activity,
            accent: 'from-amber-500 to-orange-600',
            trend: 'neutral',
        },
        {
            title: 'Mekanik Aktif',
            value: String(stats.total_mechanics),
            description: 'Tim mekanik tersedia',
            icon: Users,
            accent: 'from-emerald-500 to-green-600',
            trend: 'up',
        },
        {
            title: 'Pendapatan Bulan Ini',
            value: formatCurrency(stats.revenue_this_month),
            description: `${stats.completed_bookings} servis selesai`,
            icon: DollarSign,
            accent: 'from-violet-500 to-purple-600',
            trend: 'up',
        },
    ];

    const quickStats = [
        {
            label: 'Butuh Tindakan',
            value: stats.need_action_bookings,
            total: stats.total_bookings || 1,
            color: 'bg-amber-500',
            icon: Clock,
        },
        {
            label: 'Dalam Proses',
            value: stats.in_progress_bookings,
            total: stats.total_bookings || 1,
            color: 'bg-blue-500',
            icon: Wrench,
        },
        {
            label: 'Servis Selesai',
            value: stats.completed_bookings,
            total: stats.total_bookings || 1,
            color: 'bg-emerald-500',
            icon: CheckCircle,
        },
        {
            label: 'Layanan Aktif',
            value: stats.active_services,
            total: stats.active_services || 1,
            color: 'bg-violet-500',
            icon: CarFront,
        },
    ];

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

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
                                        Dashboard Admin
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Monitoring real-time aktivitas bengkel, booking servis, dan performa tim mekanik.
                                    </p>
                                </div>

                                <div className="flex w-full items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm sm:w-auto">
                                    <div className="rounded-lg bg-white/20 p-2.5">
                                        <RefreshCw className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                                            Update Terakhir
                                        </p>
                                        <p className="text-lg font-semibold text-white">
                                            {getCurrentTime()}
                                        </p>
                                        <p className="text-xs text-blue-200">
                                            Sinkronisasi Real-time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {quickStats.map((stat) => {
                                const Icon = stat.icon;
                                const percentage = Math.round((stat.value / stat.total) * 100);

                                return (
                                    <div key={stat.label} className="flex min-w-0 items-center gap-3">
                                        <div className={cn('rounded-lg', stat.color, 'p-2')}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="truncate text-xs font-medium text-slate-600">{stat.label}</p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className={cn('h-full', stat.color, 'transition-all duration-500')}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Main Stats Cards */}
                <section className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {masterStats.map((stat) => {
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
                                    <div
                                        className={cn('rounded-xl bg-gradient-to-br', stat.accent, 'p-3 text-white shadow-lg')}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-600">{stat.description}</p>
                                        {stat.trend && (
                                            <Badge
                                                variant="outline"
                                                className={cn('text-xs', stat.trend === 'up'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : stat.trend === 'down'
                                                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700'
                                                )}
                                            >
                                                {stat.trend === 'up' && <ArrowUp className="mr-1 h-3 w-3" />}
                                                {stat.trend === 'down' && <ArrowDown className="mr-1 h-3 w-3" />}
                                                Aktif
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                {/* Booking and Activity Section */}
                <section className="grid min-w-0 gap-6 lg:grid-cols-3">
                    {/* Today's Bookings */}
                    <Card className="min-w-0 border-slate-200 bg-white lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    Booking Hari Ini
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Daftar booking servis untuk hari ini
                                </CardDescription>
                            </div>
                            <Link
                                href="/admin/bookings"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Lihat semua →
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {todayBookings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-slate-100 p-4">
                                        <Calendar className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-slate-900">Tidak ada booking hari ini</p>
                                    <p className="mt-1 text-xs text-slate-500">Belum ada jadwal servis yang terdaftar</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {todayBookings.slice(0, 5).map((booking) => (
                                        <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                                            <div className="group flex min-w-0 items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="rounded-lg bg-blue-100 p-2.5 group-hover:bg-blue-200 transition-colors">
                                                        <CarFront className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {booking.vehicle?.brand} {booking.vehicle?.model}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                                                            <span>{booking.user?.name}</span>
                                                            <span className="text-slate-300">•</span>
                                                            <span>{formatTimeShort(booking.booking_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Bookings / Activity */}
                    <Card className="min-w-0 border-slate-200 bg-white">
                        <CardHeader className="space-y-3 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Aktivitas Terbaru
                            </CardTitle>
                            <CardDescription>
                                Booking servis terbaru yang masuk
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentBookings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <Waypoints className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Belum ada aktivitas
                                    </p>
                                </div>
                            ) : (
                                recentBookings.map((booking) => (
                                    <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                                        <div className="group min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {booking.vehicle?.brand} {booking.vehicle?.model}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-600">
                                                        {booking.user?.name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <MapPin className="h-3 w-3" />
                                                        {new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Revenue Chart */}
                {revenueChart.length > 0 && (
                    <Card className="min-w-0 border-slate-200 bg-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Pendapatan 7 Hari Terakhir
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Statistik pendapatan harian bengkel
                                </CardDescription>
                            </div>
                            <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 border-emerald-200">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                Live
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-56 min-w-0 items-end gap-3 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
                                {revenueChart.map((item) => {
                                    const maxRevenue = Math.max(...revenueChart.map((i) => i.revenue));
                                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                                    const isHighest = item.revenue === maxRevenue;

                                    return (
                                        <div
                                            key={item.date}
                                            className="group/bar flex min-w-0 flex-1 flex-col items-center gap-2"
                                        >
                                            <div
                                                className={cn(
                                                    'w-full rounded-t-lg transition-all duration-300 hover:shadow-lg relative overflow-hidden',
                                                    isHighest
                                                        ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/30'
                                                        : 'bg-gradient-to-t from-blue-500/70 to-blue-400/70 hover:from-blue-500 hover:to-blue-400'
                                                )}
                                                style={{ height: `${Math.max(height, 3)}%` }}
                                                title={formatCurrency(item.revenue)}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                                            </div>
                                            <p className={cn(
                                                'text-xs font-medium transition-colors',
                                                isHighest
                                                    ? 'text-blue-600 font-bold'
                                                    : 'text-slate-500 group-hover/bar:text-blue-600'
                                            )}>
                                                {formatDate(item.date)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="space-y-2 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Aksi Cepat
                        </CardTitle>
                        <CardDescription>
                            Akses cepat ke menu manajemen bengkel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Link href="/admin/bookings?status=pending" className="group">
                                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-amber-300 hover:bg-amber-50/50">
                                    <div className="rounded-xl bg-amber-100 p-3 group-hover:bg-amber-200 group-hover:scale-110 transition-all">
                                        <Clock className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                                            Butuh Tindakan
                                        </p>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {stats.need_action_bookings} perlu konfirmasi
                                        </p>
                                    </div>
                                    <ArrowUp className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>

                            <Link href="/admin/mechanics" className="group">
                                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/50">
                                    <div className="rounded-xl bg-emerald-100 p-3 group-hover:bg-emerald-200 group-hover:scale-110 transition-all">
                                        <Users className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                            Kelola Mekanik
                                        </p>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {stats.total_mechanics} mekanik tersedia
                                        </p>
                                    </div>
                                    <ArrowUp className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>

                            <Link href="/admin/services" className="group">
                                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-violet-300 hover:bg-violet-50/50">
                                    <div className="rounded-xl bg-violet-100 p-3 group-hover:bg-violet-200 group-hover:scale-110 transition-all">
                                        <Wrench className="h-6 w-6 text-violet-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                                            Kelola Layanan
                                        </p>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {stats.active_services} item servis aktif
                                        </p>
                                    </div>
                                    <ArrowUp className="h-4 w-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <section className="rounded-xl border border-slate-200 bg-white px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span>
                                    <strong className="text-slate-900">Bengkel Service</strong> - Management System
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-slate-400" />
                                <span>Sistem Manajemen Bengkel Terintegrasi</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} Bengkel Service. All rights reserved.
                        </p>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
