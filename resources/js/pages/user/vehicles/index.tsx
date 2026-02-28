import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Car, Activity, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { VehicleCard } from '@/components/vehicle/vehicle-card';
import { cn } from '@/lib/utils';

interface VehiclesIndexProps {
    vehicles: {
        data: Array<{
            id: number;
            brand: string;
            model: string;
            plate_number: string;
            year?: string;
            color?: string;
            is_active: boolean;
        }>;
        links: Array<any>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Kendaraan Saya', href: '/user/vehicles' },
];

export default function VehiclesIndex({ vehicles }: VehiclesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kendaraan Saya" />

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
                                        Kendaraan Saya
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Kelola kendaraan yang terdaftar untuk booking servis.
                                    </p>
                                </div>

                                <Link href="/user/vehicles/create">
                                    <Button className="bg-white text-blue-700 hover:bg-blue-50">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Kendaraan
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="flex gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2">
                                    <Car className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Kendaraan</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {vehicles.data.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2">
                                    <Wrench className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Aktif</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {vehicles.data.filter(v => v.is_active).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vehicles List */}
                {vehicles.data.length > 0 ? (
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                                <Car className="h-5 w-5 text-blue-600" />
                                Daftar Kendaraan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {vehicles.data.map((vehicle) => (
                                    <VehicleCard
                                        key={vehicle.id}
                                        vehicle={vehicle}
                                        showActions
                                        editUrl={`/user/vehicles/${vehicle.id}/edit`}
                                        deleteUrl={`/user/vehicles/${vehicle.id}`}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="rounded-full bg-slate-100 p-6">
                                <Car className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">Belum ada kendaraan</h3>
                            <p className="mt-2 text-sm text-slate-600 text-center max-w-md">
                                Tambahkan kendaraan pertama Anda untuk mulai booking servis.
                            </p>
                            <Link href="/user/vehicles/create" className="mt-6">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kendaraan
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {vehicles.data.length > 0 && vehicles.links && vehicles.links.length > 3 && (
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                                    {vehicles.links.map((link: any, index: number) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={cn(
                                                    'rounded-lg px-3 py-2 text-sm transition',
                                                    link.active
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="rounded-lg px-3 py-2 text-sm text-slate-400"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
