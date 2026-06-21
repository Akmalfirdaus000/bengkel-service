import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusTrackerProps {
    currentStatus: string;
    className?: string;
    onStatusClick?: (status: string) => void;
}

const statusFlow = [
    { status: 'pending', label: 'Menunggu' },
    { status: 'confirmed', label: 'Dikonfirmasi' },
    { status: 'in_progress', label: 'Dalam Proses' },
    { status: 'completed', label: 'Selesai' },
];

const statusOrder = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export function StatusTracker({ currentStatus, className, onStatusClick }: StatusTrackerProps) {
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
                        <button
                            type="button"
                            disabled={!onStatusClick}
                            onClick={() => onStatusClick && onStatusClick(step.status)}
                            className={cn(
                                "flex flex-col items-center",
                                onStatusClick && "cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg p-1"
                            )}
                        >
                            <span
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                                    isCompleted
                                        ? 'bg-green-500 text-white shadow-sm'
                                        : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800',
                                    onStatusClick && !isCompleted && 'hover:bg-neutral-200'
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
                                    'mt-1 text-xs transition-colors',
                                    isCurrent
                                        ? 'font-medium text-neutral-900 dark:text-neutral-100'
                                        : 'text-neutral-500 dark:text-neutral-400',
                                )}
                            >
                                {step.label}
                            </span>
                        </button>
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
