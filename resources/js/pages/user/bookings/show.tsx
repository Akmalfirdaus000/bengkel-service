import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Car, Phone, User, Wrench, Clock, Activity, Hash, Printer } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { StatusBadge } from '@/components/booking/status-badge';
import { StatusTracker } from '@/components/booking/status-tracker';

interface ShowBookingProps {
    booking: {
        id: number;
        queue_number: string | null;
        queue_order: number | null;
        booking_date: string;
        estimated_start_time: string | null;
        estimated_end_time: string | null;
        status: string;
        payment_status: string;
        notes: string | null;
        admin_notes: string | null;
        total_amount: number;
        discount_amount: number | string;
        final_amount: number | string;
        vehicle: {
            brand: string;
            model: string;
            plate_number: string;
            year: string | null;
            color: string | null;
        };
        services: Array<{
            id: number;
            name: string;
            description: string | null;
            price: number;
        }>;
        serviceItems: Array<{
            id: number;
            quantity: number;
            unit_price: number | string;
            subtotal: number | string;
            sub_item_name: string | null;
            service: {
                name: string;
            };
        }>;
        mechanics: Array<{
            id: number;
            name: string;
            phone: string | null;
            specialization: string | null;
        }>;
        payments: Array<{
            id: number;
            payment_method: string;
            amount: number | string;
            status: string;
            paid_at: string;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Booking Saya', href: '/user/bookings' },
    { title: 'Detail Booking', href: '#' },
];

export default function ShowBooking({ booking }: ShowBookingProps) {
    const queueDisplay = booking.queue_number || `BOOK-${booking.id}`;

    const toMoneyNumber = (amount: number | string) => {
        const numeric = Number(amount);
        return Number.isFinite(numeric) ? numeric : 0;
    };

    const formatCurrency = (amount: number | string) => {
        const safeAmount = toMoneyNumber(amount);
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const canPay = booking.payment_status !== 'paid'
        && booking.status !== 'cancelled'
        && ['ready_to_pickup', 'completed'].includes(booking.status);

    // Ensure serviceItems exists and is an array
    const serviceItems = booking.serviceItems || [];

    // Format time
    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Antrian ${queueDisplay}`} />

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
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link href="/user/bookings">
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
                                            Nomor Antrian {queueDisplay}
                                        </h1>
                                        <p className="text-blue-100">
                                            {formatDate(booking.booking_date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <StatusBadge status={booking.status} />
                                    <StatusBadge status={booking.payment_status} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="flex flex-wrap gap-4">
                            {booking.queue_number && (
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-lg bg-blue-500 p-2">
                                        <Hash className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-600">Nomor Antrian</p>
                                        <p className="text-lg font-bold text-blue-600">{booking.queue_number}</p>
                                    </div>
                                </div>
                            )}
                            {booking.queue_order && (
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-lg bg-violet-500 p-2">
                                        <Hash className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-600">Urutan</p>
                                        <p className="text-lg font-bold text-slate-900">Ke-{booking.queue_order}</p>
                                    </div>
                                </div>
                            )}
                            {booking.estimated_start_time && (
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-lg bg-emerald-500 p-2">
                                        <Clock className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-600">Estimasi</p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatTime(booking.estimated_start_time)} - {formatTime(booking.estimated_end_time)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Status Tracker */}
                <Card className="border-slate-200 bg-white">
                    <CardContent className="pt-6">
                        <StatusTracker currentStatus={booking.status} />
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Vehicle Information */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <Car className="h-5 w-5 text-blue-600" />
                                    Informasi Kendaraan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Merek & Model</p>
                                        <p className="font-semibold text-slate-900">
                                            {booking.vehicle.brand} {booking.vehicle.model}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Plat Nomor</p>
                                        <p className="font-semibold text-slate-900">{booking.vehicle.plate_number}</p>
                                    </div>
                                    {booking.vehicle.year && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tahun</p>
                                            <p className="font-semibold text-slate-900">{booking.vehicle.year}</p>
                                        </div>
                                    )}
                                    {booking.vehicle.color && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Warna</p>
                                            <p className="font-semibold text-slate-900">{booking.vehicle.color}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Services */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                    <Wrench className="h-5 w-5 text-blue-600" />
                                    Layanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {serviceItems.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">Tidak ada layanan</p>
                                ) : (
                                    <div className="space-y-3">
                                        {serviceItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-slate-900">{item.service.name}</p>
                                                        {item.quantity > 1 && (
                                                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                                                x{item.quantity}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600">
                                                        {formatCurrency(item.unit_price)} per item
                                                    </p>
                                                    {item.sub_item_name && (
                                                        <div className="flex items-center gap-2 mt-2 text-sm">
                                                            <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200">
                                                                {item.sub_item_name}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-bold text-lg text-blue-600">
                                                    {formatCurrency(item.subtotal)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Assigned Mechanics */}
                        {booking.mechanics && booking.mechanics.length > 0 && (
                            <Card className="border-slate-200 bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                        <User className="h-5 w-5 text-emerald-600" />
                                        Mekanik Ditugaskan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {booking.mechanics.map((mechanic) => (
                                            <div
                                                key={mechanic.id}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-900">{mechanic.name}</p>
                                                    {mechanic.specialization && (
                                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mt-1">
                                                            {mechanic.specialization}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {mechanic.phone && (
                                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                                        <Phone className="h-3 w-3" />
                                                        {mechanic.phone}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes */}
                        {(booking.notes || booking.admin_notes) && (
                            <Card className="border-slate-200 bg-white">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900">Catatan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {booking.notes && (
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Catatan Anda:</p>
                                            <p className="text-sm text-slate-600">{booking.notes}</p>
                                        </div>
                                    )}
                                    {booking.admin_notes && (
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Catatan Admin:</p>
                                            <p className="text-sm text-slate-600">{booking.admin_notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-900">Ringkasan Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-semibold text-slate-900">{formatCurrency(booking.total_amount)}</span>
                                </div>
                                {toMoneyNumber(booking.discount_amount) > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-600">
                                        <span>Diskon</span>
                                        <span className="font-semibold">-{formatCurrency(booking.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-3">
                                    <span className="text-slate-900">Total</span>
                                    <span className="text-blue-600">{formatCurrency(booking.final_amount)}</span>
                                </div>

                                {/* Payment Actions */}
                                {canPay ? (
                                    <Link href={`/user/payments/${booking.id}`} className="block">
                                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                                            Bayar Sekarang
                                        </Button>
                                    </Link>
                                ) : (
                                    booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
                                        <Button className="mt-4 w-full" disabled>
                                            Bayar Sekarang (Menunggu Siap Diambil)
                                        </Button>
                                    )
                                )}

                                {booking.status === 'completed' && (
                                    <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => window.print()}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Cetak Struk
                                    </Button>
                                )}

                                {/* Payment History */}
                                {booking.payments && booking.payments.length > 0 && (
                                    <div className="border-t border-slate-200 pt-3 mt-3">
                                        <p className="text-sm font-semibold text-slate-700 mb-2">Riwayat Pembayaran</p>
                                        <div className="space-y-2">
                                            {booking.payments.map((payment) => (
                                                <div
                                                    key={payment.id}
                                                    className="text-sm rounded-lg bg-slate-50 p-3 border border-slate-200"
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="capitalize text-slate-900">
                                                            {payment.payment_method === 'cash' && 'Tunai'}
                                                            {payment.payment_method === 'transfer' && 'Transfer Bank'}
                                                            {payment.payment_method === 'e-wallet' && 'E-Wallet'}
                                                            {payment.payment_method === 'card' && 'Kartu Kredit/Debit'}
                                                        </span>
                                                        <span className="font-bold text-slate-900">
                                                            {formatCurrency(payment.amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                                                        <span>
                                                            {new Date(payment.paid_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={payment.status === 'completed'
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                : 'bg-amber-100 text-amber-700 border-amber-200'}
                                                        >
                                                            {payment.status === 'completed' && 'Selesai'}
                                                            {payment.status === 'pending' && 'Tertunda'}
                                                            {payment.status === 'failed' && 'Gagal'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Booking Info */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-900">Informasi Booking</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">ID Booking</span>
                                    <span className="font-semibold text-slate-900">#{booking.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Status</span>
                                    <StatusBadge status={booking.status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Status Pembayaran</span>
                                    <StatusBadge status={booking.payment_status} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-base">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full" size="sm">
                                    Download Invoice
                                </Button>
                                {['pending', 'confirmed'].includes(booking.status) && (
                                    <Button
                                        variant="ghost"
                                        className="w-full text-destructive hover:text-destructive"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm('Batalkan booking ini?')) {
                                                window.location.href = `/user/bookings/${booking.id}/cancel`;
                                            }
                                        }}
                                    >
                                        Batalkan Booking
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
