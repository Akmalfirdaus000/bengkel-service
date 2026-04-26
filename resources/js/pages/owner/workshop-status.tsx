import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Clock,
    CheckCircle2,
    Car,
    User,
    Wrench,
    AlertCircle,
    RotateCcw
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { StatusBadge } from '@/components/booking/status-badge';

interface WorkshopStatusProps {
    bookings: Array<any>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Status Bengkel',
        href: '/owner/workshop-status',
    },
];

export default function WorkshopStatus({ bookings }: WorkshopStatusProps) {
    const activeCount = bookings.filter(b => ['confirmed', 'in_progress'].includes(b.status)).length;
    const waitingCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status Bengkel" />

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Live Monitoring</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Status Operasional</h1>
                        <p className="text-slate-500">Pantau aktivitas pengerjaan unit di area workshop secara real-time.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <p className="text-2xl font-black text-primary">{activeCount}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Unit Dikerjakan</p>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <p className="text-2xl font-black text-amber-500">{waitingCount}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Antrean Masuk</p>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.length > 0 ? bookings.map((booking) => (
                        <Card key={booking.id} className="border-none shadow-sm hover:shadow-lg transition-all group overflow-hidden">
                            <CardHeader className="pb-4 relative">
                                <div className="absolute top-0 right-0 p-4">
                                    <StatusBadge status={booking.status} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Car className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-black">{booking.vehicle?.brand} {booking.vehicle?.model}</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-tight">{booking.vehicle?.license_plate || 'No Plate'}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 py-4 border-y border-slate-50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <User className="h-4 w-4" />
                                            <span className="font-medium">Pelanggan</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{booking.user?.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Wrench className="h-4 w-4" />
                                            <span className="font-medium">Mekanik</span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {booking.mechanics?.length > 0 ? booking.mechanics[0].name : (
                                                <span className="text-amber-500 italic flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> Belum Ditugaskan
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">Jadwal</span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {new Date(booking.booking_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                
                                {booking.status === 'in_progress' ? (
                                    <div className="pt-2 animate-pulse">
                                        <div className="flex justify-between text-[10px] uppercase font-black text-primary mb-1">
                                            <span>Progress Pengerjaan</span>
                                            <span>Estimasi Selesai: 1 Jam</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-2/3 rounded-full" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pt-2">
                                        <button className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors py-2 border-2 border-dashed border-slate-100 rounded-xl hover:border-primary/30">
                                            Lihat Detail Booking
                                        </button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="col-span-full py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-50 p-6 rounded-full mb-4">
                                <Activity className="h-12 w-12 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Workshop Kosong</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">Tidak ada aktivitas pengerjaan unit saat ini. Semua pesanan telah diselesaikan atau belum dimulai.</p>
                            <button className="mt-6 flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/5 px-6 py-2 rounded-full transition-all">
                                <RotateCcw className="h-4 w-4" /> Perbarui Status
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
