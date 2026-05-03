import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    TrendingUp,
    DollarSign,
    Users,
    ShoppingCart,
    ArrowUpRight,
    Search,
    BarChart3,
    Download,
    FileText
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface OwnerReportsProps {
    overview: {
        total_revenue: number;
        total_bookings: number;
        completed_bookings: number;
        customer_growth: number;
    };
    allTimeRevenue?: number;
    thisMonthRevenue?: number;
    thisMonthCompleted?: number;
    totalCustomers?: number;
    topServices: Array<{
        name: string;
        total_revenue: number;
        total_sold: number;
    }>;
    filters: {
        date_from: string;
        date_to: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Bisnis',
        href: '/owner/reports',
    },
];

export default function OwnerReports({ overview, topServices, filters, allTimeRevenue = 0, thisMonthRevenue = 0, thisMonthCompleted = 0, totalCustomers = 0 }: OwnerReportsProps) {
    const formatCurrency = (amount: number) => {
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(amount)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Bisnis" />

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Analisis Bisnis</h1>
                        <p className="text-slate-500">Pantau pertumbuhan dan performa finansial bengkel Anda.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="/owner/reports/export-pdf" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </a>
                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex flex-col px-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Periode</span>
                                <span className="text-sm font-bold">{filters.date_from} - {filters.date_to}</span>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-100" />
                            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <Calendar className="h-5 w-5 text-primary" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* KPI Overview - Like Dashboard */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Pendapatan', value: formatCurrency(allTimeRevenue), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100', subtitle: 'SEJAS BENGKEL BEROPERASI' },
                        { label: 'Pendapatan Bulan Ini', value: formatCurrency(thisMonthRevenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', subtitle: `${thisMonthCompleted} SERVIS SELESAI` },
                        { label: 'Total Pelanggan', value: totalCustomers, icon: Users, color: 'text-violet-600', bg: 'bg-violet-100', subtitle: 'PELANGGAN TERDAFTAR' },
                        { label: 'Total Booking', value: overview.total_bookings, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-100', subtitle: 'PERIODE INI' },
                    ].map((kpi, idx) => (
                        <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-default">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">{kpi.label}</CardTitle>
                                <div className={`${kpi.bg} p-2 rounded-xl`}>
                                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{kpi.value}</div>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">{kpi.subtitle}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Report Access */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/owner/reports/transactions">
                        <Card className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                            <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-blue-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <BarChart3 className="h-6 w-6" />
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 group-hover:translate-y-[-4px] transition-all" />
                                </div>
                                <CardTitle className="text-lg mt-3 text-blue-900">Laporan Transaksi</CardTitle>
                                <CardDescription className="text-blue-700">Analisis transaksi service lengkap</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/owner/reports/invoices">
                        <Card className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                            <CardHeader className="bg-gradient-to-br from-violet-50 to-violet-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-violet-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-violet-600 group-hover:translate-x-1 group-hover:translate-y-[-4px] transition-all" />
                                </div>
                                <CardTitle className="text-lg mt-3 text-violet-900">Laporan Invoice</CardTitle>
                                <CardDescription className="text-violet-700">Ringkasan invoice & pembayaran</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/owner/reports/revenue">
                        <Card className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                            <CardHeader className="bg-gradient-to-br from-emerald-50 to-emerald-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-emerald-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 group-hover:translate-y-[-4px] transition-all" />
                                </div>
                                <CardTitle className="text-lg mt-3 text-emerald-900">Laporan Pendapatan</CardTitle>
                                <CardDescription className="text-emerald-700">Analisis tren pendapatan bulanan</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Top Services Chart Replacement */}
                    <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        Layanan Paling Menguntungkan
                                    </CardTitle>
                                    <CardDescription>Berdasarkan pendapatan kotor periode ini</CardDescription>
                                </div>
                                <button className="text-xs font-bold text-primary hover:underline">LIHAT DETAIL</button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {topServices.length > 0 ? topServices.map((service, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{service.name}</h4>
                                                <p className="text-xs text-slate-400 font-medium">{service.total_sold} Kali dipesan</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900">{formatCurrency(service.total_revenue)}</p>
                                            <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50/30 text-[10px]">HIGHEST MARGIN</Badge>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-slate-400 italic">Belum ada data transaksi untuk periode ini.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marketing / Customer Info */}
                    <Card className="border-none shadow-sm bg-primary text-primary-foreground relative overflow-hidden h-fit">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ArrowUpRight className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl font-black">Target Bisnis</CardTitle>
                            <CardDescription className="text-primary-foreground/70">Pencapaian target bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span>Revenue Target</span>
                                    <span>Rp 150JT / 200JT</span>
                                </div>
                                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-3/4 shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all animate-pulse-slow" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span>Customer Acquisition</span>
                                    <span>85%</span>
                                </div>
                                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[85%] shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="w-full bg-white text-primary font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform">
                                    BUAT STRATEGI BARU
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// Minimal Button Placeholder
function Button({ className, children, ...props }: any) {
    return <button className={`px-4 py-2 rounded-lg font-bold transition-all ${className}`} {...props}>{children}</button>;
}
