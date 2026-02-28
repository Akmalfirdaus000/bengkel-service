import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { StatusBadge } from '@/components/booking/status-badge';

interface PaymentShowProps {
    booking: {
        id: number;
        final_amount: number;
        status: string;
        payment_status: string;
        payments: Array<{
            id: number;
            payment_method: string;
            amount: number;
            status: string;
            paid_at: string;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'Booking Saya', href: '/user/bookings' },
    { title: 'Pembayaran', href: '#' },
];

export default function PaymentShow({ booking }: PaymentShowProps) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'cash',
        amount: booking.final_amount,
        transaction_id: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/user/payments/${booking.id}/pay`);
    };

    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const paidAmount = booking.payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = booking.final_amount - paidAmount;
    const canPayByStatus = ['ready_to_pickup', 'completed'].includes(booking.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/user/bookings/${booking.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pembayaran Booking #{booking.id}</h1>
                        <p className="text-muted-foreground">Selesaikan pembayaran Anda</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        {booking.payment_status === 'paid' ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-8 w-8"
                                        >
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-xl font-semibold">Pembayaran Selesai</h3>
                                    <p className="text-muted-foreground">
                                        Booking ini telah lunas dibayar.
                                    </p>
                                    <Link href={`/user/bookings/${booking.id}`} className="mt-4">
                                        <Button>Lihat Booking</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : !canPayByStatus ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <h3 className="text-xl font-semibold">Pembayaran Belum Dibuka</h3>
                                    <p className="text-center text-muted-foreground">
                                        Pembayaran dapat dilakukan setelah status booking menjadi <strong>Siap Diambil</strong>.
                                    </p>
                                    <Link href={`/user/bookings/${booking.id}`} className="mt-4">
                                        <Button>Lihat Status Booking</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Buat Pembayaran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="payment_method">Metode Pembayaran *</Label>
                                            <select
                                                id="payment_method"
                                                value={data.payment_method}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                required
                                            >
                                                <option value="cash">Tunai</option>
                                                <option value="transfer">Transfer Bank</option>
                                                <option value="e-wallet">E-Wallet</option>
                                                <option value="card">Kartu Kredit/Debit</option>
                                            </select>
                                            {errors.payment_method && (
                                                <p className="text-sm text-destructive">{errors.payment_method}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Jumlah *</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', parseFloat(e.target.value) || 0)}
                                                min={0}
                                                max={remainingAmount}
                                                step="1"
                                                required
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Sisa: {formatCurrency(remainingAmount)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Nominal bayar: {formatCurrency(data.amount)}
                                            </p>
                                            {errors.amount && (
                                                <p className="text-sm text-destructive">{errors.amount}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="transaction_id">ID Transaksi</Label>
                                            <Input
                                                id="transaction_id"
                                                value={data.transaction_id}
                                                onChange={(e) => setData('transaction_id', e.target.value)}
                                                placeholder="Contoh: TRX123456"
                                            />
                                            {errors.transaction_id && (
                                                <p className="text-sm text-destructive">{errors.transaction_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Catatan</Label>
                                            <textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Catatan tambahan..."
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-24"
                                            />
                                            {errors.notes && (
                                                <p className="text-sm text-destructive">{errors.notes}</p>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-full" disabled={processing || !canPayByStatus}>
                                            {processing ? 'Memproses...' : `Bayar ${formatCurrency(data.amount)}`}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Ringkasan Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Total Tagihan</span>
                                    <span className="font-medium">{formatCurrency(booking.final_amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Sudah Dibayar</span>
                                    <span className="font-medium text-green-600">
                                        {formatCurrency(paidAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-3">
                                    <span>Sisa</span>
                                    <span className="text-primary">{formatCurrency(remainingAmount)}</span>
                                </div>

                                <div className="border-t pt-3">
                                    <p className="text-sm font-medium mb-2">Status Pembayaran</p>
                                    <StatusBadge status={booking.payment_status} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
