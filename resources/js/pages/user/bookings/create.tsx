import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Activity, ArrowLeft, Calendar, Plus, X, Wrench, Car, Check, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    plate_number: string;
    year?: string;
}

interface ServiceCategory {
    id: number;
    name: string;
    slug: string;
}

interface ServiceSubItem {
    id: number;
    name: string;
    slug: string;
    additional_price: number | string;
}

interface Service {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    duration?: string;
    category: ServiceCategory;
    sub_items: ServiceSubItem[];
}

interface CreateBookingProps {
    vehicles: Vehicle[];
    services: Service[];
}

interface SelectedService {
    lineId: number;
    service: Service;
    quantity: number;
    subItem?: ServiceSubItem;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Booking Saya', href: '/user/bookings' },
    { title: 'Booking Baru', href: '/user/bookings/create' },
];

const toMoneyNumber = (value: number | string | null | undefined) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (amount: number | string) => {
    const safeAmount = toMoneyNumber(amount);
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
};

const formatDateIndo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const getEstimatedTime = (queueOrder: number) => {
    const startHour = 8;
    const slotDuration = 90;
    const minutesFromStart = (queueOrder - 1) * slotDuration;

    const startTime = new Date();
    startTime.setHours(startHour, 0, 0, 0);
    startTime.setMinutes(startTime.getMinutes() + minutesFromStart);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    return {
        start: startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        end: endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
};

export default function CreateBooking({ vehicles, services }: CreateBookingProps) {
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [pendingServiceId, setPendingServiceId] = useState<number | null>(null);
    const [pendingSubItemIds, setPendingSubItemIds] = useState<number[]>([]);
    const [dateBookingCount, setDateBookingCount] = useState(0);
    const lineIdRef = useRef(1);

    const { data, setData, processing, errors } = useForm({
        vehicle_id: '',
        booking_date: '',
        notes: '',
    });

    const categories = useMemo(() => {
        const grouped = new Map<number, ServiceCategory>();
        services.forEach((service) => {
            if (!grouped.has(service.category.id)) {
                grouped.set(service.category.id, service.category);
            }
        });
        return Array.from(grouped.values());
    }, [services]);

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === selectedCategoryId),
        [categories, selectedCategoryId],
    );

    const filteredServices = useMemo(
        () => services.filter((service) => service.category.id === selectedCategoryId),
        [services, selectedCategoryId],
    );

    const pendingService = useMemo(
        () => services.find((service) => service.id === pendingServiceId) ?? null,
        [services, pendingServiceId],
    );

    const nextQueueNumber = dateBookingCount + 1;
    const estimatedTime = getEstimatedTime(nextQueueNumber);
    const slotsAvailable = 10 - dateBookingCount;

    const totalAmount = useMemo(() => {
        return selectedServices.reduce((sum, selected) => {
            const variantPrice = toMoneyNumber(selected.subItem?.additional_price ?? 0);
            const basePrice = toMoneyNumber(selected.service.price);
            const unitPrice = basePrice + variantPrice;
            return sum + unitPrice * selected.quantity;
        }, 0);
    }, [selectedServices]);

    const selectedVehicleInfo = useMemo(
        () => vehicles.find((vehicle) => vehicle.id === Number.parseInt(data.vehicle_id, 10)),
        [vehicles, data.vehicle_id],
    );

    const isFormValid = Boolean(data.vehicle_id && data.booking_date && selectedServices.length > 0 && slotsAvailable > 0);

    const nextLineId = () => {
        const id = lineIdRef.current;
        lineIdRef.current += 1;
        return id;
    };

    const handleAddService = (service: Service) => {
        const existingNoVariant = selectedServices.find(
            (selected) => selected.service.id === service.id && !selected.subItem,
        );
        if (existingNoVariant) {
            toast.info('Layanan sudah ditambahkan', {
                description: service.name,
                duration: 3000,
            });
            return;
        }

        if (service.sub_items.length > 0) {
            setPendingServiceId(service.id);
            setPendingSubItemIds([]);
            return;
        }

        setSelectedServices([
            ...selectedServices,
            {
                lineId: nextLineId(),
                service,
                quantity: 1,
                subItem: undefined,
            },
        ]);

        toast.success('Layanan ditambahkan', {
            description: service.name,
            duration: 2000,
        });
    };

    const confirmAddServiceWithSubItem = () => {
        if (!pendingService || pendingSubItemIds.length === 0) {
            toast.error('Pilih minimal satu sub item');
            return;
        }

        const subItemsToAdd = pendingService.sub_items.filter((subItem) => pendingSubItemIds.includes(subItem.id));
        if (subItemsToAdd.length === 0) return;

        const existingKeys = new Set(
            selectedServices.map(
                (selected) => `${selected.service.id}:${selected.subItem?.id ?? 'none'}`,
            ),
        );

        const newLines = subItemsToAdd
            .filter((subItem) => !existingKeys.has(`${pendingService.id}:${subItem.id}`))
            .map((subItem) => ({
                lineId: nextLineId(),
                service: pendingService,
                quantity: 1,
                subItem,
            }));

        if (newLines.length === 0) {
            toast.info('Semua sub item yang dipilih sudah ada di daftar');
            return;
        }

        setSelectedServices([...selectedServices, ...newLines]);

        setPendingServiceId(null);
        setPendingSubItemIds([]);

        toast.success('Layanan ditambahkan', {
            description: `${pendingService.name} (${newLines.length} sub item)`,
            duration: 2000,
        });
    };

    const handleRemoveService = (lineId: number) => {
        const removedService = selectedServices.find((selected) => selected.lineId === lineId);
        setSelectedServices(selectedServices.filter((selected) => selected.lineId !== lineId));

        if (!removedService) return;
        toast('Layanan dihapus', {
            description: removedService.service.name,
            duration: 2000,
        });
    };

    const handleUpdateQuantity = (lineId: number, delta: number) => {
        setSelectedServices(
            selectedServices.map((selected) =>
                selected.lineId === lineId
                    ? { ...selected, quantity: Math.max(1, selected.quantity + delta) }
                    : selected,
            ),
        );
    };

    const handleBookingDateChange = async (date: string) => {
        setData('booking_date', date);

        if (!date) {
            setDateBookingCount(0);
            return;
        }

        try {
            const response = await fetch(`/api/bookings/check-availability?date=${date}`);
            const result = await response.json();
            setDateBookingCount(result.count || 0);
        } catch {
            setDateBookingCount(0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (slotsAvailable <= 0) {
            toast.error('Slot booking penuh', {
                description: 'Silakan pilih tanggal lain',
                duration: 5000,
            });
            return;
        }

        const serviceIds = selectedServices.map((selected) => selected.service.id);
        const quantities = selectedServices.map((selected) => selected.quantity);
        const subItemIds = selectedServices.map((selected) => selected.subItem?.id ?? null);

        router.post(
            '/user/bookings',
            {
                vehicle_id: data.vehicle_id,
                booking_date: data.booking_date,
                service_ids: serviceIds,
                service_quantities: quantities,
                sub_item_ids: subItemIds,
                notes: data.notes,
            },
            {
                onSuccess: () => {
                    toast.success('Booking berhasil dibuat!', {
                        description: `Nomor Antrian: ${String(nextQueueNumber).padStart(3, '0')} | Estimasi: ${estimatedTime.start} - ${estimatedTime.end}`,
                        duration: 6000,
                    });
                },
                onError: (submitErrors) => {
                    toast.error('Gagal membuat booking', {
                        description: Object.values(submitErrors).flat().join(', ') || 'Silakan periksa kembali input Anda',
                        duration: 5000,
                    });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Servis" />

            <div className="min-h-screen w-full min-w-0 bg-slate-50">
                {/* Header Section */}
                <section className="min-w-0 overflow-hidden border-b border-slate-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="/user/bookings">
                                    <Button variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                                        <ArrowLeft className="h-5 w-5" />
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
                                        Booking Servis Kendaraan
                                    </h1>
                                    <p className="text-blue-100 max-w-2xl">
                                        Jadwalkan servis untuk kendaraan Anda dengan mudah dan cepat
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date Selection Card */}
                    <div className="max-w-7xl mx-auto px-4 -mt-4">
                        <Card className="border-slate-200 bg-white shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <Calendar className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Tanggal Booking</label>
                                        <Input
                                            type="date"
                                            value={data.booking_date}
                                            onChange={(e) => handleBookingDateChange(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full"
                                        />
                                    </div>

                                    {data.booking_date && (
                                        <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-600">Sudah Booking</p>
                                                <p className="text-lg font-bold">{dateBookingCount}</p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-300"></div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-600">Sisa Slot</p>
                                                <p className="text-lg font-bold text-green-600">{slotsAvailable}</p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-300"></div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-600">No. Antrian</p>
                                                <p className="text-lg font-bold text-blue-600">{String(nextQueueNumber).padStart(3, '0')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {data.booking_date && (
                                    <div className="ml-16 mt-3 flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDateIndo(data.booking_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>Estimasi: {estimatedTime.start} - {estimatedTime.end}</span>
                                        </div>
                                        {slotsAvailable === 0 && <Badge variant="destructive">Slot Penuh</Badge>}
                                    </div>
                                )}

                                {errors.booking_date && <p className="text-sm text-red-600 mt-2 ml-16">{errors.booking_date}</p>}
                            </CardContent>
                        </Card>
                    </div>

                </section>


                <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Car className="h-5 w-5" />
                                    Pilih Kendaraan
                                </h2>
                                {vehicles.length === 0 ? (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-4">Tidak ada kendaraan. Tambah kendaraan terlebih dahulu.</p>
                                            <Link href="/user/vehicles/create">
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Tambah Kendaraan
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {vehicles.map((vehicle) => (
                                            <Card
                                                key={vehicle.id}
                                                className={`cursor-pointer transition-all hover:shadow-md ${
                                                    data.vehicle_id === String(vehicle.id)
                                                        ? 'ring-2 ring-gray-900 shadow-md'
                                                        : 'hover:border-gray-400'
                                                }`}
                                                onClick={() => {
                                                    setData('vehicle_id', String(vehicle.id));
                                                }}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex flex-col items-center text-center">
                                                        <div
                                                            className={`p-4 rounded-xl mb-3 ${
                                                                data.vehicle_id === String(vehicle.id) ? 'bg-gray-900' : 'bg-gray-100'
                                                            }`}
                                                        >
                                                            <Car
                                                                className={`h-8 w-8 ${
                                                                    data.vehicle_id === String(vehicle.id)
                                                                        ? 'text-white'
                                                                        : 'text-gray-600'
                                                                }`}
                                                            />
                                                        </div>
                                                        <h3 className="font-semibold text-sm">
                                                            {vehicle.brand} {vehicle.model}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 mt-1 font-mono">{vehicle.plate_number}</p>
                                                        {vehicle.year && <p className="text-xs text-gray-500 mt-1">{vehicle.year}</p>}
                                                        {data.vehicle_id === String(vehicle.id) && (
                                                            <Badge className="mt-2 bg-gray-900">
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Dipilih
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                {errors.vehicle_id && <p className="text-sm text-red-600 mt-2">{errors.vehicle_id}</p>}
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    Layanan
                                    <Badge variant="secondary">{selectedServices.length}</Badge>
                                </h2>

                                <Card className="border-dashed">
                                    <CardContent className="p-4">
                                        <Button type="button" className="w-full" onClick={() => setServiceDialogOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Pilih Layanan
                                        </Button>

                                        {selectedServices.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {selectedServices.map((selected) => {
                                                    const variantPrice = toMoneyNumber(selected.subItem?.additional_price ?? 0);
                                                    const basePrice = toMoneyNumber(selected.service.price);
                                                    const unitPrice = basePrice + variantPrice;

                                                    return (
                                                        <Card key={selected.lineId}>
                                                            <CardContent className="p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm">{selected.service.name}</p>
                                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                x{selected.quantity}
                                                                            </Badge>
                                                                            {selected.subItem && (
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    {selected.subItem.name}
                                                                                </Badge>
                                                                            )}
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {selected.service.category.name}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center border rounded">
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8"
                                                                                onClick={() => handleUpdateQuantity(selected.lineId, -1)}
                                                                            >
                                                                                −
                                                                            </Button>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8"
                                                                                onClick={() => handleUpdateQuantity(selected.lineId, 1)}
                                                                            >
                                                                                +
                                                                            </Button>
                                                                        </div>
                                                                        <p className="text-sm font-semibold w-24 text-right">
                                                                            {formatCurrency(unitPrice * selected.quantity)}
                                                                        </p>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-red-600"
                                                                            onClick={() => handleRemoveService(selected.lineId)}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {selectedServices.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                                <p>Belum ada layanan dipilih</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4">Catatan Tambahan</h2>
                                <Card>
                                    <CardContent className="p-4">
                                        <Textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Keluhan atau kebutuhan khusus lainnya... (opsional)"
                                            className="min-h-24 resize-none"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-4 space-y-4">
                                <Card>
                                    <CardContent className="p-6 space-y-4">
                                        <h2 className="text-lg font-bold flex items-center gap-2 pb-4 border-b">
                                            <Wrench className="h-5 w-5" />
                                            Ringkasan Booking
                                        </h2>

                                        {selectedVehicleInfo && (
                                            <div className="flex justify-between items-start pb-4 border-b">
                                                <span className="text-sm text-gray-600">Kendaraan</span>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">
                                                        {selectedVehicleInfo.brand} {selectedVehicleInfo.model}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-mono">{selectedVehicleInfo.plate_number}</p>
                                                </div>
                                            </div>
                                        )}

                                        {data.booking_date && (
                                            <div className="flex justify-between items-start pb-4 border-b">
                                                <span className="text-sm text-gray-600">Tanggal & Antrian</span>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">{formatDateIndo(data.booking_date)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        No. Antrian {String(nextQueueNumber).padStart(3, '0')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {estimatedTime.start} - {estimatedTime.end}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pb-4 border-b">
                                            <span className="text-sm text-gray-600">Total Layanan</span>
                                            <span className="font-bold">{selectedServices.length}</span>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">Total Biaya</span>
                                                <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || processing}>
                                            {processing ? 'Memproses...' : 'Konfirmasi Booking'}
                                        </Button>

                                        {slotsAvailable <= 3 && slotsAvailable > 0 && (
                                            <p className="text-xs text-center text-orange-600">⚠️ Sisa {slotsAvailable} slot lagi untuk tanggal ini</p>
                                        )}

                                        <p className="text-xs text-center text-gray-500">
                                            Dengan melakukan booking, Anda menyetujui syarat dan ketentuan kami
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </form>

            </div>


            <Dialog open={serviceDialogOpen && !pendingServiceId} onOpenChange={setServiceDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Pilih Layanan</DialogTitle>
                        <DialogDescription>
                            Alur: pilih kategori servis, lalu pilih item servis. Jika item punya varian, pilih nama variannya.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        {!selectedCategoryId ? (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Pilih Kategori Servis</h3>
                                <div className="grid gap-3">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => setSelectedCategoryId(category.id)}
                                            className="p-5 rounded-lg text-left transition-all border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-lg">{category.name}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{category.slug}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Plus className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4 border-2 rounded-xl p-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedCategory?.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">Pilih item servis dari kategori ini.</p>
                                    </div>
                                    <Button type="button" variant="outline" onClick={() => setSelectedCategoryId(null)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Ganti Kategori
                                    </Button>
                                </div>

                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {filteredServices.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic text-center py-4">Tidak ada item servis tersedia</p>
                                    ) : (
                                        filteredServices.map((service) => {
                                            const hasSubItems = service.sub_items.length > 0;
                                            const isSelectedWithoutVariant = selectedServices.some(
                                                (selected) => selected.service.id === service.id && !selected.subItem,
                                            );
                                            const selectedVariantCount = selectedServices.filter(
                                                (selected) => selected.service.id === service.id && !!selected.subItem,
                                            ).length;
                                            return (
                                                <div
                                                    key={service.id}
                                                    className={`p-3 rounded-lg border transition-all ${
                                                        isSelectedWithoutVariant
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{service.name}</p>
                                                            {service.description && (
                                                                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <p className="text-sm text-gray-600">{formatCurrency(service.price)}</p>
                                                                {hasSubItems && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {service.sub_items.length} varian
                                                                    </Badge>
                                                                )}
                                                                {selectedVariantCount > 0 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {selectedVariantCount} dipilih
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={isSelectedWithoutVariant ? 'secondary' : 'default'}
                                                            disabled={isSelectedWithoutVariant}
                                                            onClick={() => handleAddService(service)}
                                                        >
                                                            {isSelectedWithoutVariant
                                                                ? 'Ditambahkan'
                                                                : hasSubItems
                                                                  ? 'Pilih Sub Item'
                                                                  : 'Tambah'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{selectedServices.length} layanan dipilih</span>
                            <Button type="button" onClick={() => setServiceDialogOpen(false)} disabled={selectedServices.length === 0}>
                                Selesai
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {pendingService && pendingService.sub_items.length > 0 && (
                <Dialog
                    open={!!pendingServiceId}
                    onOpenChange={(open) => {
                        if (!open) {
                            setPendingServiceId(null);
                            setPendingSubItemIds([]);
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Pilih Nama Sub Item</DialogTitle>
                            <DialogDescription>
                                Anda memilih {pendingService.name}. Silakan pilih varian/sub item yang diinginkan.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2 mt-3">
                            {pendingService.sub_items.map((subItem) => (
                                <button
                                    key={subItem.id}
                                    type="button"
                                    onClick={() => {
                                        setPendingSubItemIds((prev) =>
                                            prev.includes(subItem.id)
                                                ? prev.filter((id) => id !== subItem.id)
                                                : [...prev, subItem.id],
                                        );
                                    }}
                                    className={`w-full text-left p-3 rounded-lg border transition ${
                                        pendingSubItemIds.includes(subItem.id)
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-sm">{subItem.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{subItem.slug}</p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            +{formatCurrency(subItem.additional_price)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <Button
                            type="button"
                            className="w-full mt-4"
                            onClick={confirmAddServiceWithSubItem}
                            disabled={pendingSubItemIds.length === 0}
                        >
                            Konfirmasi Pilihan
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
