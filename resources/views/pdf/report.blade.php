<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Bisnis - Suja Bengkel</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.5; font-size: 11px; }
        .container { padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 5px; }
        .period { color: #64748b; font-size: 12px; }
        .stats-grid { width: 100%; margin-bottom: 30px; }
        .stats-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
        .stats-label { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; }
        .stats-value { font-size: 16px; font-weight: bold; color: #1e293b; }
        .section-title { font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f1f5f9; text-align: left; padding: 10px; border: 1px solid #e2e8f0; color: #475569; font-size: 9px; text-transform: uppercase; }
        td { padding: 8px 10px; border: 1px solid #f1f5f9; }
        .revenue-cell { font-weight: bold; color: #0f172a; text-align: right; }
        .footer { margin-top: 50px; text-align: right; font-size: 9px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">LAPORAN OPERASIONAL & PENDAPATAN</div>
            <div class="period">Periode: {{ $date_from }} s/d {{ $date_to }}</div>
        </div>

        <table class="stats-grid">
            <tr>
                <td style="width: 33%; border: none;">
                    <div class="stats-card">
                        <div class="stats-label">Total Booking</div>
                        <div class="stats-value">{{ $summary->total_bookings ?? 0 }}</div>
                    </div>
                </td>
                <td style="width: 33%; border: none;">
                    <div class="stats-card">
                        <div class="stats-label">Servis Selesai</div>
                        <div class="stats-value">{{ $revenue_summary->total_completed ?? 0 }}</div>
                    </div>
                </td>
                <td style="width: 33%; border: none;">
                    <div class="stats-card">
                        <div class="stats-label">Total Pendapatan</div>
                        <div class="stats-value" style="color: #10b981;">Rp {{ number_format($revenue_summary->total_revenue ?? 0, 0, ',', '.') }}</div>
                    </div>
                </td>
            </tr>
        </table>

        <div class="section-title">Statistik Berdasarkan Status</div>
        <table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th style="text-align: center">Jumlah</th>
                    <th style="text-align: center">Persentase</th>
                </tr>
            </thead>
            <tbody>
                @foreach($bookings_by_status as $status => $count)
                <tr>
                    <td style="text-transform: capitalize;">{{ $status }}</td>
                    <td style="text-align: center">{{ $count }}</td>
                    <td style="text-align: center">{{ round(($count / max(1, $summary->total_bookings)) * 100, 1) }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="section-title">Top Kendaraan (Berdasarkan Volume Servis)</div>
        <table>
            <thead>
                <tr>
                    <th>Merk & Model</th>
                    <th style="text-align: center">No. Plat</th>
                    <th style="text-align: center">Total Servis</th>
                </tr>
            </thead>
            <tbody>
                @foreach($top_vehicles as $item)
                <tr>
                    <td>{{ $item->vehicle->brand }} {{ $item->vehicle->model }}</td>
                    <td style="text-align: center">{{ $item->vehicle->plate_number }}</td>
                    <td style="text-align: center">{{ $item->booking_count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <p>Dicetak pada: {{ date('d/m/Y H:i') }}<br>
            Oleh: Suja Bengkel Management System</p>
        </div>
    </div>
</body>
</html>
