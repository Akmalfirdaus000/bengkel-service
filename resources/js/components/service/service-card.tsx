import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

interface ServiceCardProps {
    service: {
        id: number;
        name: string;
        description?: string;
        price: number;
        duration?: string;
        category?: {
            name: string;
        };
    };
    onSelect?: (serviceId: number) => void;
    selected?: boolean;
}

export function ServiceCard({ service, onSelect, selected }: ServiceCardProps) {
    const formatCurrency = (amount: number) => {
        return 'Rp ' + amount.toLocaleString('id-ID');
    };

    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
                selected ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect?.(service.id)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Wrench className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            {service.category && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                    {service.category.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-primary">
                            {formatCurrency(service.price)}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                    </p>
                )}
                {service.duration && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {service.duration}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
