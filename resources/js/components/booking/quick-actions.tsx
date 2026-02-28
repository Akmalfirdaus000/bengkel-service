import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Pencil, Trash2, Calendar, CreditCard, Share2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface QuickActionsProps {
    bookingId: number;
    status: string;
    paymentStatus: string;
    canEdit: boolean;
    canCancel: boolean;
}

export function QuickActions({
    bookingId,
    status,
    paymentStatus,
    canEdit,
    canCancel,
}: QuickActionsProps) {
    const handleCancel = () => {
        if (confirm('Batalkan booking ini?')) {
            // Handle cancellation
            window.location.href = `/user/bookings/${bookingId}/cancel`;
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'Booking Servis',
                url: url,
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link booking disalin ke clipboard!');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link href={`/user/bookings/${bookingId}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                    </Link>
                </DropdownMenuItem>

                {canEdit && (
                    <DropdownMenuItem asChild>
                        <Link href={`/user/bookings/${bookingId}/edit`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Ubah Jadwal
                        </Link>
                    </DropdownMenuItem>
                )}

                {paymentStatus !== 'paid' && status !== 'cancelled' && (
                    <DropdownMenuItem asChild>
                        <Link href={`/user/payments/${bookingId}`}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Bayar Sekarang
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan Booking
                </DropdownMenuItem>

                {canCancel && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleCancel}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Batalkan Booking
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
