import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Layers, Folder, Tag, Activity } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ServiceCategoriesIndexProps {
    categories: {
        data: Array<{
            id: number;
            name: string;
            slug: string;
            description: string | null;
            is_active: boolean;
            sort_order: number;
            services_count?: number;
        }>;
        links: Array<any>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Kategori Servis', href: '/admin/service-categories' },
];

export default function ServiceCategoriesIndex({ categories }: ServiceCategoriesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Servis" />

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
                                        Kategori Servis
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Kelola kategori utama untuk mengelompokkan jenis layanan: berkala, ringan, dan berat.
                                    </p>
                                </div>

                                <Link href="/admin/service-categories/create">
                                    <Button className="bg-white text-blue-700 hover:bg-blue-50">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Kategori
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
                                    <Folder className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Kategori</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {categories.data.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2">
                                    <Layers className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Kategori Aktif</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {categories.data.filter(c => c.is_active).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-violet-500 p-2">
                                    <Tag className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Layanan</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {categories.data.reduce((acc, c) => acc + (c.services_count || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-amber-500 p-2">
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Rata-rata Layanan</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {categories.data.length > 0 ? Math.round(categories.data.reduce((acc, c) => acc + (c.services_count || 0), 0) / categories.data.length) : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Table Card */}
                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900">Daftar Kategori Servis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Nama</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Slug</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Deskripsi</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Jumlah Layanan</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Urutan</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.data.map((category) => (
                                        <tr key={category.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-slate-900">{category.name}</td>
                                            <td className="px-4 py-3 text-sm text-slate-500">{category.slug}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{category.description || '-'}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge className="bg-violet-100 text-violet-700 border-violet-200">
                                                    {category.services_count || 0} layanan
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{category.sort_order}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge className={category.is_active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                                                    {category.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={`/admin/service-categories/${category.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                                        <Edit className="mr-1 h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {categories.links && categories.links.length > 3 && (
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                            {categories.links.map((link: any, index: number) => (
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
