import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Trash2, Edit } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface VehicleCardProps {
    vehicle: {
        id: number;
        brand: string;
        model: string;
        plate_number: string;
        year?: string;
        color?: string;
        is_active: boolean;
    };
    showActions?: boolean;
    deleteUrl?: string;
    editUrl?: string;
}

export function VehicleCard({ vehicle, showActions = false, deleteUrl, editUrl }: VehicleCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Car className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                {vehicle.brand} {vehicle.model}
                            </h3>
                            <Badge variant="outline" className="mt-1">
                                {vehicle.plate_number}
                            </Badge>
                        </div>
                    </div>
                    {showActions && (
                        <div className="flex gap-2">
                            {editUrl && (
                                <Link href={editUrl}>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                            )}
                            {deleteUrl && (
                                <Button variant="ghost" size="icon" onClick={() => window.location.href = deleteUrl}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {vehicle.year && (
                        <div>
                            <span className="text-muted-foreground">Year:</span>
                            <span className="ml-2 font-medium">{vehicle.year}</span>
                        </div>
                    )}
                    {vehicle.color && (
                        <div>
                            <span className="text-muted-foreground">Color:</span>
                            <span className="ml-2 font-medium">{vehicle.color}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
