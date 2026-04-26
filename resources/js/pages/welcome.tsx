import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Calendar, Shield, Star, Users, Clock, CheckCircle, ArrowRight, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Suja Bengkel Service - Bengkel Mobil Profesional & Terpercaya" />
            <div className="flex min-h-screen flex-col bg-background font-sans">
                {/* Header / Navbar */}
                <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
                    <div className="container flex h-20 items-center justify-between px-4 md:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                <Wrench className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-tight leading-none">SUJA</span>
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Bengkel Service</span>
                            </div>
                        </div>
                        <nav className="hidden items-center gap-8 md:flex">
                            <a href="#services" className="text-sm font-semibold transition-colors hover:text-primary">Layanan</a>
                            <a href="#about" className="text-sm font-semibold transition-colors hover:text-primary">Tentang Kami</a>
                            <a href="#testimonials" className="text-sm font-semibold transition-colors hover:text-primary">Testimoni</a>
                            <div className="h-4 w-[1px] bg-border"></div>
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button className="rounded-full px-6 shadow-md shadow-primary/10">Dashboard</Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login">
                                        <Button variant="ghost" className="rounded-full px-6">Masuk</Button>
                                    </Link>
                                    {canRegister && (
                                        <Link href="/register">
                                            <Button className="rounded-full px-6 shadow-md shadow-primary/10">Daftar</Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </nav>
                        {/* Mobile Menu Button - Placeholder for functionality if needed */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Users className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
                        {/* Hero Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                            <img 
                                src="/images/hero.png" 
                                alt="Modern Workshop" 
                                className="h-full w-full object-cover object-center opacity-40 scale-105 animate-pulse-slow"
                                style={{ animationDuration: '10s' }}
                            />
                        </div>

                        <div className="container relative z-20 px-4 md:px-6">
                            <div className="max-w-[800px] space-y-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                    </span>
                                    Bengkel Mobil Profesional #1
                                </div>
                                <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                                    Perawatan Mobil <br />
                                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Tanpa Khawatir</span>
                                </h1>
                                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl/relaxed">
                                    Nikmati layanan otomotif premium dengan tim mekanik tersertifikasi. 
                                    Kami memberikan transparansi total, harga kompetitif, dan garansi kepuasan pelanggan.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                                    {auth.user ? (
                                        <Link href="/user/bookings/create">
                                            <Button size="lg" className="h-14 rounded-full px-8 text-base font-bold shadow-xl shadow-primary/20">
                                                Booking Servis Sekarang
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/register">
                                                <Button size="lg" className="h-14 rounded-full px-8 text-base font-bold shadow-xl shadow-primary/20">
                                                    Mulai Servis Pertama
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            </Link>
                                            <Link href="#services">
                                                <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-base font-bold backdrop-blur-sm">
                                                    Lihat Layanan Kami
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-8 pt-10">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl font-black text-primary">10+</div>
                                        <div className="text-sm font-semibold leading-tight text-muted-foreground uppercase">Tahun<br/>Pengalaman</div>
                                    </div>
                                    <div className="h-10 w-[1px] bg-border hidden sm:block"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl font-black text-primary">5k+</div>
                                        <div className="text-sm font-semibold leading-tight text-muted-foreground uppercase">Pelanggan<br/>Puas</div>
                                    </div>
                                    <div className="h-10 w-[1px] bg-border hidden sm:block"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl font-black text-primary">15+</div>
                                        <div className="text-sm font-semibold leading-tight text-muted-foreground uppercase">Mekanik<br/>Ahli</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="relative py-24 md:py-32">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Layanan Kami</h2>
                                <h3 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                                    Solusi Lengkap Perawatan Kendaraan
                                </h3>
                                <p className="max-w-[700px] text-lg text-muted-foreground">
                                    Kami menyediakan berbagai layanan teknis profesional untuk memastikan kendaraan Anda selalu dalam kondisi terbaik.
                                </p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        icon: Wrench,
                                        title: 'Perawatan Berkala',
                                        description: 'Ganti oli, filter, dan pengecekan menyeluruh untuk menjaga performa mesin tetap stabil.',
                                        color: 'bg-blue-500/10 text-blue-500'
                                    },
                                    {
                                        icon: Shield,
                                        title: 'Diagnostik Komputer',
                                        description: 'Deteksi dini masalah mesin dengan peralatan scanner terbaru yang akurat dan cepat.',
                                        color: 'bg-green-500/10 text-green-500'
                                    },
                                    {
                                        icon: Calendar,
                                        title: 'Sistem Rem & Kaki-Kaki',
                                        description: 'Perawatan sistem pengereman dan suspensi untuk kenyamanan dan keamanan berkendara.',
                                        color: 'bg-red-500/10 text-red-500'
                                    },
                                    {
                                        icon: Users,
                                        title: 'Servis AC & Kelistrikan',
                                        description: 'Memastikan AC tetap sejuk dan sistem kelistrikan mobil berfungsi normal tanpa kendala.',
                                        color: 'bg-yellow-500/10 text-yellow-500'
                                    },
                                    {
                                        icon: Clock,
                                        title: 'Servis Express',
                                        description: 'Layanan cepat untuk perbaikan ringan bagi Anda yang memiliki jadwal padat.',
                                        color: 'bg-purple-500/10 text-purple-500'
                                    },
                                    {
                                        icon: CheckCircle,
                                        title: 'General Overhaul',
                                        description: 'Perbaikan berat dan turun mesin dengan garansi kualitas pengerjaan terbaik.',
                                        color: 'bg-orange-500/10 text-orange-500'
                                    },
                                ].map((service, index) => (
                                    <Card key={index} className="group relative overflow-hidden border-none bg-muted/30 transition-all hover:bg-muted/50 hover:shadow-2xl hover:shadow-primary/5">
                                        <CardContent className="p-8">
                                            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                                <service.icon className="h-7 w-7" />
                                            </div>
                                            <h4 className="mb-3 text-xl font-bold">{service.title}</h4>
                                            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                                            <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 transition-all group-hover:opacity-100">
                                                Pelajari Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us / About Section */}
                    <section id="about" className="relative overflow-hidden bg-primary py-24 md:py-32">
                        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-1/2" />
                        <div className="container relative z-10 px-4 md:px-6">
                            <div className="grid gap-16 lg:grid-cols-2 items-center">
                                <div className="space-y-8 text-primary-foreground">
                                    <div className="space-y-4">
                                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Mengapa SUJA?</h2>
                                        <h3 className="text-4xl font-black tracking-tight sm:text-5xl">
                                            Komitmen Kami pada <br />
                                            Kualitas & Transparansi
                                        </h3>
                                        <p className="text-lg opacity-90 leading-relaxed">
                                            Sejak 10 tahun lalu, kami percaya bahwa setiap pelanggan berhak mendapatkan layanan terbaik tanpa ada biaya tersembunyi. Mekanik kami bukan hanya pekerja, tapi konsultan otomotif Anda.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            'Mekanik Bersertifikat Internasional',
                                            'Sparepart Original & Bergaransi',
                                            'Estimasi Biaya Transparan di Awal',
                                            'Peralatan Bengkel Modern & Lengkap',
                                            'Update Progress Servis Real-time'
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-lg">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
                                        <img 
                                            src="/images/about.png" 
                                            alt="Mechanic Service" 
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                    </div>
                                    <div className="absolute -bottom-8 -left-8 rounded-3xl bg-background p-8 shadow-2xl hidden md:block border border-border">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-2xl font-black">4.9/5</p>
                                            <p className="text-sm font-semibold text-muted-foreground">Rating Kepuasan Pelanggan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section id="testimonials" className="py-24 md:py-32">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Testimoni</h2>
                                <h3 className="text-3xl font-black tracking-tight sm:text-4xl">Suara Pelanggan Setia Kami</h3>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        name: 'Ahmad Santoso',
                                        role: 'Pemilik Toyota Fortuner',
                                        content: 'Sudah 5 tahun servis rutin di Suja. Mekaniknya jujur banget, kalau masih bagus dibilang bagus, nggak asal suruh ganti.',
                                        rating: 5,
                                        image: 'AS'
                                    },
                                    {
                                        name: 'Sarah Wijaya',
                                        role: 'Pengguna Honda HR-V',
                                        content: 'Paling suka sama sistem bookingnya. Datang langsung dikerjakan, nggak perlu antre lama. Ruang tunggunya juga nyaman.',
                                        rating: 5,
                                        image: 'SW'
                                    },
                                    {
                                        name: 'Budi Pratama',
                                        role: 'Mitra Armada Logistik',
                                        content: 'Partner servis terbaik untuk armada kantor kami. Harga kompetitif dan pengerjaannya sangat teliti.',
                                        rating: 5,
                                        image: 'BP'
                                    },
                                ].map((testimonial, index) => (
                                    <Card key={index} className="border-none bg-muted/20 p-4">
                                        <CardContent className="p-6">
                                            <div className="flex gap-1 mb-6">
                                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="mb-8 text-lg font-medium leading-relaxed italic text-muted-foreground">"{testimonial.content}"</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                                                    {testimonial.image}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{testimonial.name}</p>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="relative overflow-hidden py-24 md:py-32">
                        <div className="container px-4 md:px-6 relative z-10">
                            <div className="flex flex-col items-center gap-8 rounded-[3rem] bg-foreground p-12 text-center text-background md:p-24 shadow-3xl">
                                <h2 className="text-4xl font-black tracking-tight sm:text-6xl max-w-[800px]">
                                    Siap Mengembalikan Performa Mobil Anda?
                                </h2>
                                <p className="max-w-[600px] text-lg opacity-80 md:text-xl">
                                    Booking jadwal servis Anda hari ini dan nikmati kenyamanan berkendara maksimal tanpa rasa khawatir.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Link href="/user/bookings/create">
                                            <Button size="lg" className="h-14 rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground hover:bg-primary/90">
                                                Booking Sekarang
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/register">
                                            <Button size="lg" className="h-14 rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground hover:bg-primary/90">
                                                Daftar Sekarang & Booking
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t bg-muted/10 py-20">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                        <Wrench className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                    <span className="text-xl font-black tracking-tight">SUJA</span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                                    Bengkel mobil profesional yang mengedepankan kualitas, transparansi, dan kepuasan pelanggan di setiap layanan kami.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="icon" className="rounded-full"><Instagram className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="rounded-full"><Facebook className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="rounded-full"><Twitter className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div>
                                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Layanan</h4>
                                <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                                    <li className="hover:text-primary transition-colors cursor-pointer">Perawatan Berkala</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Diagnostik Mesin</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Servis Rem & Kaki-Kaki</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Servis AC & Kelistrikan</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Perusahaan</h4>
                                <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                                    <li className="hover:text-primary transition-colors cursor-pointer">Tentang Kami</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Karier</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Kontak Kami</li>
                                    <li className="hover:text-primary transition-colors cursor-pointer">Kebijakan Privasi</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Kontak Kami</h4>
                                <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-primary shrink-0" />
                                        <span>Jl. Raya Utama No. 88, Jakarta Selatan, Indonesia</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-primary shrink-0" />
                                        <span>(021) 7890-1234</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-primary shrink-0" />
                                        <span>halo@sujabengkel.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-20 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} SUJA Bengkel Service. Hak Cipta Dilindungi.</p>
                            <div className="flex gap-8">
                                <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
                                <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
                                <span className="hover:text-foreground transition-colors cursor-pointer">Cookies</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
