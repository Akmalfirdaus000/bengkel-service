import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp,
    DollarSign,
    ArrowLeft,
    Calendar,
    ArrowUp,
    ArrowDown,
    LineChart
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface RevenueReportProps {
    revenueData: Array<{
        month: number;
        revenue: number;
    }>;
    year: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Bisnis',
        href: '/owner/reports',
    },
    {
        title: 'Analisis Pendapatan',
        href: '/owner/reports/revenue',
    },
];

export default function RevenueReport({ revenueData, year }: RevenueReportProps) {
    const formatCurrency = (amount: number) => {
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(amount)}`;
    };

    const getMonthName = (month: number) => {
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('id-ID', { month: 'long' });
    };

    const totalRevenue = revenueData.reduce((acc, curr) => acc + Number(curr.revenue), 0);
    const avgRevenue = totalRevenue / (revenueData.length || 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analisis Pendapatan" />

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/owner/reports" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                            <ArrowLeft className="h-5 w-5 text-slate-500" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Analisis Pendapatan</h1>
                            <p className="text-slate-500">Tinjauan mendalam performa finansial tahun {year}.</p>
                        </div>
                    </div>
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                        {[year - 1, year, year + 1].map((y) => (
                            <button 
                                key={y}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${y === year ? 'bg-primary text-primary-foreground' : 'hover:bg-slate-50 text-slate-400'}`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Tahunan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">{formatCurrency(totalRevenue)}</div>
                            <div className="flex items-center gap-1 mt-2 text-emerald-600 font-bold text-xs">
                                <ArrowUp className="h-3 w-3" /> 15% vs Tahun Lalu
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Rata-rata Bulanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">{formatCurrency(avgRevenue)}</div>
                            <div className="flex items-center gap-1 mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                Berdasarkan data masuk
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-indigo-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/70">Bulan Terbaik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{revenueData.length > 0 ? getMonthName(revenueData.sort((a,b) => b.revenue - a.revenue)[0].month) : '-'}</div>
                            <div className="flex items-center gap-1 mt-2 text-white/80 font-bold text-xs uppercase tracking-widest">
                                Volume Servis Maksimal
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm h-96 overflow-hidden relative group">
                    <CardHeader className="bg-white border-b border-slate-50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-primary" />
                            Tren Kas Masuk {year}
                        </CardTitle>
                        <CardDescription>Grafik pergerakan pendapatan bulanan</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full bg-white flex items-end justify-between px-10 pb-20 pt-10 gap-4">
                        {Array.from({ length: 12 }).map((_, idx) => {
                            const monthData = revenueData.find(d => d.month === idx + 1);
                            const revenue = monthData ? Number(monthData.revenue) : 0;
                            const maxRev = Math.max(...revenueData.map(d => Number(d.revenue))) || 1;
                            const height = (revenue / maxRev) * 100;
                            
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                                    <div className="w-full bg-slate-50 flex items-end justify-center rounded-t-2xl relative h-full group-hover/bar:bg-primary/5 transition-all">
                                        <div 
                                            className="w-3/4 bg-primary/20 rounded-t-2xl transition-all duration-1000 group-hover/bar:bg-primary group-hover/bar:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-2 px-3 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-50 group-hover/bar:scale-100 pointer-events-none whitespace-nowrap z-20">
                                                {formatCurrency(revenue)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 group-hover/bar:text-primary transition-colors">
                                        {getMonthName(idx + 1).substring(0, 3)}
                                    </span>
                                </div>
                            );
                        })}
                        
                        {/* Empty State Overlay */}
                        {revenueData.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-30">
                                <p className="font-bold text-slate-400">TIDAK ADA DATA UNTUK TAHUN {year}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
