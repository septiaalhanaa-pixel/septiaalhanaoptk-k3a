import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Ship, 
  Boxes, 
  CheckCircle2, 
  Search,
  DollarSign
} from 'lucide-react';
import { Container, Vessel, GateTransaction, StevedoringTransaction } from '../types';

interface ReportsViewProps {
  containers: Container[];
  vessels: Vessel[];
  gateTransactions: GateTransaction[];
  stevedoring: StevedoringTransaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  containers,
  vessels,
  gateTransactions,
  stevedoring
}) => {
  const [reportType, setReportType] = useState<'throughput' | 'dwelling' | 'vessel_perf' | 'gate_recap' | 'billing'>('throughput');
  const [dateRange, setDateRange] = useState('Bulan Ini (September 2026)');

  // Function to download CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'throughput' || reportType === 'gate_recap') {
      csvContent += 'No,ID Transaksi,No Peti Kemas,Ukuran,Tipe Transaksi,Truk,Supir,Pelayaran,Shipper,Berat Bruto (Kg),Waktu Gate\n';
      gateTransactions.forEach((gt, idx) => {
        csvContent += `${idx + 1},${gt.id},${gt.containerNo},${gt.containerSize},${gt.transactionType},${gt.truckPlateNo},${gt.driverName},"${gt.shippingLine}","${gt.customerName}",${gt.grossWeightKg},"${gt.timestamp}"\n`;
      });
    } else if (reportType === 'dwelling') {
      csvContent += 'No,No Peti Kemas,Ukuran,Status,Lokasi Yard,Shipper,Tgl Masuk,Dwelling Days\n';
      containers.forEach((c, idx) => {
        csvContent += `${idx + 1},${c.containerNo},${c.size},${c.status},"${c.currentLocation}","${c.assignedShipper || '-'}",${c.entryDate || '2026-09-12'},2.4\n`;
      });
    } else if (reportType === 'vessel_perf') {
      csvContent += 'No,Nama Kapal,IMO,Voyage,Rute,Kapasitas TEU,Muatan TEU,Status,Berth,Moves/Jam\n';
      vessels.forEach((v, idx) => {
        csvContent += `${idx + 1},"${v.name}",${v.imoNumber},VOY-2026-09,"${v.route}",${v.teuCapacity},${v.currentTeuLoad},"${v.status}","${v.currentBerth || '-'}",28.4\n`;
      });
    } else {
      csvContent += 'No,Perusahaan Shipper,Jumlah Boks,Tarif Jasa Dermaga (Rp),Tarif Penumpukan (Rp),Total Tagihan (Rp)\n';
      csvContent += '1,PT Indofood Sukses Makmur Tbk,48,24000000,12500000,36500000\n';
      csvContent += '2,PT Unilever Indonesia Tbk,36,18000000,9000000,27000000\n';
      csvContent += '3,PT Mayora Indah Tbk,24,12000000,6000000,18000000\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Terminal_${reportType}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Modul Laporan Operasional & Rekapitulasi Terminal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh laporan berkala performa dermaga, rekapitulasi dwelling time, produktivitas bongkar muat, dan billing jasa pelabuhan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReportType('throughput')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              reportType === 'throughput'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Throughput Peti Kemas
          </button>
          <button
            onClick={() => setReportType('dwelling')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              reportType === 'dwelling'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Dwelling Time (Waktu Inap)
          </button>
          <button
            onClick={() => setReportType('vessel_perf')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              reportType === 'vessel_perf'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Produktivitas Armada Kapal
          </button>
          <button
            onClick={() => setReportType('gate_recap')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              reportType === 'gate_recap'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rekapitulasi Gerbang (Gate)
          </button>
          <button
            onClick={() => setReportType('billing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              reportType === 'billing'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rekap Jasa Dermaga & Penumpukan
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
          >
            <option value="Hari Ini (17 September 2026)">Hari Ini (17 September 2026)</option>
            <option value="Minggu Ini (W38 2026)">Minggu Ini (W38 2026)</option>
            <option value="Bulan Ini (September 2026)">Bulan Ini (September 2026)</option>
            <option value="Kuartal III 2026 (Q3)">Kuartal III 2026 (Q3)</option>
            <option value="Tahun Berjalan 2026 (YTD)">Tahun Berjalan 2026 (YTD)</option>
          </select>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Akumulasi Throughput</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">1,890 TEU</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">
            Target Tercapai 104.2%
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Rata-rata Dwelling Time Terminal</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">2.35 Hari</div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 inline-block">
            Efisiensi Standar Kemenhub
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Gross Crane Rate (BCH)</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">28.4 Box/Jam</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">
            Kecepatan Bongkar Muat Cepat
          </span>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            {reportType === 'throughput' && 'Tabel Rincian Throughput Bulanan Peti Kemas'}
            {reportType === 'dwelling' && 'Tabel Pemantauan Waktu Inap (Dwelling Time)'}
            {reportType === 'vessel_perf' && 'Tabel Produktivitas Bongkar Muat Kapal di Dermaga'}
            {reportType === 'gate_recap' && 'Tabel Log Rekapitulasi Masuk / Keluar Gate'}
            {reportType === 'billing' && 'Tabel Estimasi Tagihan Jasa Penumpukan & Dermaga'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">Periode: {dateRange}</span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'throughput' || reportType === 'gate_recap' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Transaksi</th>
                  <th className="py-3 px-4">Peti Kemas & Ukuran</th>
                  <th className="py-3 px-4">Tipe Gate</th>
                  <th className="py-3 px-4">No Truk & Supir</th>
                  <th className="py-3 px-4">Shipper / Pelanggan</th>
                  <th className="py-3 px-4">Berat Bruto</th>
                  <th className="py-3 px-4">Waktu Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {gateTransactions.map((gt, idx) => (
                  <tr key={gt.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{gt.eirNumber}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold">{gt.containerNo}</div>
                      <div className="text-[10px] text-slate-500">{gt.containerSize}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{gt.transactionType}</td>
                    <td className="py-3 px-4">
                      <div className="font-mono">{gt.truckPlateNo}</div>
                      <div className="text-[10px] text-slate-500">{gt.driverName}</div>
                    </td>
                    <td className="py-3 px-4">{gt.customerName}</td>
                    <td className="py-3 px-4 font-mono">{(gt.grossWeightKg / 1000).toFixed(1)} Ton</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{gt.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : reportType === 'dwelling' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Peti Kemas</th>
                  <th className="py-3 px-4">Ukuran & Tipe</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Lokasi Yard</th>
                  <th className="py-3 px-4">Shipper</th>
                  <th className="py-3 px-4">Tgl Masuk</th>
                  <th className="py-3 px-4">Lama Inap (Hari)</th>
                  <th className="py-3 px-4">Evaluasi Standar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {containers.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.containerNo}</td>
                    <td className="py-3 px-4">{c.size} • {c.type}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{c.currentLocation}</td>
                    <td className="py-3 px-4">{c.assignedShipper || '-'}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">2026-09-14</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">{(2.1 + (idx * 0.4)).toFixed(1)} Hari</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Memenuhi Aturan (&lt;3 Hari)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : reportType === 'vessel_perf' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Kapal Pelayaran</th>
                  <th className="py-3 px-4">IMO / Bendera</th>
                  <th className="py-3 px-4">Rute Pelayaran</th>
                  <th className="py-3 px-4">Muatan / Kapasitas</th>
                  <th className="py-3 px-4">Status & Sandar</th>
                  <th className="py-3 px-4">Produktivitas (BCH)</th>
                  <th className="py-3 px-4">Efisiensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {vessels.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{v.name}</td>
                    <td className="py-3 px-4 font-mono">{v.imoNumber} • {v.flag}</td>
                    <td className="py-3 px-4">{v.route}</td>
                    <td className="py-3 px-4 font-mono">{v.currentTeuLoad} / {v.teuCapacity} TEU</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-700">{v.status}</span>
                      <div className="text-[10px] text-slate-500">{v.currentBerth || 'En Route'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">28.4 Box/Jam</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">98.5% On-Schedule</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Perusahaan / Shipper</th>
                  <th className="py-3 px-4">Total Boks (TEU)</th>
                  <th className="py-3 px-4">Jasa Dermaga (IDR)</th>
                  <th className="py-3 px-4">Jasa Penumpukan Yard (IDR)</th>
                  <th className="py-3 px-4">Biaya Reefer Monitoring</th>
                  <th className="py-3 px-4">Total Tagihan (IDR)</th>
                  <th className="py-3 px-4">Status Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">PT Indofood Sukses Makmur Tbk</td>
                  <td className="py-3 px-4 font-mono">48 TEU</td>
                  <td className="py-3 px-4 font-mono">Rp 24.000.000</td>
                  <td className="py-3 px-4 font-mono">Rp 12.500.000</td>
                  <td className="py-3 px-4 font-mono">Rp 4.800.000</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-800">Rp 41.300.000</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Lunas / Verified</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">PT Unilever Indonesia Tbk</td>
                  <td className="py-3 px-4 font-mono">36 TEU</td>
                  <td className="py-3 px-4 font-mono">Rp 18.000.000</td>
                  <td className="py-3 px-4 font-mono">Rp 9.000.000</td>
                  <td className="py-3 px-4 font-mono">-</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-800">Rp 27.000.000</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Lunas / Verified</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">PT Mayora Indah Tbk</td>
                  <td className="py-3 px-4 font-mono">24 TEU</td>
                  <td className="py-3 px-4 font-mono">Rp 12.000.000</td>
                  <td className="py-3 px-4 font-mono">Rp 6.000.000</td>
                  <td className="py-3 px-4 font-mono">-</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-800">Rp 18.000.000</td>
                  <td className="py-3 px-4 text-amber-700 font-semibold">Invoice Sent (Due 30d)</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
