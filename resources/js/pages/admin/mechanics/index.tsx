import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Phone, Mail, MapPin, Search, Users, Wrench, Activity, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';

interface MechanicsIndexProps {
    mechanics: {
        data: Array<{
            id: number;
            name: string;
            phone: string | null;
            email: string | null;
            specialization: string | null;
            is_available: boolean;
            is_active: boolean;
            bookings_count: number;
        }>;
        links: Array<any>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Mekanik', href: '/admin/mechanics' },
];

export default function MechanicsIndex({ mechanics }: MechanicsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Mekanik" />

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
                                        Kelola Mekanik
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Lihat dan kelola semua data mekanik. Pantau ketersediaan dan performa tim mekanik.
                                    </p>
                                </div>

                                <Link href="/admin/mechanics/create">
                                    <Button className="bg-white text-blue-700 hover:bg-blue-50">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Mekanik
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Mekanik</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {mechanics.data.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Mekanik Aktif</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {mechanics.data.filter(m => m.is_active).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-amber-500 p-2">
                                    <Wrench className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Tersedia</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {mechanics.data.filter(m => m.is_available).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-violet-500 p-2">
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Booking</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {mechanics.data.reduce((acc, m) => acc + (m.bookings_count || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <Card className="border-slate-200 bg-white">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari mekanik..."
                                className="pl-10 border-slate-200"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Mechanics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mechanics.data.map((mechanic) => (
                        <Card key={mechanic.id} className="border-slate-200 bg-white transition-all hover:shadow-lg">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                                            <span className="text-lg font-bold text-white">
                                                {mechanic.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{mechanic.name}</h3>
                                            <div className="flex gap-1 mt-1">
                                                <Badge
                                                    className={mechanic.is_active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}
                                                    variant="outline"
                                                >
                                                    {mechanic.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                                <Badge
                                                    className={mechanic.is_available ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}
                                                    variant="outline"
                                                >
                                                    {mechanic.is_available ? 'Tersedia' : 'Sibuk'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {mechanic.specialization && (
                                    <div className="text-sm">
                                        <span className="text-slate-500">Spesialisasi:</span>
                                        <span className="ml-2 font-semibold text-slate-900">{mechanic.specialization}</span>
                                    </div>
                                )}
                                {mechanic.phone && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-3 w-3" />
                                        {mechanic.phone}
                                    </div>
                                )}
                                {mechanic.email && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="h-3 w-3" />
                                        {mechanic.email}
                                    </div>
                                )}
                                <div className="text-sm pt-2 border-t border-slate-100">
                                    <span className="text-slate-500">Total Booking:</span>
                                    <span className="ml-2 font-semibold text-slate-900">{mechanic.bookings_count || 0}</span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/admin/mechanics/${mechanic.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                                            <Edit className="h-3 w-3" />
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {mechanics.links && mechanics.links.length > 3 && (
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                            {mechanics.links.map((link: any, index: number) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`rounded-lg px-3 py-2 text-sm transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
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
                )}
            </div>
        </AppLayout>
    );
}
