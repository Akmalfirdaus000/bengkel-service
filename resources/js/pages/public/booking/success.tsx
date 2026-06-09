import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function BookingSuccess() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title="Booking Berhasil - Gama 2000 Auto Service" />

            <Card className="max-w-md w-full border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 h-32 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center absolute -bottom-10 shadow-lg">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                </div>
                
                <CardContent className="pt-16 pb-8 px-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Berhasil!</h1>
                    
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-medium mb-6">
                        Tim Admin Gama 2000 Auto Service akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi jadwal dan perkiraan biaya.
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-8">
                        Mohon pastikan nomor WhatsApp yang Anda masukkan aktif agar kami dapat segera memproses pesanan Anda.
                    </p>

                    <Link href="/">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full" size="lg">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
