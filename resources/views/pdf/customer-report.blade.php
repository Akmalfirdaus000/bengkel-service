<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Customer - Gama 2000 Auto Service</title>
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
        .customer-name {
            font-weight: bold;
            font-size: 12px;
        }
        .customer-phone {
            font-size: 9px;
            color: #666;
        }
        .vehicle-item {
            margin-bottom: 4px;
        }
        .vehicle-plate {
            font-weight: bold;
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
            <div class="report-title">LAPORAN CUSTOMER DAN KENDARAAN</div>
            <div class="report-period">
                Periode: {{ \Carbon\Carbon::parse($date_from)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($date_to)->format('d/m/Y') }}
            </div>
            <div class="report-date">
                Dicetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <div class="summary-title">Ringkasan Pelanggan</div>
            <div class="summary-grid">
                <div class="summary-row">
                    <div class="summary-cell">
                        <div class="summary-label">Total Pelanggan</div>
                        <div class="summary-value">{{ $summary['total_customers'] ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Pelanggan Aktif (Periode Ini)</div>
                        <div class="summary-value">{{ $summary['active_period'] ?? 0 }}</div>
                    </div>
                    <div class="summary-cell">
                        <div class="summary-label">Total Kendaraan Terdaftar</div>
                        <div class="summary-value">{{ $summary['total_vehicles'] ?? 0 }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer Table -->
        <div class="summary-title" style="margin-top: 30px;">Detail Pelanggan</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 5%" class="text-center">No.</th>
                    <th style="width: 25%">Pelanggan</th>
                    <th style="width: 20%">Kontak</th>
                    <th style="width: 25%">Kendaraan</th>
                    <th style="width: 10%" class="text-center">Total Servis</th>
                    <th style="width: 15%" class="text-right">Total Transaksi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($customers as $index => $customer)
                @php
                    $rowClass = ($index % 2 == 0) ? 'row-odd' : '';
                @endphp
                <tr class="{{ $rowClass }}">
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <div class="customer-name">{{ $customer->name }}</div>
                        <div class="customer-phone">Terdaftar: {{ $customer->created_at->format('d/m/Y') }}</div>
                    </td>
                    <td>
                        <div>{{ $customer->phone ?? '-' }}</div>
                        <div class="customer-phone">{{ $customer->email }}</div>
                    </td>
                    <td>
                        @if($customer->vehicles && $customer->vehicles->count() > 0)
                            @foreach($customer->vehicles as $vehicle)
                                <div class="vehicle-item">
                                    <span class="vehicle-plate">{{ $vehicle->plate_number }}</span>
                                    <div class="customer-phone">{{ $vehicle->brand }} {{ $vehicle->model }}</div>
                                </div>
                            @endforeach
                        @else
                            <span style="color: #999; font-style: italic;">Belum ada kendaraan</span>
                        @endif
                    </td>
                    <td class="text-center">
                        <strong>{{ $customer->total_bookings }}</strong>
                    </td>
                    <td class="text-right">
                        <div class="amount">Rp {{ number_format($customer->total_spent ?? 0, 0, ',', '.') }}</div>
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
