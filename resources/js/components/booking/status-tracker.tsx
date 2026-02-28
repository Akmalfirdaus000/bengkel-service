import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusTrackerProps {
    currentStatus: string;
    className?: string;
}

const statusFlow = [
    { status: 'pending', label: 'Menunggu' },
    { status: 'confirmed', label: 'Dikonfirmasi' },
    { status: 'assigned', label: 'Ditugaskan' },
    { status: 'in_progress', label: 'Dalam Proses' },
    { status: 'ready_to_pickup', label: 'Siap Diambil' },
    { status: 'completed', label: 'Selesai' },
];

const statusOrder = ['pending', 'confirmed', 'assigned', 'in_progress', 'ready_to_pickup', 'completed', 'cancelled'];

export function StatusTracker({ currentStatus, className }: StatusTrackerProps) {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const isCancelled = currentStatus === 'cancelled';

    if (isCancelled) {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20">
                    <X className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Booking Dibatalkan</span>
            </div>
        );
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {statusFlow.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div key={step.status} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium',
                                    isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800',
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </span>
                            <span
                                className={cn(
                                    'mt-1 text-xs',
                                    isCurrent
                                        ? 'font-medium text-neutral-900 dark:text-neutral-100'
                                        : 'text-neutral-500 dark:text-neutral-400',
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < statusFlow.length - 1 && (
                            <div
                                className={cn(
                                    'mx-2 h-0.5 w-8',
                                    index < currentIndex ? 'bg-green-500' : 'bg-neutral-200 dark:bg-neutral-700',
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
