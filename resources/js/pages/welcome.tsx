import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Calendar, Shield, Star, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Suja Bengkel Service - Bengkel Mobil Profesional" />
            <div className="flex min-h-screen flex-col">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                <Wrench className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">Suja Bengkel</span>
                        </div>
                        <nav className="flex items-center gap-6">
                            <a href="#services" className="text-sm font-medium hover:text-primary">
                                Layanan
                            </a>
                            <a href="#about" className="text-sm font-medium hover:text-primary">
                                Tentang
                            </a>
                            <a href="#testimonials" className="text-sm font-medium hover:text-primary">
                                Testimoni
                            </a>
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button>Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost">Masuk</Button>
                                    </Link>
                                    {canRegister && (
                                        <Link href="/register">
                                            <Button>Daftar</Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
                    <div className="container">
                        <div className="grid gap-8 md:grid-cols-2 lg:gap-16 items-center">
                            <div className="space-y-6">
                                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm">
                                    Bengkel Mobil Profesional Terpercaya
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                    Perawatan Mobil
                                    <span className="text-primary"> Terpercaya</span>
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Nikmati layanan otomotif terbaik dengan tim mekanik bersertifikat kami.
                                    Dari perawatan berkala hingga perbaikan kompleks, kami siap membantu.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Link href="/user/bookings/create">
                                            <Button size="lg" className="gap-2">
                                                Booking Servis
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/register">
                                                <Button size="lg" className="gap-2">
                                                    Booking Servis Sekarang
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href="#services">
                                                <Button size="lg" variant="outline">
                                                    Lihat Layanan
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-8 pt-4">
                                    <div>
                                        <div className="text-3xl font-bold">10+</div>
                                        <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">5000+</div>
                                        <div className="text-sm text-muted-foreground">Pelanggan Puas</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">15+</div>
                                        <div className="text-sm text-muted-foreground">Mekanik Ahli</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                                    <div className="flex h-full items-center justify-center">
                                        <Wrench className="h-48 w-48 text-primary/20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-20">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Layanan Kami
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Layanan perawatan mobil komprehensif untuk menjaga kendaraan Anda tetap prima
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Wrench,
                                    title: 'Perawatan Berkala',
                                    description: 'Ganti oli berkala, penggantian filter, dan pengecekan cairan untuk menjaga performa optimal.',
                                },
                                {
                                    icon: Shield,
                                    title: 'Diagnostik Mesin',
                                    description: 'Alat diagnostik canggih untuk mengidentifikasi dan memperbaiki masalah mesin dengan cepat dan akurat.',
                                },
                                {
                                    icon: Calendar,
                                    title: 'Servis Rem',
                                    description: 'Pemeriksaan, perbaikan, dan penggantian rem lengkap untuk keselamatan berkendara Anda.',
                                },
                                {
                                    icon: Users,
                                    title: 'Servis AC',
                                    description: 'Pengecekan sistem AC, perbaikan, dan pengisian refrigeran.',
                                },
                                {
                                    icon: Clock,
                                    title: 'Servis Cepat',
                                    description: 'Layanan cepat dan efisien untuk perbaikan ringan dan perawatan rutin.',
                                },
                                {
                                    icon: CheckCircle,
                                    title: 'Perbaikan Umum',
                                    description: 'Layanan perbaikan komprehensif untuk semua merek dan model kendaraan.',
                                },
                            ].map((service, index) => (
                                <Card key={index} className="transition-all hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <service.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                                        <p className="text-muted-foreground">{service.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section id="about" className="bg-muted/50 py-20">
                    <div className="container">
                        <div className="grid gap-12 lg:grid-cols-2">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                                    Mengapa Memilih Suja Bengkel?
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Kami berkomitmen memberikan layanan otomotif terbaik dengan transparan,
                                    integritas, dan keahlian. Tim mekanik bersertifikat kami menggunakan peralatan
                                    terkini untuk menghasilkan kualitas terbaik.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        'Mekanik bersertifikat dan berpengalaman',
                                        'Harga transparan tanpa biaya tersembunyi',
                                        'Suku cadang dan material berkualitas',
                                        'Peralatan diagnostik modern',
                                        'Waktu pengerjaan cepat',
                                        'Pelayanan pelanggan prima',
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                                <CheckCircle className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                            <span className="font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {[
                                    { label: 'Tahun Pengalaman', value: '10+' },
                                    { label: 'Mekanik Ahli', value: '15+' },
                                    { label: 'Pelanggan Puas', value: '5000+' },
                                    { label: 'Jenis Layanan', value: '50+' },
                                ].map((stat, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6 text-center">
                                            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-20">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Kata Pelanggan Kami
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Jangan hanya percaya kata kami - dengar dari pelanggan puas kami
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                {
                                    name: 'Ahmad Santoso',
                                    role: 'Pengusaha',
                                    content: 'Pelayanan sangat bagus! Timnya profesional dan harganya wajar. Mobil saya terasa seperti baru.',
                                    rating: 5,
                                },
                                {
                                    name: 'Sarah Wijaya',
                                    role: 'Guru',
                                    content: 'Saya selalu servis mobil di sini. Sistem bookingnya sangat mudah dan mekaniknya terampil.',
                                    rating: 5,
                                },
                                {
                                    name: 'Budi Pratama',
                                    role: 'Sopir',
                                    content: 'Servis cepat dengan harga transparan. Mereka mendiagnosa masalah dengan cepat dan memperbaikinya hari itu juga.',
                                    rating: 5,
                                },
                            ].map((testimonial, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-1 mb-4">
                                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="mb-4 text-muted-foreground">"{testimonial.content}"</p>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary py-16 text-primary-foreground">
                    <div className="container text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                            Siap Melayani Mobil Anda?
                        </h2>
                        <p className="text-lg mb-8 text-primary-foreground/90">
                            Booking jadwal Anda hari ini dan rasakan perbedaannya
                        </p>
                        {auth.user ? (
                            <Link href="/user/bookings/create">
                                <Button size="lg" variant="secondary" className="gap-2">
                                    Booking Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="gap-2">
                                    Mulai Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t py-12">
                    <div className="container">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                        <Wrench className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                    <span className="font-bold">Suja Bengkel</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Bengkel mobil profesional yang berkomitmen pada kualitas dan kepuasan pelanggan.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Layanan</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>Perawatan Berkala</li>
                                    <li>Diagnostik Mesin</li>
                                    <li>Servis Rem</li>
                                    <li>Servis AC</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Perusahaan</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>Tentang Kami</li>
                                    <li>Tim Kami</li>
                                    <li>Karir</li>
                                    <li>Kontak</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Kontak</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>Jl. Raya Utama No. 123</li>
                                    <li>Jakarta, Indonesia</li>
                                    <li>Telepon: (021) 1234-5678</li>
                                    <li>Email: info@sujabengkel.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} Suja Bengkel Service. Hak Cipta Dilindungi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
