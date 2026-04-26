import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    ArrowLeft,
    CarFront,
    User,
    Wrench,
    Phone,
    Clock,
    Hash,
    Printer,
    Plus,
    Calendar,
    DollarSign,
    FileText,
    Users,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    Activity,
    RefreshCw,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { StatusBadge } from '@/components/booking/status-badge';
import { StatusTracker } from '@/components/booking/status-tracker';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

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
        discount_amount: number;
        final_amount: number;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string | null;
        };
        vehicle: {
            brand: string;
            model: string;
            plate_number: string;
            year: string | null;
            color: string | null;
        };
        serviceItems: Array<{
            id: number;
            quantity: number;
            unit_price: number;
            subtotal: number;
            sub_item_name: string | null;
            service: {
                id?: number;
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
            amount: number;
            status: string;
            paid_at: string;
        }>;
    };
    availableMechanics: Array<{
        id: number;
        name: string;
        specialization: string | null;
    }>;
    allServices: Array<{
        id: number;
        name: string;
        price: number;
        category: {
            name: string;
        };
        sub_items?: Array<{
            id: number;
            name: string;
            additional_price: number | string;
        }>;
        subItems?: Array<{
            id: number;
            name: string;
            additional_price: number | string;
        }>;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Kelola Booking', href: '/admin/bookings' },
    { title: 'Detail Booking', href: '#' },
];

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    assigned: 'Ditugaskan',
    in_progress: 'Dalam Proses',
    ready_to_pickup: 'Siap Diambil',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

const statusButtonStyles: Record<string, string> = {
    pending: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700',
    confirmed: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
    assigned: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700',
    in_progress: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700',
    ready_to_pickup: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700',
    completed: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800',
    cancelled: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
};

const flowOrder = ['pending', 'confirmed', 'assigned', 'in_progress', 'ready_to_pickup', 'completed'];

const nextStatusMap: Record<string, string | null> = {
    pending: 'confirmed',
    confirmed: 'assigned',
    assigned: 'in_progress',
    in_progress: 'ready_to_pickup',
    ready_to_pickup: 'completed',
    completed: null,
    cancelled: null,
};

export default function AdminBookingShow({ booking, availableMechanics, allServices }: ShowBookingProps) {
    const [currentStatus, setCurrentStatus] = useState(booking.status);
    const [selectedMechanicIds, setSelectedMechanicIds] = useState<number[]>(booking.mechanics?.map((m) => m.id) || []);
    const [confirmNextStep, setConfirmNextStep] = useState(false);
    const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);

    const statusForm = useForm({
        status: booking.status,
        admin_notes: booking.admin_notes || '',
    });

    const addServiceForm = useForm({
        service_item_id: allServices[0] ? String(allServices[0].id) : '',
        service_sub_item_id: '',
        quantity: '1',
    });

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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const currentFlowIndex = flowOrder.indexOf(currentStatus);
    const nextStatus = nextStatusMap[currentStatus];
    const buttonColorClass = statusButtonStyles[currentStatus] || 'bg-gradient-to-r from-slate-600 to-slate-700 text-white';
    const progressValue = currentStatus === 'cancelled' ? 0 : Math.max(0, Math.round(((currentFlowIndex + 1) / flowOrder.length) * 100));

    const canEditMechanics = !['completed', 'cancelled'].includes(currentStatus);
    const canAddService = !['completed', 'cancelled'].includes(currentStatus);
    const queueDisplay = booking.queue_number || `BOOK-${String(booking.id).padStart(4, '0')}`;

    const selectedService = useMemo(() => {
        const id = Number(addServiceForm.data.service_item_id);
        if (!Number.isFinite(id) || !id) return null;
        return allServices.find((service) => service.id === id) || null;
    }, [addServiceForm.data.service_item_id, allServices]);

    const selectedServiceSubItems = useMemo(() => {
        if (!selectedService) return [];
        return selectedService.sub_items || selectedService.subItems || [];
    }, [selectedService]);

    const assignMechanics = () => {
        if (!canEditMechanics) return;
        router.put(`/admin/bookings/${booking.id}/assign`, {
            mechanic_ids: selectedMechanicIds,
        }, {
            onSuccess: () => window.location.reload(),
        });
    };

    const goToNextStatus = () => {
        if (!nextStatus) return;

        statusForm.setData('status', nextStatus);
        router.put(`/admin/bookings/${booking.id}/status`, {
            status: nextStatus,
            admin_notes: statusForm.data.admin_notes,
        }, {
            onSuccess: () => {
                setCurrentStatus(nextStatus);
                setConfirmNextStep(false);
            },
        });
    };

    const submitExtraService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canAddService) return;

        addServiceForm.post(`/admin/bookings/${booking.id}/service-items`, {
            preserveScroll: true,
            onSuccess: () => {
                addServiceForm.setData('service_sub_item_id', '');
                addServiceForm.setData('quantity', '1');
                setAddServiceModalOpen(false);
            },
        });
    };

    const masterStats = [
        {
            title: 'Nomor Antrian',
            value: queueDisplay,
            description: booking.queue_order ? `Antrian ke-${booking.queue_order}` : 'Booking ID',
            icon: Hash,
            accent: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Estimasi Mulai',
            value: formatTime(booking.estimated_start_time),
            description: 'Waktu mulai servis',
            icon: Clock,
            accent: 'from-amber-500 to-orange-600',
        },
        {
            title: 'Estimasi Selesai',
            value: formatTime(booking.estimated_end_time),
            description: 'Perkiraan selesai',
            icon: Clock,
            accent: 'from-emerald-500 to-green-600',
        },
        {
            title: 'Total Biaya',
            value: formatCurrency(booking.final_amount),
            description: `${booking.serviceItems.length} layanan`,
            icon: DollarSign,
            accent: 'from-violet-500 to-purple-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Booking ${queueDisplay}`} />

            <div className="space-y-6 bg-slate-50 p-4 md:p-6">
                {/* Header Section */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 md:px-6 py-6 md:py-8">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-start justify-between gap-4 md:gap-6">
                                <div className="flex items-start gap-4">
                                    <Link href="/admin/bookings">
                                        <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm hover:bg-white/30 transition-colors">
                                            <ArrowLeft className="h-5 w-5 text-white" />
                                        </div>
                                    </Link>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                                <Hash className="mr-1 h-3 w-3" />
                                                {queueDisplay}
                                            </Badge>
                                            <StatusBadge status={currentStatus} />
                                            <StatusBadge status={booking.payment_status} />
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                                            Detail Booking
                                        </h1>
                                        <p className="text-blue-100">
                                            Booking #{booking.id} • {formatDate(booking.booking_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-4 md:px-5 py-3 backdrop-blur-sm">
                                    <div className="rounded-lg bg-white/20 p-2">
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
                                            Real-time Sync
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Master Stats Cards */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {masterStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className="border-slate-200 bg-white transition-shadow hover:shadow-lg">
                                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                                    <div className="space-y-1">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            {stat.title}
                                        </CardDescription>
                                        <CardTitle className="text-2xl font-bold text-slate-900 truncate">
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

                {/* Progress Flow */}
                <Card className="border-slate-200 bg-white">
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-700">Progress Status</span>
                                <span className="font-bold text-slate-900">
                                    {currentStatus === 'cancelled' ? 'Dibatalkan' : `${progressValue}% Selesai`}
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all duration-500',
                                        currentStatus === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                                        currentStatus === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                        'bg-gradient-to-r from-blue-500 to-indigo-500'
                                    )}
                                    style={{ width: `${progressValue}%` }}
                                />
                            </div>
                        </div>
                        <StatusTracker currentStatus={currentStatus} />
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Customer & Vehicle */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Card className="border-slate-200 bg-white">
                                <CardHeader className="space-y-3 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        Informasi Pelanggan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500 mb-1">Nama Lengkap</p>
                                            <p className="font-bold text-slate-900">{booking.user.name}</p>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500 mb-1">Email</p>
                                            <p className="font-medium text-slate-900 text-sm break-all">{booking.user.email}</p>
                                        </div>
                                        {booking.user.phone && (
                                            <div className="rounded-xl bg-slate-50 p-4">
                                                <p className="text-xs text-slate-500 mb-1">Nomor Telepon</p>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-slate-400" />
                                                    <p className="font-bold text-slate-900">{booking.user.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 bg-white">
                                <CardHeader className="space-y-3 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-2">
                                            <CarFront className="h-5 w-5 text-white" />
                                        </div>
                                        Informasi Kendaraan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500 mb-1">Merek & Model</p>
                                            <p className="font-bold text-slate-900">{booking.vehicle.brand} {booking.vehicle.model}</p>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs text-slate-500 mb-1">Plat Nomor</p>
                                            <p className="font-bold text-slate-900 text-xl">{booking.vehicle.plate_number}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {booking.vehicle.year && (
                                                <div className="rounded-xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500 mb-1">Tahun</p>
                                                    <p className="font-bold text-slate-900">{booking.vehicle.year}</p>
                                                </div>
                                            )}
                                            {booking.vehicle.color && (
                                                <div className="rounded-xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500 mb-1">Warna</p>
                                                    <p className="font-bold text-slate-900">{booking.vehicle.color}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Service Items */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2">
                                        <Wrench className="h-5 w-5 text-white" />
                                    </div>
                                    Layanan Booking
                                </CardTitle>
                                {canAddService && (
                                    <Button size="sm" onClick={() => setAddServiceModalOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Tambah Layanan
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {booking.serviceItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="rounded-full bg-slate-100 p-4">
                                            <Wrench className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-slate-900">Tidak ada layanan</p>
                                        <p className="mt-1 text-xs text-slate-500">Belum ada layanan yang ditambahkan</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {booking.serviceItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                                    <div className="rounded-lg bg-violet-100 p-2.5 shrink-0">
                                                        <Wrench className="h-5 w-5 text-violet-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-slate-900">{item.service.name}</p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className="text-xs">x{item.quantity}</Badge>
                                                            {item.sub_item_name && (
                                                                <Badge variant="outline" className="text-xs">{item.sub_item_name}</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">{formatCurrency(item.unit_price)} per item</p>
                                                    </div>
                                                </div>
                                                <p className="text-xl font-bold text-slate-900 shrink-0 ml-4">{formatCurrency(item.subtotal)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {(booking.notes || booking.admin_notes) && (
                            <Card className="border-slate-200 bg-white">
                                <CardHeader className="space-y-3 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2">
                                            <FileText className="h-5 w-5 text-white" />
                                        </div>
                                        Catatan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {booking.notes && (
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Catatan Pelanggan
                                            </p>
                                            <p className="text-sm text-slate-600">{booking.notes}</p>
                                        </div>
                                    )}
                                    {booking.admin_notes && (
                                        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
                                            <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                Catatan Admin
                                            </p>
                                            <p className="text-sm text-blue-600">{booking.admin_notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Update Status */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader className="space-y-3 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-2">
                                        <ArrowRight className="h-5 w-5 text-white" />
                                    </div>
                                    Update Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="admin_notes" className="text-sm font-medium">Catatan Admin</Label>
                                    <Textarea
                                        id="admin_notes"
                                        value={statusForm.data.admin_notes}
                                        onChange={(e) => statusForm.setData('admin_notes', e.target.value)}
                                        placeholder="Tambah catatan untuk booking ini..."
                                        className="min-h-24"
                                    />
                                </div>

                                {nextStatus ? (
                                    <div className="space-y-3">
                                        <Button
                                            type="button"
                                            className={cn('w-full', buttonColorClass, 'shadow-lg')}
                                            onClick={() => setConfirmNextStep(true)}
                                            disabled={statusForm.processing}
                                        >
                                            {statusForm.processing ? (
                                                <span>Memproses...</span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <ArrowRight className="h-4 w-4" />
                                                    Lanjutkan: {statusLabels[nextStatus]}
                                                </span>
                                            )}
                                        </Button>

                                        {confirmNextStep && (
                                            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                                                <p className="text-sm font-medium text-amber-900 mb-3 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Konfirmasi Update
                                                </p>
                                                <p className="text-sm text-amber-800 mb-4">Ubah status ke <strong>{statusLabels[nextStatus]}</strong>?</p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={goToNextStatus} disabled={statusForm.processing} className="bg-amber-600 hover:bg-amber-700">
                                                        Ya, Update
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setConfirmNextStep(false)}
                                                        disabled={statusForm.processing}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                                            <p className="text-sm text-slate-600">
                                                Status: <span className="font-bold text-slate-900">{statusLabels[currentStatus]}</span>
                                            </p>
                                        </div>
                                        {currentStatus === 'completed' && (
                                            <div className="flex flex-col gap-2">
                                                <a href={`/admin/bookings/${booking.id}/invoice`} target="_blank">
                                                    <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                                                        <Printer className="h-4 w-4 mr-2" />
                                                        Download Invoice
                                                    </Button>
                                                </a>
                                                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                                                    <Printer className="h-4 w-4 mr-2" />
                                                    Cetak Struk Browser
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Mechanics */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader className="space-y-3 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 p-2">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    Mekanik
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-56 space-y-2 overflow-y-auto">
                                    {availableMechanics.map((mechanic) => (
                                        <label key={mechanic.id} className={cn(
                                            'flex items-center gap-3 rounded-xl p-3 border transition-all',
                                            canEditMechanics ? 'cursor-pointer hover:border-slate-300 hover:bg-slate-50' : 'opacity-60 bg-slate-50'
                                        )}>
                                            <Checkbox
                                                checked={selectedMechanicIds.includes(mechanic.id)}
                                                disabled={!canEditMechanics}
                                                onCheckedChange={(checked) => {
                                                    if (!canEditMechanics) return;
                                                    setSelectedMechanicIds((prev) =>
                                                        checked ? [...prev, mechanic.id] : prev.filter((id) => id !== mechanic.id),
                                                    );
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-900 text-sm truncate">{mechanic.name}</p>
                                                {mechanic.specialization && <p className="text-xs text-slate-500 truncate">{mechanic.specialization}</p>}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <Button onClick={assignMechanics} className="w-full" disabled={statusForm.processing || !canEditMechanics}>
                                    {statusForm.processing ? 'Menyimpan...' : 'Simpan Mekanik'}
                                </Button>

                                {!canEditMechanics && (
                                    <p className="text-xs text-slate-500 text-center">Status selesai/dibatalkan - mekanik tidak dapat diubah</p>
                                )}

                                {booking.mechanics && booking.mechanics.length > 0 && (
                                    <div className="border-t pt-4">
                                        <p className="mb-3 text-sm font-semibold text-slate-900">Saat Ini Ditugaskan:</p>
                                        <div className="space-y-2">
                                            {booking.mechanics.map((mechanic) => (
                                                <div key={mechanic.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-slate-900 text-sm truncate">{mechanic.name}</p>
                                                        {mechanic.phone && (
                                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {mechanic.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment */}
                        <Card className="border-slate-200 bg-white">
                            <CardHeader className="space-y-3 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-2">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(booking.total_amount)}</span>
                                    </div>
                                    {booking.discount_amount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Diskon</span>
                                            <span className="font-bold">-{formatCurrency(booking.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
                                        <span className="text-slate-900">Total</span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                            {formatCurrency(booking.final_amount)}
                                        </span>
                                    </div>
                                </div>

                                {booking.payments && booking.payments.length > 0 && (
                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="mb-3 text-sm font-semibold text-slate-900">Riwayat Pembayaran:</p>
                                        <div className="space-y-2">
                                            {booking.payments.map((payment) => (
                                                <div key={payment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="capitalize text-sm text-slate-700 font-medium">
                                                            {payment.payment_method === 'cash' && 'Tunai'}
                                                            {payment.payment_method === 'transfer' && 'Transfer'}
                                                            {payment.payment_method === 'e-wallet' && 'E-Wallet'}
                                                            {payment.payment_method === 'card' && 'Kartu'}
                                                        </span>
                                                        <span className="font-bold text-slate-900">{formatCurrency(payment.amount)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add Service Modal */}
            <Dialog open={addServiceModalOpen} onOpenChange={setAddServiceModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Layanan</DialogTitle>
                        <DialogDescription>Tambahkan layanan tambahan saat proses servis berlangsung.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitExtraService} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="service_item_id">Layanan</Label>
                            <select
                                id="service_item_id"
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                value={addServiceForm.data.service_item_id}
                                onChange={(e) => {
                                    addServiceForm.setData('service_item_id', e.target.value);
                                    addServiceForm.setData('service_sub_item_id', '');
                                }}
                                required
                            >
                                {allServices.map((service) => (
                                    <option key={service.id} value={String(service.id)}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service_sub_item_id">Sub Item (Opsional)</Label>
                            <select
                                id="service_sub_item_id"
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                value={addServiceForm.data.service_sub_item_id}
                                onChange={(e) => addServiceForm.setData('service_sub_item_id', e.target.value)}
                            >
                                <option value="">Tanpa Sub Item</option>
                                {selectedServiceSubItems.map((subItem) => (
                                    <option key={subItem.id} value={String(subItem.id)}>
                                        {subItem.name} (+{formatCurrency(subItem.additional_price)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Jumlah</Label>
                            <input
                                id="quantity"
                                type="number"
                                min={1}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                value={addServiceForm.data.quantity}
                                onChange={(e) => addServiceForm.setData('quantity', e.target.value)}
                                required
                            />
                        </div>

                        {(addServiceForm.errors.service_item_id || addServiceForm.errors.service_sub_item_id || addServiceForm.errors.quantity) && (
                            <p className="text-sm text-red-600">
                                {addServiceForm.errors.service_item_id || addServiceForm.errors.service_sub_item_id || addServiceForm.errors.quantity}
                            </p>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setAddServiceModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={addServiceForm.processing}>
                                {addServiceForm.processing ? 'Menyimpan...' : 'Tambah'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
