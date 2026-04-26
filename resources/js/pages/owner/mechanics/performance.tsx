import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Star,
    Trophy,
    Target,
    Wrench,
    CheckCircle2,
    BarChart3,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface MechanicPerformanceProps {
    mechanics: Array<{
        id: number;
        name: string;
        specialization: string;
        status: string;
        bookings_count: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Mekanik',
        href: '/owner/mechanics',
    },
];

export default function MechanicPerformance({ mechanics }: MechanicPerformanceProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Performa Mekanik" />

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Performa Tim Mekanik</h1>
                        <p className="text-slate-500">Evaluasi produktivitas dan keahlian tim teknis Anda.</p>
                    </div>
                    <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Kru</p>
                            <p className="text-xl font-black text-slate-900">{mechanics.length}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mekanik Ahli</p>
                            <p className="text-xl font-black text-emerald-600">{mechanics.filter(m => m.bookings_count > 10).length}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rating Tim</p>
                            <div className="flex items-center gap-1">
                                <p className="text-xl font-black text-amber-500">4.9</p>
                                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Cards for Mechanics */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Leaderboard */}
                    <Card className="border-none shadow-sm overflow-hidden lg:col-span-1">
                        <CardHeader className="bg-primary text-primary-foreground">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Mekanik Teraktif
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/70 text-xs">Paling banyak menyelesaikan servis</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 bg-white">
                            <div className="divide-y divide-slate-50">
                                {mechanics.sort((a,b) => b.bookings_count - a.bookings_count).slice(0, 5).map((mechanic, idx) => (
                                    <div key={mechanic.id} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs",
                                                idx === 0 ? "bg-amber-100 text-amber-600" : 
                                                idx === 1 ? "bg-slate-100 text-slate-500" : 
                                                idx === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400"
                                            )}>
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{mechanic.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{mechanic.specialization}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 font-black text-slate-900 group-hover:text-primary transition-colors">
                                                <span>{mechanic.bookings_count}</span>
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Servis</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed List */}
                    <Card className="lg:col-span-2 border-none shadow-sm h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Detail Performa Tim
                            </CardTitle>
                            <CardDescription>Visualisasi produktivitas harian per mekanik</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {mechanics.map((mechanic) => (
                                <div key={mechanic.id} className="space-y-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:border-primary/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <Users className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{mechanic.name}</h4>
                                                <Badge className="bg-white text-slate-500 border-slate-200 text-[9px] h-4 font-bold shadow-none uppercase">{mechanic.specialization}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase">Completed</p>
                                                <p className="text-sm font-black text-slate-900">{mechanic.bookings_count}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase">Growth</p>
                                                <p className="text-sm font-black text-emerald-600 flex items-center gap-0.5">
                                                    <TrendingUp className="h-3 w-3" /> 12%
                                                </p>
                                            </div>
                                            <button className="p-2 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                                                <Target className="h-4 w-4 text-primary" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((mechanic.bookings_count / 15) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            {mechanics.length === 0 && (
                                <div className="py-12 text-center text-slate-400 italic">Belum ada mekanik yang terdaftar.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Insight Card */}
                <Card className="border-none shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden relative">
                    <div className="absolute right-0 bottom-0 p-12 opacity-10">
                        <Briefcase className="h-32 w-32" />
                    </div>
                    <CardContent className="p-8 md:p-12">
                        <div className="max-w-2xl space-y-6">
                            <h3 className="text-2xl font-black italic underline decoration-primary decoration-4 underline-offset-8 mb-4">Wawasan Bisnis:</h3>
                            <p className="text-slate-300 font-medium leading-relaxed">
                                Berdasarkan data keberhasilan pengerjaan, tim mekanik Anda mencapai efisiensi 
                                <span className="text-primary font-black mx-1 inline-block hover:scale-110 transition-transform">94%</span> 
                                minggu ini. Disarankan untuk menambah mekanik dengan spesialisasi 
                                <span className="text-amber-500 font-bold mx-1">Transmisi AT</span> 
                                untuk menangani peningkatan antrean di sektor tersebut.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Badge className="bg-primary/20 text-primary border-primary/30 py-2 px-4 rounded-xl font-bold">REKRUTMEN BARU</Badge>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 py-2 px-4 rounded-xl font-bold">PELATIHAN TEKNIS</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
