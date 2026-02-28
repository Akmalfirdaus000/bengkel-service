import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    Car,
    CreditCard,
    Wrench,
    Users,
    Settings,
    FileText,
    TrendingUp,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { useMemo } from 'react';

interface PageProps {
    auth?: {
        user?: {
            role?: string;
        };
    };
}

// Admin navigation items
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Booking',
        href: '/admin/bookings',
        icon: Calendar,
    },
    {
        title: 'Riwayat Booking',
        href: '/admin/bookings/history',
        icon: FileText,
    },
    {
        title: 'Servis',
        href: '/admin/services',
        icon: Wrench,
    },
    {
        title: 'Kategori Servis',
        href: '/admin/service-categories',
        icon: FileText,
    },
    {
        title: 'Mekanik',
        href: '/admin/mechanics',
        icon: Users,
    },
    {
        title: 'Laporan',
        href: '/admin/reports',
        icon: TrendingUp,
    },
];

// User navigation items
const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Booking Saya',
        href: '/user/bookings',
        icon: Calendar,
    },
    {
        title: 'Riwayat Servis',
        href: '/user/bookings/history',
        icon: FileText,
    },
    {
        title: 'Kendaraan',
        href: '/user/vehicles',
        icon: Car,
    },
    {
        title: 'Pembayaran',
        href: '/user/bookings',
        icon: CreditCard,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Bantuan',
        href: '#',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as PageProps;

    // Get navigation items based on user role
    const navItems = useMemo(() => {
        if (auth?.user?.role === 'admin') {
            return adminNavItems;
        }
        return userNavItems;
    }, [auth?.user?.role]);

    const dashboardUrl = auth?.user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
