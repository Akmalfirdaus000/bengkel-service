<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Invoice & Pembayaran - Suja Bengkel</title>
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
            margin-bottom: 20px;
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

        .payment-methods-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .payment-method-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .payment-method-table th {
            background: #f5f5f5;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #000;
            font-size: 9px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .payment-method-table td {
            padding: 8px 10px;
            border: 1px solid #ccc;
            font-size: 10px;
        }
        .payment-method-table td.text-right {
            text-align: right;
        }
        .payment-method-table td.text-center {
            text-align: center;
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
        .invoice-number {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 10px;
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
        .payment-method-text {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: normal;
        }
        .payment-amount {
            font-weight: bold;
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
            <div class="report-title">LAPORAN INVOICE & PEMBAYARAN</div>
            <div class="report-period">
                Periode: {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }}
            </div>
            <div class="report-date">
                Dicetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-title">Ringkasan Invoice</div>
            <div class="summary-grid">
                <div class="summary-row">
                    <div class="summary-cell">
                        <div class="summary-label">Total Invoice</div>
                        <div class="summary-value">{{ $summary['total_invoices'] ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Total Tagihan</div>
                        <div class="summary-value">Rp {{ number_format($summary['total_amount'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Total Dibayar</div>
                        <div class="summary-value">Rp {{ number_format($summary['total_paid'] ?? 0, 0, ',', '.') }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Sisa Tagihan</div>
                        <div class="summary-value">Rp {{ number_format(($summary['total_amount'] ?? 0) - ($summary['total_paid'] ?? 0), 0, ',', '.') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Methods Summary -->
        @php $totalPayments = $summary['total_paid'] ?? 0; @endphp
        @if(isset($summary['payment_methods']) && count($summary['payment_methods']) > 0)
        <div class="payment-methods-section">
            <div class="summary-title">Ringkasan Metode Pembayaran</div>
            <table class="payment-method-table">
                <thead>
                    <tr>
                        <th>Metode Pembayaran</th>
                        <th class="text-right">Jumlah</th>
                        <th class="text-right">Persentase</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($summary['payment_methods'] as $method => $amount)
                    <tr>
                        <td>
                            @if($method == 'cash')
                                Tunai
                            @elseif($method == 'transfer')
                                Transfer Bank
                            @elseif($method == 'card')
                                Kartu Debit/Kredit
                            @elseif($method == 'e_wallet')
                                E-Wallet
                            @elseif($method == 'qr')
                                QRIS
                            @else
                                {{ ucfirst($method) }}
                            @endif
                        </td>
                        <td class="text-right">
                            <div class="payment-amount">Rp {{ number_format($amount, 0, ',', '.') }}</div>
                        </td>
                        <td class="text-right">
                            @if($totalPayments > 0)
                                {{ round(($amount / $totalPayments) * 100, 1) }}%
                            @else
                                0%
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- Invoice Table -->
        <div class="summary-title" style="margin-top: 30px;">Detail Invoice</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 12%">No. Invoice</th>
                    <th style="width: 10%">Tanggal</th>
                    <th style="width: 18%">Pelanggan</th>
                    <th style="width: 16%">Kendaraan</th>
                    <th style="width: 16%">Metode Pembayaran</th>
                    <th style="width: 10%" class="text-center">Status</th>
                    <th style="width: 9%" class="text-right">Tagihan</th>
                    <th style="width: 9%" class="text-right">Dibayar</th>
                </tr>
            </thead>
            <tbody>
                @php $totalAmount = 0; $totalPaid = 0; @endphp
                @foreach($bookings as $index => $booking)
                @php
                    $totalAmount += (float)$booking->final_amount;
                    $paidAmount = $booking->payments ? $booking->payments->where('status', 'completed')->sum('amount') : 0;
                    $totalPaid += $paidAmount;
                    $rowClass = ($index % 2 == 0) ? 'row-odd' : '';
                @endphp
                <tr class="{{ $rowClass }}">
                    <td>
                        <div class="invoice-number">#INV-{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}</div>
                    </td>
                    <td>{{ $booking->booking_date->format('d/m/Y') }}</td>
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
                        @endif
                    </td>
                    <td>
                        @if($booking->payments && $booking->payments->count() > 0)
                            @foreach($booking->payments->take(2) as $payment)
                                <div class="payment-method-text">
                                    @if($payment->payment_method == 'cash')
                                        Tunai
                                    @elseif($payment->payment_method == 'transfer')
                                        Transfer
                                    @elseif($payment->payment_method == 'card')
                                        Kartu
                                    @elseif($payment->payment_method == 'e_wallet')
                                        E-Wallet
                                    @elseif($payment->payment_method == 'qr')
                                        QRIS
                                    @else
                                        {{ ucfirst($payment->payment_method) }}
                                    @endif
                                    : <span class="payment-amount">Rp {{ number_format($payment->amount, 0, ',', '.') }}</span>
                                </div>
                            @endforeach
                            @if($booking->payments->count() > 2)
                                <div style="font-size: 9px; color: #666;">
                                    +{{ $booking->payments->count() - 2 }} pembayaran lainnya
                                </div>
                            @endif
                        @else
                            <span style="color: #999;">-</span>
                        @endif
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
                    </td>
                    <td class="text-right">
                        <div class="amount">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</div>
                    </td>
                    <td class="text-right">
                        <div class="amount">Rp {{ number_format($paidAmount, 0, ',', '.') }}</div>
                    </td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="6" class="text-right">
                        <span class="grand-total">Total Keseluruhan</span>
                    </td>
                    <td class="text-right">
                        <div class="amount" style="font-size: 13px;">Rp {{ number_format($totalAmount, 0, ',', '.') }}</div>
                    </td>
                    <td class="text-right">
                        <div class="amount" style="font-size: 13px;">Rp {{ number_format($totalPaid, 0, ',', '.') }}</div>
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
