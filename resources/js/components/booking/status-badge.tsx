import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
    pending: { label: 'Menunggu', variant: 'outline', color: 'bg-yellow-500' },
    confirmed: { label: 'Dikonfirmasi', variant: 'outline', color: 'bg-blue-500' },
    assigned: { label: 'Ditugaskan', variant: 'outline', color: 'bg-purple-500' },
    in_progress: { label: 'Dalam Proses', variant: 'outline', color: 'bg-orange-500' },
    ready_to_pickup: { label: 'Siap Diambil', variant: 'outline', color: 'bg-cyan-500' },
    completed: { label: 'Selesai', variant: 'outline', color: 'bg-green-500' },
    cancelled: { label: 'Dibatalkan', variant: 'destructive', color: 'bg-red-500' },
    unpaid: { label: 'Belum Bayar', variant: 'outline', color: 'bg-red-500' },
    partial: { label: 'Sebagian', variant: 'outline', color: 'bg-yellow-500' },
    paid: { label: 'Lunas', variant: 'outline', color: 'bg-green-500' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, variant: 'outline' as const, color: 'bg-gray-500' };

    return (
        <Badge variant={config.variant} className={cn('flex items-center gap-1.5', className)}>
            <span className={cn('h-2 w-2 rounded-full', config.color)} />
            {config.label}
        </Badge>
    );
}
