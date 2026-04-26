<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daftar Transaksi - Suja Bengkel</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.4; font-size: 10px; }
        .container { padding: 15px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: bold; color: #1e293b; }
        .info { color: #64748b; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; text-align: left; padding: 8px; border: 1px solid #e2e8f0; color: #475569; font-size: 8px; text-transform: uppercase; }
        td { padding: 8px; border: 1px solid #f1f5f9; }
        .status-badge { display: inline-block; padding: 2px 5px; border-radius: 3px; font-size: 7px; font-weight: bold; text-transform: uppercase; }
        .status-completed { background: #dcfce7; color: #15803d; }
        .status-cancelled { background: #fee2e2; color: #b91c1c; }
        .status-other { background: #f1f5f9; color: #475569; }
        .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 8px; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">DAFTAR TRANSAKSI SERVICE</div>
            <div class="info">Dicetak pada: {{ date('d M Y H:i') }} | Total Transaksi: {{ count($bookings) }}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 10%">No. Antrian</th>
                    <th style="width: 15%">Tanggal</th>
                    <th style="width: 20%">Pelanggan</th>
                    <th style="width: 20%">Kendaraan</th>
                    <th style="width: 10%">Status</th>
                    <th style="width: 10%">Status Bayar</th>
                    <th style="width: 15%" class="text-right">Total Akhir</th>
                </tr>
            </thead>
            <tbody>
                @php $grandTotal = 0; @endphp
                @foreach($bookings as $booking)
                @php $grandTotal += (float)$booking->final_amount; @endphp
                <tr>
                    <td><strong>#{{ $booking->queue_number }}</strong></td>
                    <td>{{ $booking->booking_date->format('d/m/Y') }}</td>
                    <td>{{ $booking->user->name }}</td>
                    <td>{{ $booking->vehicle->plate_number }} ({{ $booking->vehicle->brand }})</td>
                    <td>
                        <span class="status-badge {{ $booking->status == 'completed' ? 'status-completed' : ($booking->status == 'cancelled' ? 'status-cancelled' : 'status-other') }}">
                            {{ $booking->status }}
                        </span>
                    </td>
                    <td>{{ strtoupper($booking->payment_status) }}</td>
                    <td class="text-right">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr style="background: #f8fafc; font-weight: bold;">
                    <td colspan="6" class="text-right" style="padding: 10px;">TOTAL KESELURUHAN</td>
                    <td class="text-right" style="padding: 10px; font-size: 11px; color: #3b82f6;">Rp {{ number_format($grandTotal, 0, ',', '.') }}</td>
                </tr>
            </tfoot>
        </table>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Suja Bengkel Service Management Platform</p>
        </div>
    </div>
</body>
</html>
