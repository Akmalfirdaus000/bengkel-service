import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Clock, Car, ArrowLeft, Home, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface SuccessProps {
    booking: {
        id: number;
        queue_number: string;
        queue_order: number;
        booking_date: string;
        estimated_start_time: string;
        estimated_end_time: string;
        status: string;
        total_amount: number | string;
        final_amount: number | string;
        vehicle: {
            brand: string;
            model: string;
            plate_number: string;
        };
        serviceItems: Array<{
            id: number;
            quantity: number;
            unit_price: number | string;
            subtotal: number | string;
            service: {
                name: string;
            };
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Booking Saya', href: '/user/bookings' },
    { title: 'Booking Berhasil', href: '#' },
];

export default function BookingSuccess({ booking }: SuccessProps) {
    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Berhasil" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Success Icon */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold mt-4">Booking Berhasil!</h1>
                        <p className="text-gray-600 mt-2">Booking Anda telah dikonfirmasi</p>
                    </div>

                    {/* Queue Number Card - Main Focus */}
                    <Card className="mb-6 border-2">
                        <CardContent className="p-8 text-center">
                            <p className="text-sm text-gray-600 mb-2">Nomor Antrian Anda</p>
                            <div className="text-7xl font-bold text-gray-900 my-4">
                                {booking.queue_number}
                            </div>
                            <Badge className="text-base px-4 py-2">
                                Antrian ke-{booking.queue_order} dari 10
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Booking Details */}
                    <Card className="mb-6">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold border-b pb-3">Detail Booking</h2>

                            {/* Date & Time */}
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <Calendar className="h-5 w-5 text-gray-700" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Tanggal</p>
                                    <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                                </div>
                            </div>

                            {/* Estimated Time */}
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <Clock className="h-5 w-5 text-gray-700" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Estimasi Waktu Pengerjaan</p>
                                    <p className="font-semibold">
                                        {formatTime(booking.estimated_start_time)} - {formatTime(booking.estimated_end_time)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        (Durasi 1 jam)
                                    </p>
                                </div>
                            </div>

                            {/* Vehicle */}
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <Car className="h-5 w-5 text-gray-700" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Kendaraan</p>
                                    <p className="font-semibold">
                                        {booking.vehicle.brand} {booking.vehicle.model}
                                    </p>
                                    <p className="text-sm text-gray-600">{booking.vehicle.plate_number}</p>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-2">Layanan</p>
                                <div className="space-y-2">
                                    {booking.serviceItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.service.name} x{item.quantity}</span>
                                            <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total Biaya</span>
                                    <span className="text-xl font-bold">{formatCurrency(booking.final_amount)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info */}
                    <Card className="bg-blue-50 border-blue-200 mb-6">
                        <CardContent className="p-4">
                            <div className="text-sm text-blue-900">
                                <p className="font-semibold mb-2">📌 Informasi Penting:</p>
                                <ul className="space-y-1">
                                    <li>• Silakan datang 15 menit sebelum jadwal</li>
                                    <li>• Tunjukkan nomor antrian ini kepada petugas</li>
                                    <li>• Pembayaran dapat dilakukan setelah pengerjaan selesai</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link href="/user/bookings" className="flex-1">
                            <Button variant="outline" className="w-full">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Daftar Booking
                            </Button>
                        </Link>
                        <Link href={`/user/bookings/${booking.id}`} className="flex-1">
                            <Button className="w-full">
                                <FileText className="h-4 w-4 mr-2" />
                                Detail Booking
                            </Button>
                        </Link>
                        <Link href="/user/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full">
                                <Home className="h-4 w-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
