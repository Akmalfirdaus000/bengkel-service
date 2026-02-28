import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Clock, Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration?: string;
    category: {
        name: string;
    };
}

interface SelectedService {
    service: Service;
    quantity: number;
    oilType?: 'synthetic' | 'semi-synthetic' | 'mineral';
}

interface ServiceSelectorProps {
    services: Service[];
    selectedServices: SelectedService[];
    onAdd: (serviceId: number, oilType?: 'synthetic' | 'semi-synthetic' | 'mineral') => void;
    onRemove: (serviceId: number) => void;
    onUpdateQuantity: (serviceId: number, quantity: number) => void;
    onUpdateOilType: (serviceId: number, oilType: 'synthetic' | 'semi-synthetic' | 'mineral') => void;
}

const oilTypes = [
    { value: 'synthetic', label: 'Oli Sintetik', priceModifier: 150000, description: 'Perlindungan maksimal, performa tinggi' },
    { value: 'semi-synthetic', label: 'Oli Semi-Sintetik', priceModifier: 75000, description: 'Keseimbangan harga dan performa' },
    { value: 'mineral', label: 'Oli Mineral', priceModifier: 0, description: 'Pilihan ekonomis untuk harian' },
];

export function ServiceSelector({
    services,
    selectedServices,
    onAdd,
    onRemove,
    onUpdateQuantity,
    onUpdateOilType,
}: ServiceSelectorProps) {
    const formatCurrency = (amount: number) => {
        return 'Rp ' + amount.toLocaleString('id-ID');
    };

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
        const categoryName = service.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    // Check if service is an oil change service
    const isOilChangeService = (serviceName: string) => {
        return serviceName.toLowerCase().includes('oil') || serviceName.toLowerCase().includes('oli');
    };

    const calculateFinalPrice = (service: Service, oilType?: string) => {
        let price = service.price;
        if (oilType && isOilChangeService(service.name)) {
            const oilTypeInfo = oilTypes.find(o => o.value === oilType);
            if (oilTypeInfo) {
                price += oilTypeInfo.priceModifier;
            }
        }
        return price;
    };

    // Get available services (not yet selected)
    const getAvailableServices = () => {
        const selectedIds = selectedServices.map(s => s.service.id);
        return services.filter(s => !selectedIds.includes(s.id));
    };

    return (
        <div className="space-y-4">
            {/* Selected Services */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-semibold">Layanan Dipilih</Label>
                        <Badge variant="secondary">{selectedServices.length} layanan</Badge>
                    </div>

                    {selectedServices.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground mb-2">Belum ada layanan dipilih</p>
                            <p className="text-sm text-muted-foreground">Pilih layanan dari menu di bawah</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedServices.map((selected) => {
                                const finalPrice = calculateFinalPrice(selected.service, selected.oilType);
                                const isOilService = isOilChangeService(selected.service.name);

                                return (
                                    <div key={selected.service.id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold">{selected.service.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {selected.service.category.name}
                                                    </Badge>
                                                </div>
                                                {selected.service.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {selected.service.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRemove(selected.service.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Oil Type Selection for Oil Change Services */}
                                        {isOilService && (
                                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                                <Label className="text-sm">Jenis Oli:</Label>
                                                <Select
                                                    value={selected.oilType || 'mineral'}
                                                    onValueChange={(value) => onUpdateOilType(selected.service.id, value as any)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih jenis oli" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {oilTypes.map((oil) => (
                                                            <SelectItem key={oil.value} value={oil.value}>
                                                                <div className="flex items-center justify-between w-full gap-4">
                                                                    <div>
                                                                        <div className="font-medium">{oil.label}</div>
                                                                        <div className="text-xs text-muted-foreground">{oil.description}</div>
                                                                    </div>
                                                                    <div className="text-sm font-semibold">
                                                                        {oil.priceModifier > 0 ? `+${formatCurrency(oil.priceModifier)}` : 'Termasuk'}
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {/* Quantity */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Label className="text-sm">Jumlah:</Label>
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => onUpdateQuantity(selected.service.id, Math.max(1, selected.quantity - 1))}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-12 text-center">{selected.quantity}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => onUpdateQuantity(selected.service.id, selected.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Subtotal:</p>
                                                <p className="text-lg font-bold text-primary">
                                                    {formatCurrency(finalPrice * selected.quantity)}
                                                </p>
                                            </div>
                                        </div>

                                        {selected.service.duration && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Estimasi: {selected.service.duration}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Service Dropdown */}
            <Card>
                <CardContent className="pt-6">
                    <Label className="text-base font-semibold mb-4 block">Tambah Layanan</Label>

                    {Object.entries(groupedServices).length === 0 ? (
                        <p className="text-sm text-muted-foreground">Tidak ada layanan tersedia</p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedServices).map(([categoryName, categoryServices]) => {
                                const availableInCategory = categoryServices.filter(
                                    s => !selectedServices.find(sel => sel.service.id === s.id)
                                );

                                if (availableInCategory.length === 0) return null;

                                return (
                                    <div key={categoryName}>
                                        <Label className="text-sm text-muted-foreground mb-2 block">
                                            {categoryName}
                                        </Label>
                                        <div className="grid gap-2">
                                            {availableInCategory.slice(0, 3).map((service) => {
                                                const isOilService = isOilChangeService(service.name);
                                                return (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        onClick={() => onAdd(service.id)}
                                                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors text-left group"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-medium group-hover:text-primary transition-colors">
                                                                {service.name}
                                                            </div>
                                                            {service.description && (
                                                                <div className="text-xs text-muted-foreground line-clamp-1">
                                                                    {service.description}
                                                                </div>
                                                            )}
                                                            {isOilService && (
                                                                <Badge variant="secondary" className="mt-1 text-xs">
                                                                    <Plus className="h-3 w-3 mr-1" />
                                                                    Pilih Jenis Oli
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-primary">
                                                                {formatCurrency(service.price)}
                                                            </div>
                                                            {service.duration && (
                                                                <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {service.duration}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Plus className="h-5 w-5 text-muted-foreground ml-2 group-hover:text-primary transition-colors" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
