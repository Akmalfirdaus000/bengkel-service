import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Activity, ArrowLeft, Calendar, Plus, X, Wrench, Car, Clock, User, Phone, Tag } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ServiceCategory {
    id: number;
    name: string;
    slug: string;
    services?: Service[];
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
    serviceCategories: ServiceCategory[];
}

interface SelectedService {
    lineId: number;
    service: Service;
    quantity: number;
    subItem?: ServiceSubItem;
}

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

export default function PublicCreateBooking({ serviceCategories }: CreateBookingProps) {
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [pendingServiceId, setPendingServiceId] = useState<number | null>(null);
    const [pendingSubItemIds, setPendingSubItemIds] = useState<number[]>([]);
    const [dateBookingCount, setDateBookingCount] = useState(0);
    const lineIdRef = useRef(1);

    const { data, setData, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        brand: '',
        model: '',
        plate_number: '',
        engine_number: '',
        frame_number: '',
        year: '',
        color: '',
        booking_date: '',
        service_date: '',
        notes: '',
    });

    const services = useMemo(() => {
        let allServices: Service[] = [];
        serviceCategories.forEach(cat => {
            if (cat.services) {
                const catServices = cat.services.map(s => ({ ...s, category: cat }));
                allServices = [...allServices, ...catServices];
            }
        });
        return allServices;
    }, [serviceCategories]);

    const categories = serviceCategories;

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

    const isFormValid = Boolean(
        data.customer_name && 
        data.customer_phone && 
        data.brand && 
        data.model && 
        data.plate_number && 
        data.booking_date && 
        data.service_date &&
        selectedServices.length > 0 && 
        slotsAvailable > 0
    );

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

        // Sub item selection is hidden from public UI. Add directly.

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

        const formattedServices = selectedServices.map((selected) => ({
            service_id: selected.service.id,
            sub_item_id: selected.subItem?.id ?? null,
            quantity: selected.quantity
        }));

        router.post(
            '/booking',
            {
                customer_name: data.customer_name,
                customer_phone: data.customer_phone,
                brand: data.brand,
                model: data.model,
                plate_number: data.plate_number,
                engine_number: data.engine_number,
                frame_number: data.frame_number,
                year: data.year,
                color: data.color,
                booking_date: data.booking_date,
                service_date: data.service_date,
                services: formattedServices,
                notes: data.notes,
            },
            {
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
        <div className="min-h-screen bg-slate-50">
            <Head title="Booking Servis - Gama 2000 Auto Service" />

            <div className="w-full min-w-0">
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
                                <Link href="/">
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
                                            Gama 2000 Auto Service
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Booking Servis Kendaraan
                                    </h1>
                                    <p className="text-blue-100 max-w-2xl">
                                        Jadwalkan servis untuk kendaraan Anda dengan mudah dan cepat tanpa perlu mendaftar.
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
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Tanggal Booking <span className="text-red-500">*</span></label>
                                        <Input
                                            type="date"
                                            value={data.booking_date}
                                            onChange={(e) => handleBookingDateChange(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Tanggal Servis <span className="text-red-500">*</span></label>
                                        <Input
                                            type="date"
                                            value={data.service_date}
                                            onChange={(e) => setData('service_date', e.target.value)}
                                            min={data.booking_date || new Date().toISOString().split('T')[0]}
                                            className="w-full"
                                            required
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
                                {errors.service_date && <p className="text-sm text-red-600 mt-2 ml-16">{errors.service_date}</p>}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Customer Data */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Pelanggan
                                </h2>
                                <Card>
                                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    className="pl-9" 
                                                    placeholder="Contoh: Budi Santoso" 
                                                    value={data.customer_name} 
                                                    onChange={e => setData('customer_name', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            {errors.customer_name && <p className="text-sm text-red-600 mt-1">{errors.customer_name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    className="pl-9" 
                                                    placeholder="Contoh: 08123456789" 
                                                    value={data.customer_phone} 
                                                    onChange={e => setData('customer_phone', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            {errors.customer_phone && <p className="text-sm text-red-600 mt-1">{errors.customer_phone}</p>}
                                            <p className="text-xs text-gray-500">Kami akan menghubungi Anda via WhatsApp untuk konfirmasi.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Vehicle Data */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Car className="h-5 w-5" />
                                    Data Kendaraan
                                </h2>
                                <Card>
                                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Merek Mobil <span className="text-red-500">*</span></label>
                                            <Input 
                                                placeholder="Contoh: Toyota" 
                                                value={data.brand} 
                                                onChange={e => setData('brand', e.target.value)} 
                                                required 
                                            />
                                            {errors.brand && <p className="text-sm text-red-600 mt-1">{errors.brand}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Model Mobil <span className="text-red-500">*</span></label>
                                            <Input 
                                                placeholder="Contoh: Avanza" 
                                                value={data.model} 
                                                onChange={e => setData('model', e.target.value)} 
                                                required 
                                            />
                                            {errors.model && <p className="text-sm text-red-600 mt-1">{errors.model}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Plat Nomor <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    className="pl-9 uppercase" 
                                                    placeholder="Contoh: B 1234 CD" 
                                                    value={data.plate_number} 
                                                    onChange={e => setData('plate_number', e.target.value.toUpperCase())} 
                                                    required 
                                                />
                                            </div>
                                            {errors.plate_number && <p className="text-sm text-red-600 mt-1">{errors.plate_number}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Nomor Seri Mesin (Opsional)</label>
                                            <Input 
                                                placeholder="Contoh: 1ND-1234567" 
                                                value={data.engine_number} 
                                                onChange={e => setData('engine_number', e.target.value.toUpperCase())} 
                                                className="uppercase"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Nomor Seri Rangka (Opsional)</label>
                                            <Input 
                                                placeholder="Contoh: MHX1234567890" 
                                                value={data.frame_number} 
                                                onChange={e => setData('frame_number', e.target.value.toUpperCase())} 
                                                className="uppercase"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Tahun (Opsional)</label>
                                            <Input 
                                                placeholder="Contoh: 2018" 
                                                value={data.year} 
                                                onChange={e => setData('year', e.target.value)} 
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Services Data */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    Layanan yang Diinginkan
                                    <Badge variant="secondary">{selectedServices.length}</Badge>
                                </h2>

                                <Card className="border-dashed">
                                    <CardContent className="p-4">
                                        <Button type="button" className="w-full bg-slate-800 text-white hover:bg-slate-700" onClick={() => setServiceDialogOpen(true)}>
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

                            {/* Additional Notes */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Catatan Tambahan (Keluhan Utama)</h2>
                                <Card>
                                    <CardContent className="p-4">
                                        <Textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tuliskan keluhan utama mobil Anda di sini... (opsional)"
                                            className="min-h-24 resize-none"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 space-y-4">
                                <Card>
                                    <CardContent className="p-6 space-y-4">
                                        <h2 className="text-lg font-bold flex items-center gap-2 pb-4 border-b">
                                            <Wrench className="h-5 w-5" />
                                            Ringkasan Booking
                                        </h2>

                                        <div className="flex justify-between items-start pb-4 border-b">
                                            <span className="text-sm text-gray-600">Pemesan</span>
                                            <div className="text-right">
                                                <p className="font-semibold text-sm">
                                                    {data.customer_name || '-'}
                                                </p>
                                                <p className="text-xs text-gray-500">{data.customer_phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-start pb-4 border-b">
                                            <span className="text-sm text-gray-600">Kendaraan</span>
                                            <div className="text-right">
                                                <p className="font-semibold text-sm">
                                                    {data.brand && data.model ? `${data.brand} ${data.model}` : '-'}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono uppercase">{data.plate_number}</p>
                                            </div>
                                        </div>

                                        {data.booking_date && (
                                            <div className="flex justify-between items-start pb-4 border-b">
                                                <span className="text-sm text-gray-600">Tanggal Booking & Antrian</span>
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

                                        {data.service_date && (
                                            <div className="flex justify-between items-start pb-4 border-b">
                                                <span className="text-sm text-gray-600">Tanggal Servis</span>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">{formatDateIndo(data.service_date)}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pb-4 border-b">
                                            <span className="text-sm text-gray-600">Total Layanan</span>
                                            <span className="font-bold">{selectedServices.length}</span>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                            <p className="text-sm text-gray-600">Total biaya akan diinformasikan oleh admin/mekanik setelah dilakukan pengecekan di bengkel.</p>
                                        </div>

                                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" disabled={!isFormValid || processing}>
                                            {processing ? 'Memproses...' : 'Kirim Booking'}
                                        </Button>

                                        {slotsAvailable <= 3 && slotsAvailable > 0 && (
                                            <p className="text-xs text-center text-orange-600">⚠️ Sisa {slotsAvailable} slot lagi untuk tanggal ini</p>
                                        )}

                                        <p className="text-xs text-center text-gray-500">
                                            Admin kami akan menghubungi Anda via WhatsApp setelah Anda mengirim form ini.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Service Selection Dialog */}
            <Dialog open={serviceDialogOpen && !pendingServiceId} onOpenChange={setServiceDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Pilih Kategori Servis</DialogTitle>
                        <DialogDescription>
                            Pilih kategori servis untuk kendaraan Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        <div className="space-y-3">
                            {services.length === 0 ? (
                                <p className="text-sm text-gray-500 italic text-center py-4">Tidak ada layanan tersedia</p>
                            ) : (
                                services.map((service) => {
                                    const isSelected = selectedServices.some(
                                        (selected) => selected.service.id === service.id
                                    );
                                    return (
                                        <div
                                            key={service.id}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                isSelected
                                                    ? 'border-blue-600 bg-blue-50/50'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                                                    {service.description && (
                                                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={isSelected ? 'secondary' : 'default'}
                                                    disabled={isSelected}
                                                    onClick={() => handleAddService(service)}
                                                >
                                                    {isSelected ? 'Terpilih' : 'Pilih'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{selectedServices.length} kategori dipilih</span>
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
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Pilih Varian: {pendingService.name}</DialogTitle>
                            <DialogDescription>Item ini memiliki beberapa sub pilihan. Pilih minimal satu.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-4 max-h-60 overflow-y-auto">
                            {pendingService.sub_items.map((subItem) => {
                                const isChecked = pendingSubItemIds.includes(subItem.id);
                                return (
                                    <label
                                        key={subItem.id}
                                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                            isChecked ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-1"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPendingSubItemIds([...pendingSubItemIds, subItem.id]);
                                                } else {
                                                    setPendingSubItemIds(pendingSubItemIds.filter((id) => id !== subItem.id));
                                                }
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{subItem.name}</p>
                                            {subItem.slug && <p className="text-xs text-gray-500 mt-0.5">{subItem.slug}</p>}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setPendingServiceId(null);
                                    setPendingSubItemIds([]);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="button" onClick={confirmAddServiceWithSubItem}>
                                Konfirmasi & Tambah
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
