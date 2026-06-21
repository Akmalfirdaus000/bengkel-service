<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Faktur Penjualan #{{ $booking->queue_number }}</title>
    <style>
        body { 
            font-family: 'Courier', monospace; 
            color: #1e40af; /* Blue ink color */
            line-height: 1.2; 
            font-size: 12px; 
            background: #fff;
            margin: 0;
            padding: 10px;
        }
        .container {
            width: 100%;
        }
        .header-table {
            width: 100%;
            margin-bottom: 5px;
        }
        .header-left {
            width: 40%;
            vertical-align: top;
        }
        .header-title {
            font-weight: bold;
            font-size: 14px;
            letter-spacing: 1px;
        }
        .header-subtitle {
            font-weight: bold;
            font-size: 16px;
        }
        .header-right {
            width: 60%;
            vertical-align: top;
        }
        .info-table {
            width: 100%;
            font-size: 10px;
        }
        .info-table td {
            padding: 2px 0;
            vertical-align: top;
        }
        .info-label {
            width: 80px;
        }
        .info-colon {
            width: 10px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-top: 5px;
        }
        .items-table th {
            border-top: 1px solid #1e40af;
            border-bottom: 1px solid #1e40af;
            padding: 5px 2px;
            text-align: left;
            font-weight: bold;
        }
        .items-table td {
            padding: 5px 2px;
            vertical-align: top;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .totals-table {
            width: 100%;
            margin-top: 5px;
            font-size: 10px;
            font-weight: bold;
        }
        .totals-table td {
            padding: 5px 2px;
            border-top: 1px solid #1e40af;
        }
    </style>
</head>
<body>
    <div class="container">
        <table class="header-table">
            <tr>
                <td class="header-left">
                    <div class="header-title">FAKTUR PENJUALAN</div>
                    <div class="header-subtitle">GAMA 2000 AUTO SERVICE</div>
                    <div>JL GAJAH MADA NO 20 A</div>
                    <div>081270833196</div>
                </td>
                <td class="header-right">
                    <table class="info-table">
                        <tr>
                            <td class="info-label">No Transaksi</td>
                            <td class="info-colon">:</td>
                            <td style="width: 150px;">{{ $booking->queue_number ?? $booking->id }}</td>
                            <td class="info-label" style="width: 60px;">No Polisi</td>
                            <td class="info-colon">:</td>
                            <td>{{ $booking->vehicle->plate_number }} / {{ strtoupper($booking->vehicle->model) }}</td>
                        </tr>
                        <tr>
                            <td>Tanggal</td>
                            <td>:</td>
                            <td>{{ $booking->completed_at ? \Carbon\Carbon::parse($booking->completed_at)->format('d/m/Y H.i.s') : date('d/m/Y H.i.s') }}</td>
                            <td>Pemilik</td>
                            <td>:</td>
                            <td>{{ strtoupper($booking->customer_name ?? ($booking->user->name ?? '-')) }}</td>
                        </tr>
                        <tr>
                            <td>Mekanik</td>
                            <td>:</td>
                            <td colspan="4">
                                @if($booking->mechanics && $booking->mechanics->count() > 0)
                                    {{ strtoupper($booking->mechanics->pluck('name')->join(', ')) }}
                                @else
                                    -
                                @endif
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 4%;">No.</th>
                    <th style="width: 13%;">Kode Item</th>
                    <th style="width: 33%;">Nama Item</th>
                    <th style="width: 8%; text-align: right;">Jml</th>
                    <th style="width: 7%; text-align: left; padding-left: 5px;">Satuan</th>
                    <th style="width: 13%; text-align: right;">Harga</th>
                    <th style="width: 7%; text-align: right;">Pot</th>
                    <th style="width: 15%; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($booking->serviceItems as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $item->service->name), 0, 4)) }}{{ $item->id }}</td>
                    <td>
                        {{ strtoupper($item->service->name) }}
                        @if($item->serviceSubItem)
                            <br>{{ strtoupper($item->serviceSubItem->name) }}
                        @endif
                    </td>
                    <td class="text-right">{{ number_format($item->quantity, 2, ',', '.') }}</td>
                    @php
                        $unit = 'PCS';
                        $svcName = strtoupper($item->service->name);
                        if (strpos($svcName, 'OLI') !== false) {
                            $unit = 'BTL';
                        } elseif (strpos($svcName, 'JASA') !== false || strpos($svcName, 'SERVICE') !== false || strpos($svcName, 'SERVIS') !== false) {
                            $unit = 'JASA';
                        }
                    @endphp
                    <td style="text-align: left; padding-left: 5px;">{{ $unit }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2, ',', '.') }}</td>
                    <td class="text-right">0,00</td>
                    <td class="text-right">{{ number_format($item->subtotal, 2, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals-table">
            <tr>
                <td style="width: 72%; border: none;"></td>
                <td style="width: 15%; text-align: right; border-top: 1px solid #1e40af;">Total :</td>
                <td style="width: 13%; text-align: right; border-top: 1px solid #1e40af;">{{ number_format($booking->total_amount, 2, ',', '.') }}</td>
            </tr>
            @if($booking->discount_amount > 0)
            <tr>
                <td style="border: none;"></td>
                <td class="text-right" style="border: none;">Potongan :</td>
                <td class="text-right" style="border: none;">{{ number_format($booking->discount_amount, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td style="border: none;"></td>
                <td class="text-right" style="border: none;">Grand Total :</td>
                <td class="text-right" style="border: none;">{{ number_format($booking->final_amount, 2, ',', '.') }}</td>
            </tr>
            @endif
        </table>
    </div>
</body>
</html>
