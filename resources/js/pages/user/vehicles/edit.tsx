import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car, Trash2, Activity, Edit3 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface EditVehicleProps {
    vehicle: {
        id: number;
        brand: string;
        model: string;
        plate_number: string;
        year?: string;
        color?: string;
        notes?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Kendaraan Saya', href: '/user/vehicles' },
    { title: 'Edit Kendaraan', href: '#' },
];

export default function EditVehicle({ vehicle }: EditVehicleProps) {
    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        brand: vehicle.brand,
        model: vehicle.model,
        plate_number: vehicle.plate_number,
        year: vehicle.year || '',
        color: vehicle.color || '',
        notes: vehicle.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/user/vehicles/${vehicle.id}`);
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
            destroy(`/user/vehicles/${vehicle.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kendaraan" />

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
                            <div className="flex flex-wrap items-center gap-4">
                                <Link href="/user/vehicles">
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
                                        Edit Kendaraan
                                    </h1>
                                    <p className="text-blue-100">
                                        Perbarui informasi kendaraan "{vehicle.brand} {vehicle.model}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <Edit3 className="h-5 w-5 text-blue-600" />
                            Form Kendaraan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="brand" className="text-slate-700">Merek *</Label>
                                    <Input
                                        id="brand"
                                        className="border-slate-200"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                        placeholder="Contoh: Toyota"
                                        required
                                    />
                                    {errors.brand && (
                                        <p className="text-sm text-red-600">{errors.brand}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model" className="text-slate-700">Model *</Label>
                                    <Input
                                        id="model"
                                        className="border-slate-200"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="Contoh: Avanza"
                                        required
                                    />
                                    {errors.model && (
                                        <p className="text-sm text-red-600">{errors.model}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="plate_number" className="text-slate-700">Plat Nomor *</Label>
                                    <Input
                                        id="plate_number"
                                        className="border-slate-200"
                                        value={data.plate_number}
                                        onChange={(e) => setData('plate_number', e.target.value)}
                                        placeholder="Contoh: B 1234 XYZ"
                                        required
                                    />
                                    {errors.plate_number && (
                                        <p className="text-sm text-red-600">{errors.plate_number}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="year" className="text-slate-700">Tahun</Label>
                                    <Input
                                        id="year"
                                        className="border-slate-200"
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        placeholder="Contoh: 2020"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                    />
                                    {errors.year && (
                                        <p className="text-sm text-red-600">{errors.year}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="color" className="text-slate-700">Warna</Label>
                                    <Input
                                        id="color"
                                        className="border-slate-200"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="Contoh: Putih"
                                    />
                                    {errors.color && (
                                        <p className="text-sm text-red-600">{errors.color}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-slate-700">Catatan</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Informasi tambahan tentang kendaraan..."
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDelete}
                                    className="border-red-200 text-red-700 hover:bg-red-50 gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus Kendaraan
                                </Button>
                                <div className="flex gap-2">
                                    <Link href="/user/vehicles">
                                        <Button type="button" variant="outline" className="border-slate-200">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
