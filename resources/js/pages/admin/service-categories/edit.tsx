import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Trash2, Activity, Edit3 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ServiceCategoryEditProps {
    category: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        sort_order: number;
        is_active: boolean;
    };
}

export default function ServiceCategoryEdit({ category }: ServiceCategoryEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard Admin', href: '/admin/dashboard' },
        { title: 'Kategori Servis', href: '/admin/service-categories' },
        { title: `Edit ${category.name}`, href: `/admin/service-categories/${category.id}/edit` },
    ];

    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        sort_order: category.sort_order,
        is_active: category.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/service-categories/${category.id}`);
    };

    const onDelete = () => {
        if (!window.confirm('Hapus kategori ini?')) return;
        destroy(`/admin/service-categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name}`} />

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
                                    <Link href="/admin/service-categories">
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
                                            Edit Kategori Servis
                                        </h1>
                                        <p className="max-w-2xl text-blue-100">
                                            Perbarui informasi kategori "{category.name}"
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
                            <Edit3 className="h-5 w-5 text-blue-600" />
                            Form Kategori
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

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-slate-700">Slug</Label>
                                <Input
                                    id="slug"
                                    className="border-slate-200"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                />
                                {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-slate-700">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    className="border-slate-200"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort_order" className="text-slate-700">Urutan</Label>
                                <Input
                                    id="sort_order"
                                    className="border-slate-200"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', Number(e.target.value) || 0)}
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                Aktif
                            </label>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                                <Link href="/admin/service-categories">
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
