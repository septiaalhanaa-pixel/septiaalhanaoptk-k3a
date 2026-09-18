import React from 'react';
import { 
  Boxes, 
  Ship, 
  Clock, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Activity,
  Send,
  Plus,
  Compass,
  ArrowRight,
  Anchor
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Container, Vessel, YardBlock, GateTransaction } from '../types';

interface DashboardAnalyticsProps {
  containers: Container[];
  vessels: Vessel[];
  yardBlocks: YardBlock[];
  gateTransactions: GateTransaction[];
  onNavigateTab: (tab: any) => void;
  onOpenAddContainer: () => void;
  onOpenGateIn: () => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  containers,
  vessels,
  yardBlocks,
  gateTransactions,
  onNavigateTab,
  onOpenAddContainer,
  onOpenGateIn
}) => {
  // Compute real metrics from state
  const totalContainers = containers.length;
  const totalCapacity = yardBlocks.reduce((acc, y) => acc + y.totalCapacityTeu, 0);
  const totalOccupied = yardBlocks.reduce((acc, y) => acc + y.currentTeuOccupied, 0);
  const yorPercent = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 74;

  const berthingVessels = vessels.filter(v => v.status.includes('Berthing'));
  const sailingVessels = vessels.filter(v => v.status.includes('Sailing'));

  // Monthly Throughput Data for Recharts
  const throughputData = [
    { bulan: 'Mei', domestic: 340, export: 420, import: 510 },
    { bulan: 'Jun', domestic: 380, export: 460, import: 530 },
    { bulan: 'Jul', domestic: 410, export: 490, import: 580 },
    { bulan: 'Agu', domestic: 460, export: 520, import: 610 },
    { bulan: 'Sep (Aktif)', domestic: 490, export: 580, import: 640 },
  ];

  // Yard Block Data
  const blockData = yardBlocks.map(b => ({
    name: b.name.split(' ')[0] + ' ' + b.name.split(' ')[1],
    terisi: b.currentTeuOccupied,
    sisa: Math.max(0, b.totalCapacityTeu - b.currentTeuOccupied),
    kapasitas: b.totalCapacityTeu,
    utilisasi: Math.round((b.currentTeuOccupied / b.totalCapacityTeu) * 100)
  }));

  // Container Type breakdown
  const typeCounts: { [key: string]: number } = {};
  containers.forEach(c => {
    const key = c.type.includes('Dry') ? 'Dry Cargo' : c.type.includes('Reefer') ? 'Reefer Cold' : c.type.includes('ISO') ? 'ISO Tank' : 'Special/OpenTop';
    typeCounts[key] = (typeCounts[key] || 0) + 1;
  });

  const pieData = Object.keys(typeCounts).map(k => ({
    name: k,
    value: typeCounts[k]
  }));

  const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl text-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-1">
            <Anchor className="w-4 h-4 text-blue-400" />
            <span>TERMINAL OPERATING SYSTEM (TOS) PELAYARAN NASIONAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Dashboard Analitik & Monitoring Armada Maritim
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitoring real-time throughput peti kemas, dwelling time dermaga, efisiensi penumpukan lapangan (Yard Occupancy), serta pelacakan armada kapal dan truk logistik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAddContainer}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Peti Kemas</span>
          </button>
          <button
            onClick={onOpenGateIn}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Gate-In Cepat</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Peti Kemas */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Peti Kemas</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {totalContainers * 180 + 1420} <span className="text-xs font-normal text-slate-500">TEUs</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs bulan lalu</span>
          </div>
        </div>

        {/* Metric 2: Yard Occupancy Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Yard Occupancy Rate (YOR)</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {yorPercent}%
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Kapasitas Lapangan</span>
            <span className="font-semibold text-emerald-700">Optimal (Target &lt;80%)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${yorPercent > 80 ? 'bg-amber-500' : 'bg-emerald-600'}`}
              style={{ width: `${Math.min(100, yorPercent)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Dwelling Time */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Rata-rata Dwelling Time</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            2.3 <span className="text-xs font-normal text-slate-500">Hari</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Memenuhi standar nasional (2.8 hr)</span>
          </div>
        </div>

        {/* Metric 4: Armada Kapal & Produktivitas */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Armada Kapal Aktif</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {vessels.length} <span className="text-xs font-normal text-slate-500">Vessels</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
            <span className="font-semibold text-blue-700">{berthingVessels.length} Sandar</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">{sailingVessels.length} Berlayar</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Throughput Growth */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Tren Throughput Peti Kemas (TEUs)
              </h3>
              <p className="text-xs text-slate-500">Distribusi bulanan kargo Ekspor, Impor, dan Domestik</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
              Tahun 2026
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="export" name="Ekspor (TEU)" stroke="#2563eb" fillOpacity={1} fill="url(#colorExport)" />
                <Area type="monotone" dataKey="import" name="Impor (TEU)" stroke="#059669" fillOpacity={1} fill="url(#colorImport)" />
                <Area type="monotone" dataKey="domestic" name="Domestik (TEU)" stroke="#d97706" fill="#fef3c7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Container Types Pie */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Distribusi Tipe Peti Kemas
            </h3>
            <p className="text-xs text-slate-500">Komposisi muatan terminal aktif</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <strong className="text-slate-900">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yard Block Capacity Bars */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Kepadatan Blok Lapangan Penumpukan (Yard Capacity)
            </h3>
            <p className="text-xs text-slate-500">Monitoring kapasitas Blok A s/d F untuk pencegahan kongesti yard</p>
          </div>
          <button
            onClick={() => onNavigateTab('master')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Detail Blok</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={blockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="terisi" name="TEU Terisi" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sisa" name="Slot Tersedia" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Fleet Operational Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Ship className="w-4 h-4 text-blue-600" />
              Status Armada Kapal Pelayaran Realtime
            </h3>
            <p className="text-xs text-slate-500">Jadwal sandar, kecepatan berlayar, dan rute pelayaran</p>
          </div>
          <button
            onClick={() => onNavigateTab('tracking')}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Peta Digital</span>
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Kapal & IMO</th>
                <th className="py-3 px-4">Rute Pelayaran</th>
                <th className="py-3 px-4">Muatan / Kapasitas</th>
                <th className="py-3 px-4">Kecepatan</th>
                <th className="py-3 px-4">Status & Posisi</th>
                <th className="py-3 px-4">ETA / ETD</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {vessels.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{v.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{v.imoNumber} • {v.flag}</div>
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate">
                    {v.route}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{v.currentTeuLoad} / {v.teuCapacity} TEU</div>
                    <div className="w-24 bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-1 rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((v.currentTeuLoad / v.teuCapacity) * 100))}%` }} 
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {v.speedKnots > 0 ? (
                      <span className="text-emerald-700">{v.speedKnots} knots</span>
                    ) : (
                      <span className="text-slate-400">0.0 knots (Berth)</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      v.status.includes('Berthing') 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : v.status.includes('Sailing') 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                    {v.currentBerth && (
                      <div className="text-[10px] text-slate-500 mt-0.5">{v.currentBerth}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600">
                    <div>ETA: {v.eta}</div>
                    <div>ETD: {v.etd}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigateTab('tracking')}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      Lacak AIS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
