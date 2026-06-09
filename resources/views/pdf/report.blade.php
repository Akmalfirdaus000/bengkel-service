<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Bisnis - Gama 2000 Auto Service</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            line-height: 1.5;
            font-size: 11px;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 30px 40px;
            max-width: 100%;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }
        .report-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .report-period {
            font-size: 11px;
            margin-bottom: 5px;
        }
        .report-date {
            font-size: 10px;
            color: #666;
        }

        .summary-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .summary-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        .summary-row {
            display: table-row;
        }
        .summary-cell {
            display: table-cell;
            width: 33.33%;
            padding: 15px;
            border: 1px solid #000;
            vertical-align: top;
            text-align: center;
        }
        .summary-label {
            font-size: 9px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
            font-weight: normal;
        }
        .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            page-break-inside: auto;
        }
        table thead {
            display: table-header-group;
        }
        table tfoot {
            display: table-footer-group;
        }
        table tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        th {
            background: #f5f5f5;
            text-align: left;
            padding: 10px;
            border: 1px solid #000;
            color: #000;
            font-size: 9px;
            text-transform: uppercase;
            font-weight: bold;
        }
        th.text-center {
            text-align: center;
        }
        td {
            padding: 10px;
            border: 1px solid #ccc;
            font-size: 10px;
            vertical-align: middle;
        }
        td.text-center {
            text-align: center;
        }
        .row-odd {
            background: #f9f9f9;
        }
        .status-name {
            text-transform: capitalize;
        }
        .vehicle-name {
            font-weight: bold;
        }
        .vehicle-plate {
            font-size: 9px;
            color: #666;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 9px;
            color: #666;
            page-break-inside: avoid;
        }
        .footer p {
            margin: 3px 0;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company-name">GAMA 2000 AUTO SERVICE</div>
            <div class="report-title">LAPORAN OPERASIONAL & PENDAPATAN</div>
            <div class="report-period">
                Periode: {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }}
            </div>
            <div class="report-date">
                Dicetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-title">Ringkasan Operasional</div>
            <div class="summary-grid">
                <div class="summary-row">
                    <div class="summary-cell">
                        <div class="summary-label">Total Booking</div>
                        <div class="summary-value">{{ $summary->total_bookings ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Servis Selesai</div>
                        <div class="summary-value">{{ $revenue_summary->total_completed ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Total Pendapatan</div>
                        <div class="summary-value">Rp {{ number_format($revenue_summary->total_revenue ?? 0, 0, ',', '.') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Table -->
        @if(isset($bookings_by_status) && count($bookings_by_status) > 0)
        <div class="summary-title">Statistik Berdasarkan Status</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 70%">Status</th>
                    <th style="width: 15%" class="text-center">Jumlah</th>
                    <th style="width: 15%" class="text-center">Persentase</th>
                </tr>
            </thead>
            <tbody>
                @foreach($bookings_by_status as $status => $count)
                <tr>
                    <td>
                        @if($status == 'completed')
                            Selesai
                        @elseif($status == 'cancelled')
                            Dibatalkan
                        @elseif($status == 'in_progress')
                            Dalam Proses
                        @elseif($status == 'ready_to_pickup')
                            Siap Diambil
                        @elseif($status == 'assigned')
                            Ditugaskan
                        @elseif($status == 'confirmed')
                            Dikonfirmasi
                        @else
                            Menunggu
                        @endif
                    </td>
                    <td class="text-center">{{ $count }}</td>
                    <td class="text-center">
                        @if($summary->total_bookings > 0)
                            {{ round(($count / $summary->total_bookings) * 100, 1) }}%
                        @else
                            0%
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <!-- Detailed Transactions Table -->
        @if(isset($transactions) && count($transactions) > 0)
        <div class="summary-title" style="margin-top: 30px;">Detail Transaksi Penjualan</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 6%">No.</th>
                    <th style="width: 9%">Tanggal</th>
                    <th style="width: 17%">Pelanggan</th>
                    <th style="width: 15%">Kendaraan</th>
                    <th style="width: 24%">Layanan & Jasa</th>
                    <th style="width: 9%" class="text-center">Status</th>
                    <th style="width: 10%" class="text-center">Pembayaran</th>
                    <th style="width: 10%" class="text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @php $grandTotal = 0; @endphp
                @foreach($transactions as $index => $booking)
                @php
                    $grandTotal += (float)$booking->final_amount;
                    $rowClass = ($index % 2 == 0) ? 'row-odd' : '';
                @endphp
                <tr class="{{ $rowClass }}">
                    <td><strong>{{ $booking->queue_number }}</strong></td>
                    <td>
                        <div>{{ $booking->booking_date->format('d/m/Y') }}</div>
                        @if($booking->completed_at)
                            <div class="customer-phone">Selesai: {{ $booking->completed_at->format('d/m/Y') }}</div>
                        @endif
                    </td>
                    <td>
                        <div class="vehicle-name">{{ $booking->customer_name ?? ($booking->user->name ?? '-') }}</div>
                        @if($booking->customer_phone || optional($booking->user)->phone)
                            <div class="vehicle-plate">{{ $booking->customer_phone ?? $booking->user->phone }}</div>
                        @endif
                    </td>
                    <td>
                        @if($booking->vehicle)
                            <div class="vehicle-name">{{ $booking->vehicle->brand }} {{ $booking->vehicle->model }}</div>
                            <div class="vehicle-plate">{{ $booking->vehicle->plate_number }}</div>
                            @if($booking->vehicle->year)
                                <div class="vehicle-plate">{{ $booking->vehicle->year }}</div>
                            @endif
                        @endif
                    </td>
                    <td>
                        @if($booking->serviceItems && $booking->serviceItems->count() > 0)
                            <div style="font-size: 9px; line-height: 1.4;">
                                @foreach($booking->serviceItems->take(4) as $item)
                                    <div>• {{ $item->name }} <span style="color: #666;">(Rp {{ number_format($item->pivot ? $item->pivot->subtotal : $item->price, 0, ',', '.') }})</span></div>
                                @endforeach
                                @if($booking->serviceItems->count() > 4)
                                    <div style="color: #666;">+ {{ $booking->serviceItems->count() - 4 }} lainnya</div>
                                @endif
                            </div>
                        @else
                            <span style="color: #999;">-</span>
                        @endif
                        @if($booking->mechanics && $booking->mechanics->count() > 0)
                            <div class="vehicle-plate" style="margin-top: 3px;">
                                Mekanik: @foreach($booking->mechanics->take(2) as $mechanic){{ $mechanic->name }}{{ !$loop->last ? ', ' : '' }}@endforeach
                            </div>
                        @endif
                    </td>
                    <td class="text-center">
                        <span style="font-size: 9px; text-transform: uppercase;">
                            @if($booking->status == 'completed')
                                Selesai
                            @elseif($booking->status == 'cancelled')
                                Batal
                            @elseif($booking->status == 'in_progress')
                                Proses
                            @elseif($booking->status == 'ready_to_pickup')
                                Siap Ambil
                            @elseif($booking->status == 'assigned')
                                Ditugaskan
                            @elseif($booking->status == 'confirmed')
                                Dikonfirmasi
                            @else
                                Menunggu
                            @endif
                        </span>
                    </td>
                    <td class="text-center">
                        <span style="font-size: 9px; text-transform: uppercase;">
                            @if($booking->payment_status == 'paid')
                                Lunas
                            @elseif($booking->payment_status == 'unpaid')
                                Belum
                            @else
                                Sebagian
                            @endif
                        </span>
                        @if($booking->payments && $booking->payments->count() > 0)
                            @foreach($booking->payments->take(1) as $payment)
                                <div class="vehicle-plate">
                                    @if($payment->payment_method == 'cash')
                                        Tunai
                                    @elseif($payment->payment_method == 'transfer')
                                        Transfer
                                    @elseif($payment->payment_method == 'card')
                                        Kartu
                                    @else
                                        E-Wallet
                                    @endif
                                </div>
                            @endforeach
                        @endif
                    </td>
                    <td class="text-right">
                        <div class="amount">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</div>
                    </td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="7" class="text-right">
                        <span class="grand-total">Total Pendapatan</span>
                    </td>
                    <td class="text-right">
                        <div class="amount" style="font-size: 13px;">Rp {{ number_format($grandTotal, 0, ',', '.') }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        @endif

        <!-- Top Vehicles Table -->
        @if(isset($top_vehicles) && count($top_vehicles) > 0)
        <div class="summary-title">Top Kendaraan (Berdasarkan Volume Servis)</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 50%">Merk & Model</th>
                    <th style="width: 25%" class="text-center">No. Plat</th>
                    <th style="width: 25%" class="text-center">Total Servis</th>
                </tr>
            </thead>
            <tbody>
                @foreach($top_vehicles as $item)
                <tr>
                    <td>
                        @if($item->vehicle)
                            <div class="vehicle-name">{{ $item->vehicle->brand }} {{ $item->vehicle->model }}</div>
                        @else
                            <div style="color: #999;">Kendaraan dihapus</div>
                        @endif
                    </td>
                    <td class="text-center">
                        @if($item->vehicle)
                            <div class="vehicle-plate">{{ $item->vehicle->plate_number }}</div>
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-center">{{ $item->booking_count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p><strong>GAMA 2000 AUTO SERVICE</strong></p>
            <p>Laporan ini dicetak secara otomatis oleh sistem pada {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</p>
            <p>&copy; {{ date('Y') }} Gama 2000 Auto Service. Seluruh hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>
