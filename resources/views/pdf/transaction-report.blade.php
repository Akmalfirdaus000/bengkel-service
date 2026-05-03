<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Transaksi - Suja Bengkel</title>
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
            width: 25%;
            padding: 10px;
            border: 1px solid #000;
            vertical-align: top;
        }
        .summary-label {
            font-size: 9px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 5px;
            font-weight: normal;
        }
        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
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
            padding: 8px 6px;
            border: 1px solid #000;
            color: #000;
            font-size: 9px;
            text-transform: uppercase;
            font-weight: bold;
        }
        th.text-center {
            text-align: center;
        }
        th.text-right {
            text-align: right;
        }
        td {
            padding: 8px 6px;
            border: 1px solid #ccc;
            font-size: 10px;
            vertical-align: top;
        }
        td.text-center {
            text-align: center;
        }
        td.text-right {
            text-align: right;
        }
        .row-odd {
            background: #f9f9f9;
        }
        .status-text {
            font-weight: normal;
            font-size: 9px;
            text-transform: uppercase;
        }
        .customer-name {
            font-weight: bold;
            margin-bottom: 2px;
        }
        .customer-phone {
            font-size: 9px;
            color: #666;
        }
        .vehicle-info {
            font-weight: bold;
            margin-bottom: 2px;
        }
        .vehicle-plate {
            font-size: 9px;
            color: #666;
        }
        .mechanic-list {
            font-size: 9px;
        }
        .amount {
            font-weight: bold;
            font-size: 11px;
        }
        .total-row {
            background: #f0f0f0 !important;
            font-weight: bold;
        }
        .total-row td {
            border-top: 2px solid #000;
            padding: 12px 6px;
            font-size: 11px;
        }
        .grand-total {
            font-size: 13px;
            text-transform: uppercase;
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
            <div class="company-name">SUJA BENGKEL</div>
            <div class="report-title">LAPORAN TRANSAKSI SERVICE</div>
            <div class="report-period">
                Periode: {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }}
            </div>
            <div class="report-date">
                Dicetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-title">Ringkasan Transaksi</div>
            <div class="summary-grid">
                <div class="summary-row">
                    <div class="summary-cell">
                        <div class="summary-label">Total Transaksi</div>
                        <div class="summary-value">{{ $summary['total_bookings'] ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Total Pendapatan</div>
                        <div class="summary-value">Rp {{ number_format($summary['total_revenue'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Sudah Dibayar</div>
                        <div class="summary-value">Rp {{ number_format($summary['total_paid'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Belum Dibayar</div>
                        <div class="summary-value">Rp {{ number_format($summary['total_unpaid'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transaction Table -->
        <div class="summary-title" style="margin-top: 30px;">Detail Transaksi</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 6%">No.</th>
                    <th style="width: 9%">Tanggal</th>
                    <th style="width: 18%">Pelanggan</th>
                    <th style="width: 16%">Kendaraan</th>
                    <th style="width: 22%">Layanan</th>
                    <th style="width: 10%" class="text-center">Status</th>
                    <th style="width: 9%" class="text-center">Pembayaran</th>
                    <th style="width: 10%" class="text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @php $grandTotal = 0; @endphp
                @foreach($bookings as $index => $booking)
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
                        @if($booking->user)
                            <div class="customer-name">{{ $booking->user->name }}</div>
                            @if($booking->user->phone)
                                <div class="customer-phone">{{ $booking->user->phone }}</div>
                            @endif
                        @endif
                    </td>
                    <td>
                        @if($booking->vehicle)
                            <div class="vehicle-info">{{ $booking->vehicle->brand }} {{ $booking->vehicle->model }}</div>
                            <div class="vehicle-plate">{{ $booking->vehicle->plate_number }}</div>
                            @if($booking->vehicle->year)
                                <div class="customer-phone">{{ $booking->vehicle->year }}</div>
                            @endif
                        @endif
                    </td>
                    <td>
                        @if($booking->serviceItems && $booking->serviceItems->count() > 0)
                            <div class="mechanic-list">
                                @foreach($booking->serviceItems->take(3) as $item)
                                    <div>• {{ $item->name }}</div>
                                @endforeach
                                @if($booking->serviceItems->count() > 3)
                                    <div style="color: #666;">+ {{ $booking->serviceItems->count() - 3 }} lainnya</div>
                                @endif
                            </div>
                        @else
                            <span style="color: #999;">-</span>
                        @endif
                        @if($booking->mechanics && $booking->mechanics->count() > 0)
                            <div class="customer-phone" style="margin-top: 3px;">
                                Mekanik: @foreach($booking->mechanics->take(2) as $mechanic){{ $mechanic->name }}{{ !$loop->last ? ', ' : '' }}@endforeach
                            </div>
                        @endif
                    </td>
                    <td class="text-center">
                        <span class="status-text">
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
                        <span class="status-text">
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
                                <div class="customer-phone">
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
                        <span class="grand-total">Total Keseluruhan</span>
                    </td>
                    <td class="text-right">
                        <div class="amount" style="font-size: 13px;">Rp {{ number_format($grandTotal, 0, ',', '.') }}</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <p><strong>SUJA BENGKEL SERVICE</strong></p>
            <p>Laporan ini dicetak secara otomatis oleh sistem pada {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</p>
            <p>&copy; {{ date('Y') }} Suja Bengkel. Seluruh hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>
