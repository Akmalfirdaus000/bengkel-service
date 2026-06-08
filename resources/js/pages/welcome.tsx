import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Calendar, Shield, Users, ArrowRight, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Gama 2000 Auto Service - Bengkel Mobil Profesional & Terpercaya" />
            <div className="flex min-h-screen flex-col bg-background font-sans">
                {/* Header / Navbar */}
                <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
                    <div className="container flex h-20 items-center justify-between px-4 md:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                <Wrench className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-tight leading-none">GAMA 2000</span>
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Auto Service</span>
                            </div>
                        </div>
                        <nav className="hidden items-center gap-8 md:flex">
                            <a href="#tutorial" className="text-sm font-semibold transition-colors hover:text-primary">Panduan Aplikasi</a>
                            <div className="h-4 w-[1px] bg-border"></div>
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button className="rounded-full px-6 shadow-md shadow-primary/10">Dashboard</Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login">
                                        <Button className="rounded-full px-6 shadow-md shadow-primary/10">Masuk</Button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                        {/* Mobile Menu Button */}
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
                                    Booking Servis <br />
                                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Makin Mudah</span>
                                </h1>
                                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl/relaxed">
                                    Gunakan aplikasi kami untuk menjadwalkan perbaikan dan perawatan mobil Anda. Ikuti panduan mudah dari login hingga proses booking selesai.
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
                                            <Link href="/login">
                                                <Button size="lg" className="h-14 rounded-full px-8 text-base font-bold shadow-xl shadow-primary/20">
                                                    Masuk ke Akun
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            </Link>
                                            <Link href="#tutorial">
                                                <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-base font-bold backdrop-blur-sm">
                                                    Lihat Panduan
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

                    {/* Tutorial Section */}
                    <section id="tutorial" className=" flex justify-center mx-auto  py-24 md:py-32 bg-muted/10">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Cara Penggunaan</h2>
                                <h3 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                                    Panduan Menggunakan Aplikasi
                                </h3>
                                <p className="max-w-[700px] text-lg text-muted-foreground">
                                    Ikuti langkah-langkah sederhana berikut untuk mulai melakukan booking servis kendaraan Anda di bengkel kami.
                                </p>
                            </div>
                            
                            <div className="relative mx-auto max-w-5xl flex justify-center">
                                <div className="w-full">
                                    {/* Connecting line for desktop */}
                                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border hidden md:block -translate-x-1/2"></div>
                                    
                                    <div className="space-y-12 md:space-y-0 relative">
                                        {/* Step 1 */}
                                        <div className="md:grid md:grid-cols-2 items-center md:pb-24 group relative">
                                            {/* Left Side */}
                                            <div className="md:pr-12 mb-8 md:mb-0 text-center md:text-right relative">
                                                <h4 className="text-2xl font-bold mb-3">Login ke Aplikasi</h4>
                                                <p className="text-muted-foreground leading-relaxed text-lg">
                                                    Masuk menggunakan akun customer Anda. Jika Anda pelanggan baru dan belum memiliki akun, silakan hubungi admin atau datang langsung ke bengkel.
                                                </p>
                                            </div>
                                            {/* Center Circle */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10">
                                                1
                                            </div>
                                            {/* Mobile Circle */}
                                            <div className="md:hidden mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10 mb-6">
                                                1
                                            </div>
                                            {/* Right Side */}
                                            <div className="md:pl-12 flex justify-center md:justify-start">
                                                <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden group-hover:shadow-primary/10 transition-all duration-300 w-full max-w-sm">
                                                    <CardContent className="p-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-transparent">
                                                        <Users className="h-24 w-24 text-blue-500/80" />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                        
                                        {/* Step 2 */}
                                        <div className="md:grid md:grid-cols-2 items-center md:pb-24 group relative flex flex-col-reverse md:flex-row">
                                            {/* Left Side */}
                                            <div className="md:pr-12 mt-8 md:mt-0 flex justify-center md:justify-end">
                                                <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden group-hover:shadow-primary/10 transition-all duration-300 w-full max-w-sm">
                                                    <CardContent className="p-8 flex items-center justify-center bg-gradient-to-br from-green-500/10 to-transparent">
                                                        <Shield className="h-24 w-24 text-green-500/80" />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            {/* Center Circle */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10">
                                                2
                                            </div>
                                            {/* Mobile Circle */}
                                            <div className="md:hidden mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10 mb-6">
                                                2
                                            </div>
                                            {/* Right Side */}
                                            <div className="md:pl-12 text-center md:text-left relative z-10">
                                                <h4 className="text-2xl font-bold mb-3">Daftarkan Kendaraan</h4>
                                                <p className="text-muted-foreground leading-relaxed text-lg">
                                                    Masuk ke menu kendaraan di dashboard dan tambahkan profil mobil Anda. Informasi ini membantu mekanik kami menyiapkan penanganan yang tepat.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="md:grid md:grid-cols-2 items-center md:pb-24 group relative">
                                            {/* Left Side */}
                                            <div className="md:pr-12 mb-8 md:mb-0 text-center md:text-right relative">
                                                <h4 className="text-2xl font-bold mb-3">Pilih Layanan Servis</h4>
                                                <p className="text-muted-foreground leading-relaxed text-lg">
                                                    Tentukan jenis keluhan atau perawatan yang Anda butuhkan. Anda bisa memilih dari layanan servis berkala hingga pengecekan khusus.
                                                </p>
                                            </div>
                                            {/* Center Circle */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10">
                                                3
                                            </div>
                                            {/* Mobile Circle */}
                                            <div className="md:hidden mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10 mb-6">
                                                3
                                            </div>
                                            {/* Right Side */}
                                            <div className="md:pl-12 flex justify-center md:justify-start">
                                                <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden group-hover:shadow-primary/10 transition-all duration-300 w-full max-w-sm">
                                                    <CardContent className="p-8 flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-transparent">
                                                        <Wrench className="h-24 w-24 text-orange-500/80" />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                        
                                        {/* Step 4 */}
                                        <div className="md:grid md:grid-cols-2 items-center group relative flex flex-col-reverse md:flex-row">
                                            {/* Left Side */}
                                            <div className="md:pr-12 mt-8 md:mt-0 flex justify-center md:justify-end">
                                                <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden group-hover:shadow-primary/10 transition-all duration-300 w-full max-w-sm">
                                                    <CardContent className="p-8 flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-transparent">
                                                        <Calendar className="h-24 w-24 text-purple-500/80" />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            {/* Center Circle */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10">
                                                4
                                            </div>
                                            {/* Mobile Circle */}
                                            <div className="md:hidden mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-black shadow-xl border-4 border-background z-10 mb-6">
                                                4
                                            </div>
                                            {/* Right Side */}
                                            <div className="md:pl-12 text-center md:text-left relative z-10">
                                                <h4 className="text-2xl font-bold mb-3">Selesaikan Booking</h4>
                                                <p className="text-muted-foreground leading-relaxed text-lg">
                                                    Pilih jadwal yang sesuai dengan waktu luang Anda, konfirmasi detail pesanan, dan silakan datang ke bengkel sesuai jadwal!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                                    <span className="text-xl font-black tracking-tight">GAMA 2000</span>
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
                                        <span>halo@gama2000.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-20 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} Gama 2000 Auto Service. Hak Cipta Dilindungi.</p>
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
