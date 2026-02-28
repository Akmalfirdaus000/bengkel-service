import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface ServiceCreateProps {
    categories: Array<{
        id: number;
        name: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Admin', href: '/admin/dashboard' },
    { title: 'Item Servis', href: '/admin/services' },
    { title: 'Tambah Item', href: '/admin/services/create' },
];

export default function ServiceCreate({ categories }: ServiceCreateProps) {
    const formatCurrency = (value: number | string) => {
        const numeric = Number(value);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const { data, setData, post, processing, errors } = useForm({
        service_category_id: categories[0]?.id ? String(categories[0].id) : '',
        name: '',
        slug: '',
        description: '',
        price: '',
        duration: '',
        sort_order: 0,
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/services');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Item Servis" />

            <div className="space-y-6 p-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/services">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tambah Item Servis</h1>
                        <p className="text-muted-foreground">Buat item servis yang akan muncul pada booking user.</p>
                    </div>
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
                                    <Input id="duration" value={data.duration} onChange={(e) => setData('duration', e.target.value)} placeholder="Contoh: 60 menit" />
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
                                    {processing ? 'Menyimpan...' : 'Simpan Item'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
