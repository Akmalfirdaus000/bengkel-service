import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Users,
    TrendingUp,
    DollarSign,
    ArrowUp,
    Briefcase,
    PieChart,
    Target,
    BarChart3,
    ArrowRight,
    Search,
    ShieldCheck
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface OwnerDashboardProps {
    stats: {
        total_revenue: number;
        revenue_this_month: number;
        total_bookings: number;
        completed_bookings: number;
        total_customers: number;
        total_mechanics: number;
    };
    revenueHistory: Array<{
        month: string;
        revenue: number;
    }>;
    recentHighValueBookings: Array<any>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Pemilik',
        href: '/owner/dashboard',
    },
];

export default function OwnerDashboard({
    stats,
    revenueHistory,
    recentHighValueBookings,
}: OwnerDashboardProps) {
    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(numeric)}`;
    };

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        return date.toLocaleDateString('id-ID', { month: 'short' });
    };

    const masterStats = [
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.total_revenue),
            description: 'Sejak bengkel beroperasi',
            icon: DollarSign,
            accent: 'from-blue-600 to-indigo-700',
        },
        {
            title: 'Pendapatan Bulan Ini',
            value: formatCurrency(stats.revenue_this_month),
            description: `${stats.completed_bookings} servis selesai`,
            icon: TrendingUp,
            accent: 'from-emerald-600 to-teal-700',
        },
        {
            title: 'Total Pelanggan',
            value: String(stats.total_customers),
            description: 'Pelanggan terdaftar',
            icon: Users,
            accent: 'from-amber-500 to-orange-600',
        },
        {
            title: 'Efisiensi Operasional',
            value: `${Math.round((stats.completed_bookings / (stats.total_bookings || 1)) * 100)}%`,
            description: 'Rasio servis selesai',
            icon: Target,
            accent: 'from-violet-600 to-purple-700',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Pemilik" />

            <div className="min-h-screen space-y-8 bg-slate-50/50 p-6 md:p-8">
                {/* Welcome Header */}
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Panel Pemilik</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Selamat Datang, Pemilik
                        </h1>
                        <p className="text-slate-500">
                            Berikut adalah ringkasan performa bisnis bengkel Anda hari ini.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 rounded-full border-slate-200 bg-white">
                            <Calendar className="h-4 w-4" />
                            Filter Laporan
                        </Button>
                        <Button className="gap-2 rounded-full shadow-lg shadow-primary/20">
                            <PieChart className="h-4 w-4" />
                            Ekspor Data
                        </Button>
                    </div>
                </header>

                {/* Master Stats Grid */}
                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {masterStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className="group overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white relative z-10">
                                    <div className={cn("absolute inset-0 bg-gradient-to-br -z-10", stat.accent)} />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-widest text-white/80">{stat.title}</p>
                                        <h3 className="text-2xl font-black">{stat.value}</h3>
                                    </div>
                                    <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 bg-white">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-slate-500">{stat.description}</p>
                                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs font-sans">
                                            <ArrowUp className="h-3 w-3" />
                                            Active
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Revenue Growth Chart (Simple Bar) */}
                    <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    Pertumbuhan Pendapatan
                                </CardTitle>
                                <CardDescription>6 Bulan Terakhir</CardDescription>
                            </div>
                            <Link href="/owner/reports/revenue" className="text-sm font-bold text-primary flex items-center gap-1">
                                Analisis Lengkap <ArrowRight className="h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-64 items-end gap-4 pt-4">
                                {revenueHistory.map((item) => {
                                    const maxRev = Math.max(...revenueHistory.map(r => r.revenue)) || 1;
                                    const height = (item.revenue / maxRev) * 100;
                                    return (
                                        <div key={item.month} className="group relative flex-1 flex flex-col items-center gap-3">
                                            <div 
                                                className="w-full bg-slate-100 rounded-t-xl transition-all group-hover:bg-primary/20 relative flex items-end justify-center"
                                                style={{ height: '100%' }}
                                            >
                                                <div 
                                                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-xl transition-all group-hover:shadow-lg group-hover:shadow-primary/30"
                                                    style={{ height: `${height}%` }}
                                                />
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20">
                                                    {formatCurrency(item.revenue)}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-primary transition-colors">
                                                {formatMonth(item.month)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access / Stats */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Status Bisnis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-slate-500">Kapasitas Bengkel</span>
                                        <span className="text-slate-900">75%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-3/4 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-slate-500">Kepuasan Pelanggan</span>
                                        <span className="text-slate-900">4.9/5</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[98%] rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className="text-slate-500">Ketersediaan Mekanik</span>
                                        <span className="text-slate-900">{stats.total_mechanics} Orang</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-2/3 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-2xl">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg">Pencarian Cepat</h4>
                                        <p className="text-sm opacity-80">Cari transaksi atau data pelanggan.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent High Value Bookings */}
                <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Transaksi Nilai Tinggi Terbaru
                        </CardTitle>
                        <CardDescription>Daftar transaksi dengan nilai terbesar bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-500">
                                <thead className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4">Pelanggan</th>
                                        <th className="px-6 py-4">Kendaraan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Nilai Transaksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {recentHighValueBookings.length > 0 ? recentHighValueBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{booking.user?.name}</span>
                                                    <span className="text-xs">{booking.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-700">
                                                    {booking.vehicle?.brand} {booking.vehicle?.model}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none text-[10px] font-black uppercase tracking-widest">Selesai</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-slate-900 text-base">
                                                {formatCurrency(booking.final_amount)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                                                Belum ada data transaksi nilai tinggi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// Placeholder Button since I didn't import it at first
function Button({ className, variant, size, children, ...props }: any) {
    const variants: any = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    };
    const sizes: any = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
    };
    
    return (
        <button 
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variants[variant || 'primary'],
                sizes[size || 'default'],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
