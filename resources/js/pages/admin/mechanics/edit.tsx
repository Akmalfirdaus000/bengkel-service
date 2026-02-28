import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Trash2, Activity, UserCog } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface MechanicEditProps {
    mechanic: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        specialization: string | null;
        notes: string | null;
        is_available: boolean;
        is_active: boolean;
    };
}

export default function MechanicEdit({ mechanic }: MechanicEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard Admin', href: '/admin/dashboard' },
        { title: 'Mekanik', href: '/admin/mechanics' },
        { title: `Edit ${mechanic.name}`, href: `/admin/mechanics/${mechanic.id}/edit` },
    ];

    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: mechanic.name,
        phone: mechanic.phone || '',
        email: mechanic.email || '',
        address: mechanic.address || '',
        specialization: mechanic.specialization || '',
        notes: mechanic.notes || '',
        is_available: mechanic.is_available,
        is_active: mechanic.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/mechanics/${mechanic.id}`);
    };

    const onDelete = () => {
        if (!window.confirm('Hapus mekanik ini?')) return;
        destroy(`/admin/mechanics/${mechanic.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${mechanic.name}`} />

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
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link href="/admin/mechanics">
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
                                            Edit Mekanik
                                        </h1>
                                        <p className="max-w-2xl text-blue-100">
                                            Perbarui data mekanik "{mechanic.name}"
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={onDelete} disabled={processing} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <UserCog className="h-5 w-5 text-blue-600" />
                            Form Mekanik
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700">Nama</Label>
                                <Input
                                    id="name"
                                    className="border-slate-200"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-slate-700">Telepon</Label>
                                    <Input
                                        id="phone"
                                        className="border-slate-200"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="border-slate-200"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialization" className="text-slate-700">Spesialisasi</Label>
                                <Input
                                    id="specialization"
                                    className="border-slate-200"
                                    value={data.specialization}
                                    onChange={(e) => setData('specialization', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-slate-700">Alamat</Label>
                                <Textarea
                                    id="address"
                                    className="border-slate-200"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-slate-700">Catatan</Label>
                                <Textarea
                                    id="notes"
                                    className="border-slate-200"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-6 text-sm text-slate-700">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    Aktif
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300"
                                        checked={data.is_available}
                                        onChange={(e) => setData('is_available', e.target.checked)}
                                    />
                                    Tersedia
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                                <Link href="/admin/mechanics">
                                    <Button type="button" variant="outline" className="border-slate-200">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
