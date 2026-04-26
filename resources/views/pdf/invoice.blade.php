<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $booking->queue_number }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.5; font-size: 12px; }
        .invoice-box { padding: 30px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; text-transform: uppercase; }
        .company-info { text-align: right; }
        .invoice-title { font-size: 20px; color: #1e293b; font-weight: bold; margin-bottom: 10px; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table th { background: #f8fafc; text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 10px; text-transform: uppercase; color: #64748b; }
        .details-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
        .totals { margin-top: 30px; text-align: right; }
        .totals-row { margin-bottom: 5px; }
        .grand-total { font-size: 18px; font-weight: bold; color: #3b82f6; margin-top: 10px; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-paid { background: #dcfce7; color: #15803d; }
        .badge-unpaid { background: #fee2e2; color: #b91c1c; }
        .info-grid { width: 100%; margin-bottom: 40px; }
        .info-grid td { vertical-align: top; width: 50%; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="info-grid">
            <tr>
                <td>
                    <div class="logo">Suja Bengkel</div>
                    <p>Jl. Raya Bengkel No. 123<br>Kota Bengkel, Indonesia<br>+62 812 3456 7890</p>
                </td>
                <td class="company-info">
                    <div class="invoice-title">INVOICE</div>
                    <p>
                        <strong>No. Antrian:</strong> #{{ $booking->queue_number }}<br>
                        <strong>Tanggal:</strong> {{ $booking->booking_date->format('d M Y') }}<br>
                        <strong>Status Bayar:</strong> 
                        <span class="badge {{ $booking->payment_status == 'paid' ? 'badge-paid' : 'badge-unpaid' }}">
                            {{ strtoupper($booking->payment_status) }}
                        </span>
                    </p>
                </td>
            </tr>
        </table>

        <table class="info-grid">
            <tr>
                <td>
                    <h3 style="color: #64748b; font-size: 10px; text-transform: uppercase; margin-bottom: 10px;">Ditujukan Kepada:</h3>
                    <strong>{{ $booking->user->name }}</strong><br>
                    {{ $booking->user->email }}<br>
                    {{ $booking->user->phone }}
                </td>
                <td>
                    <h3 style="color: #64748b; font-size: 10px; text-transform: uppercase; margin-bottom: 10px;">Kendaraan:</h3>
                    <strong>{{ $booking->vehicle->brand }} {{ $booking->vehicle->model }}</strong><br>
                    No. Plat: {{ $booking->vehicle->plate_number }}<br>
                    Tahun: {{ $booking->vehicle->year }}
                </td>
            </tr>
        </table>

        <table class="details-table">
            <thead>
                <tr>
                    <th>Deskripsi Layanan</th>
                    <th>Sub-Item</th>
                    <th style="text-align: center">Qty</th>
                    <th style="text-align: right">Harga Satuan</th>
                    <th style="text-align: right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($booking->serviceItems as $item)
                <tr>
                    <td>
                        <strong>{{ $item->service->name }}</strong>
                    </td>
                    <td>{{ $item->serviceSubItem?->name ?? '-' }}</td>
                    <td style="text-align: center">{{ $item->quantity }}</td>
                    <td style="text-align: right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td style="text-align: right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">Subtotal: <strong>Rp {{ number_format($booking->total_amount, 0, ',', '.') }}</strong></div>
            <div class="totals-row">Diskon: <strong>Rp {{ number_format($booking->discount_amount, 0, ',', '.') }}</strong></div>
            <div class="grand-total">Total Akhir: Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</div>
        </div>

        <div class="footer">
            <p>Terima kasih telah mempercayakan servis kendaraan Anda kepada kami.<br>
            Harap simpan invoice ini sebagai bukti servis resmi.</p>
            <p style="font-weight: bold; margin-top: 10px;">&copy; {{ date('Y') }} Suja Bengkel Service Management</p>
        </div>
    </div>
</body>
</html>
