import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ServiceEditProps {
    service: {
        id: number;
        service_category_id: number;
        name: string;
        slug: string;
        description: string | null;
        price: number | string;
        duration: string | null;
        sort_order: number;
        is_active: boolean;
    };
    categories: Array<{
        id: number;
        name: string;
    }>;
}

export default function ServiceEdit({ service, categories }: ServiceEditProps) {
    const formatCurrency = (value: number | string) => {
        const numeric = Number(value);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard Admin', href: '/admin/dashboard' },
        { title: 'Item Servis', href: '/admin/services' },
        { title: `Edit ${service.name}`, href: `/admin/services/${service.id}/edit` },
    ];

    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        service_category_id: String(service.service_category_id),
        name: service.name,
        slug: service.slug,
        description: service.description || '',
        price: String(service.price),
        duration: service.duration || '',
        sort_order: service.sort_order,
        is_active: service.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
    };

    const onDelete = () => {
        if (!window.confirm('Hapus item servis ini?')) return;
        destroy(`/admin/services/${service.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.name}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/services">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Item Servis</h1>
                            <p className="text-muted-foreground">Perbarui data item servis sesuai master database.</p>
                        </div>
                    </div>
                    <Button variant="destructive" onClick={onDelete} disabled={processing}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Item Servis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select value={data.service_category_id} onValueChange={(value) => setData('service_category_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_category_id && <p className="text-sm text-red-600">{errors.service_category_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                                {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga Dasar</Label>
                                    <Input id="price" type="number" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                    <p className="text-xs text-muted-foreground">Preview: {formatCurrency(data.price)}</p>
                                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Durasi</Label>
                                    <Input id="duration" value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Urutan</Label>
                                    <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value) || 0)} />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                Aktif
                            </label>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
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
