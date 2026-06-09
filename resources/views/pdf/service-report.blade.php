<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Servis - Gama 2000 Auto Service</title>
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
            width: 50%;
            padding: 10px;
            border: 1px solid #000;
            vertical-align: top;
            text-align: center;
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
        .bold-text {
            font-weight: bold;
        }
        .sub-text {
            font-size: 9px;
            color: #666;
        }
        .item-list {
            margin: 0;
            padding-left: 15px;
            font-size: 10px;
        }
        .item-list li {
            margin-bottom: 2px;
        }
        .amount {
            font-weight: bold;
            font-size: 11px;
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
            <div class="report-title">LAPORAN RIWAYAT SERVIS</div>
            <div class="report-period">
                Periode: {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }}
            </div>
            <div class="report-date">
                Dicetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-title">Ringkasan Servis</div>
            <div class="summary-grid">
                <div class="summary-row">
                    <div class="summary-cell">
                        <div class="summary-label">Total Transaksi Servis (Selesai)</div>
                        <div class="summary-value">{{ $summary['total_service_transactions'] ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Total Item Servis Terjual</div>
                        <div class="summary-value">{{ $summary['total_items_sold'] ?? 0 }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Services Section -->
        @if(count($topServices) > 0)
        <div class="summary-section">
            <div class="summary-title">10 Layanan Terpopuler</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%" class="text-center">No.</th>
                        <th style="width: 50%">Nama Layanan / Item Servis</th>
                        <th style="width: 20%" class="text-center">Total Dipesan</th>
                        <th style="width: 25%" class="text-right">Total Pendapatan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($topServices as $index => $service)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td class="bold-text">{{ $service->name }}</td>
                        <td class="text-center">{{ $service->total_sold }} kali</td>
                        <td class="text-right amount">Rp {{ number_format($service->total_revenue, 0, ',', '.') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- Services Detail Table -->
        <div class="summary-title" style="margin-top: 30px;">Detail Riwayat Servis Pelanggan</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 15%">Tanggal / No. Antrian</th>
                    <th style="width: 25%">Pelanggan / Kendaraan</th>
                    <th style="width: 15%">Mekanik</th>
                    <th style="width: 30%">Item Servis</th>
                    <th style="width: 15%" class="text-right">Total Biaya</th>
                </tr>
            </thead>
            <tbody>
                @foreach($services as $index => $booking)
                @php
                    $rowClass = ($index % 2 == 0) ? 'row-odd' : '';
                @endphp
                <tr class="{{ $rowClass }}">
                    <td>
                        <div class="bold-text">{{ $booking->booking_date->format('d/m/Y') }}</div>
                        <div class="sub-text">#{{ $booking->queue_number }}</div>
                    </td>
                    <td>
                        <div class="bold-text">{{ $booking->customer_name ?? ($booking->user->name ?? '-') }}</div>
                        @if($booking->vehicle)
                            <div class="sub-text" style="margin-top: 4px;">{{ $booking->vehicle->brand }} {{ $booking->vehicle->model }}</div>
                            <div class="bold-text" style="font-size: 10px;">{{ $booking->vehicle->plate_number }}</div>
                        @endif
                    </td>
                    <td>
                        @if($booking->mechanics && $booking->mechanics->count() > 0)
                            @foreach($booking->mechanics as $mechanic)
                                <div>{{ $mechanic->name }}</div>
                            @endforeach
                        @else
                            <span class="sub-text">-</span>
                        @endif
                    </td>
                    <td>
                        @if($booking->serviceItems && $booking->serviceItems->count() > 0)
                            <ul class="item-list">
                                @foreach($booking->serviceItems as $item)
                                    <li>{{ $item->service ? $item->service->name : 'Item Servis' }}</li>
                                @endforeach
                            </ul>
                        @else
                            <span class="sub-text" style="font-style: italic;">Tidak ada item tercatat</span>
                        @endif
                    </td>
                    <td class="text-right">
                        <div class="amount">Rp {{ number_format($booking->final_amount, 0, ',', '.') }}</div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <p><strong>GAMA 2000 AUTO SERVICE</strong></p>
            <p>Laporan ini dicetak secara otomatis oleh sistem pada {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</p>
            <p>&copy; {{ date('Y') }} Gama 2000 Auto Service. Seluruh hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>
