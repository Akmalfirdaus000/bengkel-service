import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Layers,
    Wrench,
    Tag,
    Activity,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useMemo, useState } from 'react';

interface ServicesIndexProps {
    services: {
        data: Array<{
            id: number;
            name: string;
            slug: string;
            description: string | null;
            price: number | string;
            duration: string | null;
            is_active: boolean;
            sort_order: number;
            service_category_id: number;
            category: {
                id: number;
                name: string;
            };
            sub_items: Array<{
                id: number;
                name: string;
                slug: string;
                description: string | null;
                additional_price: number | string;
                is_active: boolean;
                sort_order: number;
            }>;
        }>;
        links: Array<any>;
    };
    categories: Array<{
        id: number;
        name: string;
    }>;
    filters: {
        search?: string;
        category?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Item Servis', href: '/admin/services' },
];

const toNumber = (value: number | string | null | undefined) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (value: number | string) => {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(toNumber(value))}`;
};

export default function ServicesIndex({ services, categories, filters }: ServicesIndexProps) {
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [subItemDialogOpen, setSubItemDialogOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
    const [editingSubItemId, setEditingSubItemId] = useState<number | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(services.data[0]?.id ?? null);

    const itemForm = useForm({
        service_category_id: categories[0] ? String(categories[0].id) : '',
        name: '',
        slug: '',
        description: '',
        price: '',
        duration: '',
        sort_order: '0',
        is_active: true,
    });

    const subItemForm = useForm({
        name: '',
        slug: '',
        description: '',
        additional_price: '0',
        sort_order: '0',
        is_active: true,
    });

    const selectedService = useMemo(
        () => services.data.find((service) => service.id === selectedServiceId) ?? null,
        [services.data, selectedServiceId],
    );

    const openCreateItemDialog = () => {
        setEditingServiceId(null);
        itemForm.setData({
            service_category_id: categories[0] ? String(categories[0].id) : '',
            name: '',
            slug: '',
            description: '',
            price: '',
            duration: '',
            sort_order: '0',
            is_active: true,
        });
        setItemDialogOpen(true);
    };

    const openEditItemDialog = (serviceId: number) => {
        const service = services.data.find((item) => item.id === serviceId);
        if (!service) return;

        setEditingServiceId(service.id);
        itemForm.setData({
            service_category_id: String(service.service_category_id),
            name: service.name,
            slug: service.slug,
            description: service.description || '',
            price: String(service.price),
            duration: service.duration || '',
            sort_order: String(service.sort_order),
            is_active: service.is_active,
        });
        setItemDialogOpen(true);
    };

    const submitItem = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingServiceId) {
            itemForm.put(`/admin/services/${editingServiceId}`, {
                onSuccess: () => setItemDialogOpen(false),
            });
            return;
        }

        itemForm.post('/admin/services', {
            onSuccess: () => setItemDialogOpen(false),
        });
    };

    const removeItem = (serviceId: number) => {
        if (!window.confirm('Hapus item servis ini?')) return;
        router.delete(`/admin/services/${serviceId}`);
    };

    const openCreateSubItemDialog = (serviceId: number) => {
        setSelectedServiceId(serviceId);
        setEditingSubItemId(null);
        subItemForm.setData({
            name: '',
            slug: '',
            description: '',
            additional_price: '0',
            sort_order: '0',
            is_active: true,
        });
        setSubItemDialogOpen(true);
    };

    const openEditSubItemDialog = (serviceId: number, subItemId: number) => {
        const service = services.data.find((item) => item.id === serviceId);
        const subItem = service?.sub_items.find((item) => item.id === subItemId);
        if (!service || !subItem) return;

        setSelectedServiceId(serviceId);
        setEditingSubItemId(subItemId);
        subItemForm.setData({
            name: subItem.name,
            slug: subItem.slug,
            description: subItem.description || '',
            additional_price: String(subItem.additional_price),
            sort_order: String(subItem.sort_order),
            is_active: subItem.is_active,
        });
        setSubItemDialogOpen(true);
    };

    const submitSubItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedServiceId) return;

        if (editingSubItemId) {
            subItemForm.put(`/admin/services/${selectedServiceId}/sub-items/${editingSubItemId}`, {
                onSuccess: () => setSubItemDialogOpen(false),
            });
            return;
        }

        subItemForm.post(`/admin/services/${selectedServiceId}/sub-items`, {
            onSuccess: () => setSubItemDialogOpen(false),
        });
    };

    const removeSubItem = (serviceId: number, subItemId: number) => {
        if (!window.confirm('Hapus sub item ini?')) return;
        router.delete(`/admin/services/${serviceId}/sub-items/${subItemId}`);
    };

    const applySearch = (value: string) => {
        const params = new URLSearchParams();
        if (value.trim()) params.set('search', value.trim());
        if (filters.category) params.set('category', filters.category);
        window.location.href = `/admin/services?${params.toString()}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item & Sub Item Servis" />

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
                                        Item & Sub Item Servis
                                    </h1>
                                    <p className="max-w-2xl text-blue-100">
                                        Kelola item servis dan variannya dalam satu halaman. Atur harga, durasi, dan kategori dengan mudah.
                                    </p>
                                </div>

                                <Button onClick={openCreateItemDialog} className="bg-white text-blue-700 hover:bg-blue-50">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Item Servis
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2">
                                    <Layers className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Item</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {services.data.length}
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
                                        <p className="truncate text-xs font-medium text-slate-600">Item Aktif</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {services.data.filter(s => s.is_active).length}
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
                                        <p className="truncate text-xs font-medium text-slate-600">Kategori</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {categories.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded-lg bg-amber-500 p-2">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-xs font-medium text-slate-600">Total Sub Item</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {services.data.reduce((acc, s) => acc + s.sub_items.length, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search and Filter Card */}
                <Card className="border-slate-200 bg-white">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    className="pl-10 border-slate-200"
                                    placeholder="Cari item servis..."
                                    defaultValue={filters.search || ''}
                                    onKeyDown={(e) => {
                                        if (e.key !== 'Enter') return;
                                        e.preventDefault();
                                        applySearch((e.currentTarget as HTMLInputElement).value);
                                    }}
                                />
                            </div>
                            <select
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.category || 'all'}
                                onChange={(e) => {
                                    const params = new URLSearchParams();
                                    if (filters.search) params.set('search', filters.search);
                                    if (e.target.value !== 'all') params.set('category', e.target.value);
                                    window.location.href = `/admin/services?${params.toString()}`;
                                }}
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900">Daftar Item Servis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {services.data.length === 0 ? (
                            <div className="px-4 py-10 text-center text-sm text-slate-500">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <Layers className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="mt-3 font-medium text-slate-900">Tidak ada item servis</p>
                                    <p className="mt-1 text-xs text-slate-500">Belum ada item servis yang terdaftar</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px]">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Item Servis</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Kategori</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Harga Dasar</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Durasi</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Sub Item</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.data.map((service) => (
                                            <tr key={service.id} className="border-b border-slate-100 align-top hover:bg-blue-50/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-slate-900">{service.name}</p>
                                                    <p className="text-xs text-slate-500">{service.slug}</p>
                                                    {service.description && (
                                                        <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                                                            {service.description}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">{service.category.name}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-slate-900">
                                                    {formatCurrency(service.price)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {service.duration || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            <Badge className="bg-violet-100 text-violet-700 border-violet-200">
                                                                {service.sub_items.length} sub item
                                                            </Badge>
                                                            {service.sub_items.slice(0, 2).map((subItem) => (
                                                                <Badge key={subItem.id} variant="outline" className="text-xs">
                                                                    {subItem.name}
                                                                </Badge>
                                                            ))}
                                                            {service.sub_items.length > 2 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{service.sub_items.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button type="button" size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => openCreateSubItemDialog(service.id)}>
                                                            <Plus className="mr-1 h-3 w-3" />
                                                            Kelola Sub Item
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <Badge className={service.is_active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                                                        {service.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button type="button" variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => openEditItemDialog(service.id)}>
                                                            <Pencil className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => removeItem(service.id)}>
                                                            <Trash2 className="mr-1 h-3 w-3" />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {services.links && services.links.length > 0 && (
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                            {services.links.map((link: any, index: number) => (
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

            <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden p-0">
                    <DialogHeader>
                        <DialogTitle className="px-6 pt-6">{editingServiceId ? 'Edit Item Servis' : 'Tambah Item Servis'}</DialogTitle>
                        <DialogDescription>
                            <span className="block px-6">Isi data item servis utama. Sub item dapat dikelola setelah item dibuat.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitItem} className="max-h-[calc(85vh-110px)] space-y-4 overflow-y-auto px-6 pb-6">
                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select
                                value={itemForm.data.service_category_id}
                                onValueChange={(value) => itemForm.setData('service_category_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nama</Label>
                                <Input value={itemForm.data.name} onChange={(e) => itemForm.setData('name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={itemForm.data.slug} onChange={(e) => itemForm.setData('slug', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Deskripsi</Label>
                            <Textarea value={itemForm.data.description} onChange={(e) => itemForm.setData('description', e.target.value)} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Harga Dasar</Label>
                                <Input type="number" min="0" value={itemForm.data.price} onChange={(e) => itemForm.setData('price', e.target.value)} />
                                <p className="text-xs text-muted-foreground">Preview: {formatCurrency(itemForm.data.price)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Durasi</Label>
                                <Input value={itemForm.data.duration} onChange={(e) => itemForm.setData('duration', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Urutan</Label>
                                <Input type="number" value={itemForm.data.sort_order} onChange={(e) => itemForm.setData('sort_order', e.target.value)} />
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={itemForm.data.is_active} onChange={(e) => itemForm.setData('is_active', e.target.checked)} />
                            Aktif
                        </label>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={itemForm.processing}>
                                {editingServiceId ? 'Simpan Perubahan' : 'Simpan Item'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={subItemDialogOpen} onOpenChange={setSubItemDialogOpen}>
                <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden p-0">
                    <DialogHeader>
                        <DialogTitle className="px-6 pt-6">{editingSubItemId ? 'Edit Sub Item' : 'Tambah Sub Item'}</DialogTitle>
                        <DialogDescription>
                            <span className="block px-6">Pilih item servis lalu isi detail sub item/varian.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitSubItem} className="max-h-[calc(85vh-110px)] space-y-4 overflow-y-auto px-6 pb-6">
                        <div className="space-y-2">
                            <Label>Item Servis</Label>
                            <Select
                                value={selectedServiceId ? String(selectedServiceId) : ''}
                                onValueChange={(value) => setSelectedServiceId(Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih item servis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.data.map((service) => (
                                        <SelectItem key={service.id} value={String(service.id)}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedService && (
                            <p className="text-xs text-muted-foreground">Sub item untuk: {selectedService.name}</p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nama</Label>
                                <Input value={subItemForm.data.name} onChange={(e) => subItemForm.setData('name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={subItemForm.data.slug} onChange={(e) => subItemForm.setData('slug', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Deskripsi</Label>
                            <Textarea value={subItemForm.data.description} onChange={(e) => subItemForm.setData('description', e.target.value)} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Harga Tambahan</Label>
                                <Input type="number" min="0" value={subItemForm.data.additional_price} onChange={(e) => subItemForm.setData('additional_price', e.target.value)} />
                                <p className="text-xs text-muted-foreground">Preview: {formatCurrency(subItemForm.data.additional_price)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Urutan</Label>
                                <Input type="number" value={subItemForm.data.sort_order} onChange={(e) => subItemForm.setData('sort_order', e.target.value)} />
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={subItemForm.data.is_active} onChange={(e) => subItemForm.setData('is_active', e.target.checked)} />
                            Aktif
                        </label>

                        {selectedService && (
                            <div className="rounded-lg border bg-muted/20 p-3">
                                <p className="mb-2 text-sm font-medium">Daftar Sub Item Saat Ini</p>
                                {selectedService.sub_items.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">Belum ada sub item.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedService.sub_items.map((subItem) => (
                                            <div
                                                key={subItem.id}
                                                className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{subItem.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatCurrency(subItem.additional_price)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditSubItemDialog(selectedService.id, subItem.id)}
                                                    >
                                                        <Pencil className="mr-1 h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeSubItem(selectedService.id, subItem.id)}
                                                    >
                                                        <Trash2 className="mr-1 h-3 w-3" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={subItemForm.processing || !selectedServiceId}>
                                {editingSubItemId ? 'Simpan Perubahan' : 'Simpan Sub Item'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
