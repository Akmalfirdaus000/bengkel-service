import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Car, MoreVertical } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { Link } from '@inertiajs/react';
import { QuickActions } from './quick-actions';

interface BookingCardProps {
    booking: {
        id: number;
        queue_number?: string | null;
        booking_date: string;
        estimated_start_time?: string | null;
        estimated_end_time?: string | null;
        status: string;
        payment_status: string;
        final_amount: number | string;
        vehicle: {
            brand: string;
            model: string;
            plate_number: string;
        };
        services?: Array<{ name: string }>;
    };
    showLink?: boolean;
}

export function BookingCard({ booking, showLink = true }: BookingCardProps) {
    const formatCurrency = (amount: number | string) => {
        const numeric = Number(amount);
        const safeAmount = Number.isFinite(numeric) ? numeric : 0;
        return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(safeAmount)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const canEdit = ['pending', 'confirmed'].includes(booking.status);
    const canCancel = ['pending', 'confirmed'].includes(booking.status);

    const card = (
        <Card className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
                {/* Queue Number Display */}
                {booking.queue_number && (
                    <div className="flex items-center justify-between mb-3 pb-3 border-b">
                        <div>
                            <p className="text-xs text-gray-500">No. Antrian</p>
                            <p className="text-2xl font-bold">{booking.queue_number}</p>
                        </div>
                        {booking.estimated_start_time && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Estimasi</p>
                                <p className="text-sm font-semibold flex items-center gap-1 justify-end">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(booking.estimated_start_time)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Car className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-lg">
                                    {booking.vehicle.brand} {booking.vehicle.model}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {booking.vehicle.plate_number}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(booking.booking_date)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={booking.status} />
                        <QuickActions
                            bookingId={booking.id}
                            status={booking.status}
                            paymentStatus={booking.payment_status}
                            canEdit={canEdit}
                            canCancel={canCancel}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {booking.services && booking.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {booking.services.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {service.name}
                            </Badge>
                        ))}
                        {booking.services.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                                +{booking.services.length - 2}
                            </Badge>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                        {formatCurrency(booking.final_amount)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <StatusBadge status={booking.payment_status} />
                    {booking.status === 'confirmed' && (
                        <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Menunggu jadwal
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    if (showLink && booking.status !== 'cancelled') {
        return <Link href={booking.status === 'cancelled' ? '#' : `/user/bookings/${booking.id}`}>{card}</Link>;
    }

    return card;
}
