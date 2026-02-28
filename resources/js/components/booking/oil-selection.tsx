import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Droplets, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OilType = 'synthetic' | 'semi-synthetic' | 'mineral';

interface OilOption {
    value: OilType;
    name: string;
    description: string;
    price: number;
    features: string[];
    recommended?: boolean;
}

interface OilSelectionProps {
    selectedOil?: OilType;
    onSelect: (oilType: OilType) => void;
    basePrice: number;
}

const oilOptions: OilOption[] = [
    {
        value: 'synthetic',
        name: 'Oli Sintetik',
        description: 'Perlindungan mesin maksimal dengan performa tinggi',
        price: 150000,
        features: [
            'Perlindungan mesin maksimal',
          'Performa tinggi & irit BBM',
          'Tahan hingga 10.000 km',
          'Ideal untuk mobil baru/high-performance'
        ],
        recommended: true,
    },
    {
        value: 'semi-synthetic',
        name: 'Oli Semi-Sintetik',
        description: 'Keseimbangan antara harga dan performa',
        price: 75000,
        features: [
            'Kombinasi oli sintetik & mineral',
          'Performa baik dengan harga terjangkau',
          'Tahan hingga 7.000 km',
          'Cocok untuk penggunaan harian'
        ],
    },
    {
        value: 'mineral',
        name: 'Oli Mineral',
        description: 'Pilihan ekonomis untuk pemakaian harian',
        price: 0,
        features: [
            'Harga paling ekonomis',
          'Layanan standar yang andal',
          'Tahan hingga 5.000 km',
          'Cocok untuk mobil tua/low-performance'
        ],
    },
];

export function OilSelection({ selectedOil, onSelect, basePrice }: OilSelectionProps) {
    const formatCurrency = (amount: number) => {
        return 'Rp ' + amount.toLocaleString('id-ID');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Pilih Jenis Oli
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    {oilOptions.map((option) => {
                        const isSelected = selectedOil === option.value;
                        const totalPrice = basePrice + option.price;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onSelect(option.value)}
                                className={cn(
                                    'relative text-left p-4 border-2 rounded-xl transition-all',
                                    isSelected
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                                )}
                            >
                                {option.recommended && !selectedOil && (
                                    <div className="absolute -top-2 right-2">
                                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                                            Rekomendasi
                                        </span>
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-lg">{option.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {option.description}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        {option.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-3 border-t">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-sm text-muted-foreground">Harga:</span>
                                            <span className="font-bold text-lg text-primary">
                                                {formatCurrency(totalPrice)}
                                            </span>
                                        </div>
                                        {option.price > 0 && (
                                            <div className="text-xs text-muted-foreground text-right mt-1">
                                                +{formatCurrency(option.price)} dari harga dasar
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function getOilPriceModifier(oilType?: OilType): number {
    if (!oilType) return 0;
    const option = oilOptions.find(o => o.value === oilType);
    return option?.price || 0;
}

export function getOilName(oilType: OilType): string {
    const option = oilOptions.find(o => o.value === oilType);
    return option?.name || 'Oli Mineral';
}
