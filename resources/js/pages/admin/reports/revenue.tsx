import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface RevenueReportProps {
    revenueData: Array<{
        date: string;
        revenue: number | string;
    }>;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' | string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Laporan', href: '/admin/reports' },
    { title: 'Pendapatan', href: '/admin/reports/revenue' },
];

const toNumber = (value: number | string) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (value: number | string) =>
    `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(toNumber(value))}`;

export default function RevenueReport({ revenueData, period }: RevenueReportProps) {
    const totalRevenue = revenueData.reduce((sum, item) => sum + toNumber(item.revenue), 0);
    const maxRevenue = Math.max(...revenueData.map((item) => toNumber(item.revenue)), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pendapatan" />

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
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link href="/admin/reports">
                                        <Button variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>
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
                                            Laporan Pendapatan
                                        </h1>
                                        <p className="max-w-2xl text-blue-100">
                                            Visualisasi pendapatan booking yang sudah selesai. Analisis tren pendapatan bengkel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-violet-500 p-2">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Pendapatan</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {formatCurrency(totalRevenue)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2">
                                    <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Periode</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {period === 'daily' && 'Harian'}
                                            {period === 'weekly' && 'Mingguan'}
                                            {period === 'monthly' && 'Bulanan'}
                                            {period === 'yearly' && 'Tahunan'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Data Points</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {revenueData.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter Period Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900">Filter Periode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {['daily', 'weekly', 'monthly', 'yearly'].map((item) => (
                                <Link key={item} href={`/admin/reports/revenue?period=${item}`}>
                                    <Button
                                        variant={period === item ? 'default' : 'outline'}
                                        className={period === item ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200'}
                                    >
                                        {item === 'daily' && 'Harian'}
                                        {item === 'weekly' && 'Mingguan'}
                                        {item === 'monthly' && 'Bulanan'}
                                        {item === 'yearly' && 'Tahunan'}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Chart Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Total Pendapatan: {formatCurrency(totalRevenue)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {revenueData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-slate-100 p-4">
                                    <DollarSign className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-900">Tidak ada data pendapatan</p>
                                <p className="mt-1 text-xs text-slate-500">Belum ada pendapatan untuk periode ini</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex h-56 min-w-0 items-end gap-3 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
                                    {revenueData.map((item) => {
                                        const revenue = toNumber(item.revenue);
                                        const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                                        const isHighest = revenue === maxRevenue;

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
                                                    title={`${item.date} - ${formatCurrency(revenue)}`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                                                </div>
                                                <p className={cn(
                                                    'text-xs font-medium transition-colors',
                                                    isHighest
                                                        ? 'text-blue-600 font-bold'
                                                        : 'text-slate-500 group-hover/bar:text-blue-600'
                                                )}>
                                                    {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-slate-700">Detail Pendapatan</h3>
                                    {revenueData.map((item) => (
                                        <div key={item.date} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                            <span className="font-semibold text-slate-900">{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            <span className="font-bold text-blue-600">{formatCurrency(item.revenue)}</span>
                                        </div>
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
