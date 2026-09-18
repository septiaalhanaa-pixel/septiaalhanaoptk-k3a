import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Ship, 
  Truck, 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Anchor, 
  Layers, 
  Info,
  ExternalLink,
  ChevronRight,
  Radio
} from 'lucide-react';
import { Vessel, TruckTracking, Container } from '../types';

interface RealtimeTrackingMapProps {
  vessels: Vessel[];
  trucks: TruckTracking[];
  containers: Container[];
  onOpenNotifications: () => void;
}

// Major ports in Indonesia with calibrated SVG coordinates
const INDONESIA_PORTS = [
  { id: 'priok', name: 'Tj. Priok (Jakarta)', code: 'IDTPP', x: 265, y: 310, lat: -6.10, lng: 106.88, berthing: 2 },
  { id: 'perak', name: 'Tj. Perak (Surabaya)', code: 'IDSUB', x: 420, y: 345, lat: -7.20, lng: 112.73, berthing: 1 },
  { id: 'belawan', name: 'Belawan (Medan)', code: 'IDBLW', x: 95, y: 135, lat: 3.78, lng: 98.68, berthing: 1 },
  { id: 'makassar', name: 'Makassar (Soekarno Hatta)', code: 'IDMAK', x: 575, y: 315, lat: -5.12, lng: 119.41, berthing: 1 },
  { id: 'batam', name: 'Batam (Batu Ampar)', code: 'IDBTM', x: 215, y: 195, lat: 1.15, lng: 104.00, berthing: 0 },
  { id: 'semarang', name: 'Tj. Emas (Semarang)', code: 'IDSRG', x: 365, y: 335, lat: -6.95, lng: 110.42, berthing: 0 },
  { id: 'balikpapan', name: 'Semayang (Balikpapan)', code: 'IDBPN', x: 505, y: 225, lat: -1.26, lng: 116.83, berthing: 0 },
  { id: 'bitung', name: 'Bitung (Manado)', code: 'IDBIT', x: 670, y: 155, lat: 1.44, lng: 125.18, berthing: 0 },
];

export const RealtimeTrackingMap: React.FC<RealtimeTrackingMapProps> = ({
  vessels,
  trucks,
  containers,
  onOpenNotifications
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(vessels[0] || null);
  const [selectedTruck, setSelectedTruck] = useState<TruckTracking | null>(null);
  const [filterLayer, setFilterLayer] = useState<'all' | 'vessels' | 'trucks'>('all');
  const [isSimulating, setIsSimulating] = useState(true);
  const [simStep, setSimStep] = useState(0);

  // Simulation loop for moving ships and trucks smoothly
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, [isSimulating]);

  // Interpolate vessel positions based on simulation
  const animatedVessels = vessels.map((v, idx) => {
    if (v.status.includes('Berthing') || v.status.includes('Anchorage')) {
      return { ...v, animX: idx === 0 ? 265 : 575, animY: idx === 0 ? 305 : 315 };
    }
    // Sailing vessels move along maritime corridors
    if (v.name.includes('Meratus')) {
      // Surabaya -> Banjarmasin (Laut Jawa)
      const progress = ((simStep * 1.5 + idx * 30) % 100) / 100;
      const startX = 420, startY = 345;
      const endX = 470, endY = 240;
      return {
        ...v,
        animX: startX + (endX - startX) * progress,
        animY: startY + (endY - startY) * progress
      };
    } else {
      // Jakarta -> Belawan (Selat Bangka / Malaka)
      const progress = ((simStep * 1.2 + 20) % 100) / 100;
      const startX = 265, startY = 310;
      const endX = 95, endY = 135;
      return {
        ...v,
        animX: startX + (endX - startX) * progress,
        animY: startY + (endY - startY) * progress
      };
    }
  });

  // Animated truck positions (Delivery to factory)
  const animatedTrucks = trucks.map((t, idx) => {
    const progress = ((simStep * 2 + idx * 40) % 100) / 100;
    // Trucks near Jakarta / Tangerang / Surabaya
    const startX = 265, startY = 310;
    const endX = 240 + idx * 25, endY = 330 + idx * 10;
    return {
      ...t,
      animX: startX + (endX - startX) * progress,
      animY: startY + (endY - startY) * progress,
      currentProgress: Math.round(progress * 100)
    };
  });

  const handleSelectContainerSearch = () => {
    const matched = containers.find(c => c.containerNo.toLowerCase().includes(searchTerm.toLowerCase()));
    if (matched) {
      if (matched.currentVesselId) {
        const ves = vessels.find(v => v.id === matched.currentVesselId);
        if (ves) {
          setSelectedVessel(ves);
          setSelectedTruck(null);
        }
      } else {
        const trk = trucks.find(t => t.containerNo === matched.containerNo);
        if (trk) {
          setSelectedTruck(trk);
          setSelectedVessel(null);
        }
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              Integrasi Peta Digital & Pelacakan Maritim Realtime
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem Pemantauan Terpadu AIS Kapal Pelayaran, Telematics Truk Kontainer, dan Status Pelabuhan Utama Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer Filters */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterLayer('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterLayer === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterLayer('vessels')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                filterLayer === 'vessels' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Kapal AIS</span>
            </button>
            <button
              onClick={() => setFilterLayer('trucks')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                filterLayer === 'trucks' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Truk Logistik</span>
            </button>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSimulating ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Toggle Simulasi Pergerakan Realtime"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSimulating ? 'Live AIS' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Nautical GIS Digital Map */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 shadow-lg p-4 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Nautical Grid & Title Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 text-white max-w-xs shadow-md">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-0.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>AIS Vessel Traffic Service (VTS)</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              Peta Alur Laut Kepulauan Indonesia (ALKI)
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Pusat Kendali: Dermaga Tanjung Priok (-6.10° S, 106.88° E)
            </div>
          </div>

          {/* Search Container Floating on Map */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700 max-w-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Lacak No. Peti Kemas..."
              className="bg-slate-800 text-white px-2.5 py-1 text-xs rounded-md border border-slate-700 outline-none w-40 font-mono"
            />
            <button
              onClick={handleSelectContainerSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md cursor-pointer"
              title="Cari Posisi Peti Kemas"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Map of Indonesian Archipelago Waters */}
          <div className="relative w-full h-[400px] flex items-center justify-center my-auto">
            <svg
              viewBox="0 0 800 480"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.05))' }}
            >
              <defs>
                {/* Nautical Sea Background Gradient */}
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#081426" />
                  <stop offset="100%" stopColor="#030811" />
                </linearGradient>

                {/* Landmass Fill */}
                <pattern id="nauticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
                </pattern>
              </defs>

              {/* Ocean Canvas with Grid */}
              <rect width="800" height="480" fill="url(#oceanGrad)" rx="8" />
              <rect width="800" height="480" fill="url(#nauticalGrid)" />

              {/* Archipelago Landmass Silhouettes (Sumatra, Java, Kalimantan, Sulawesi, Papua outline stylized) */}
              <g fill="#1e293b" stroke="#334155" strokeWidth="1.2" opacity="0.85">
                {/* Sumatra */}
                <path d="M 60,80 L 110,60 L 150,110 L 220,200 L 255,270 L 235,285 L 180,240 L 120,180 L 70,120 Z" />
                {/* Java */}
                <path d="M 235,310 L 320,315 L 390,340 L 470,350 L 465,365 L 370,360 L 260,335 L 235,325 Z" />
                {/* Kalimantan */}
                <path d="M 360,140 L 460,110 L 520,160 L 530,230 L 480,270 L 400,270 L 350,220 L 350,160 Z" />
                {/* Sulawesi */}
                <path d="M 560,170 L 610,130 L 670,140 L 660,165 L 610,185 L 620,240 L 635,290 L 595,330 L 560,300 L 580,230 L 550,200 Z" />
                {/* Bali & Nusa Tenggara */}
                <path d="M 480,355 L 530,365 L 600,370 L 650,375 L 645,385 L 520,380 Z" />
                {/* Maluku & Papua glimpse */}
                <path d="M 690,190 L 750,180 L 790,220 L 780,270 L 700,240 Z" />
              </g>

              {/* Shipping Lanes (Polylines with glowing dashes) */}
              <g stroke="#0284c7" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" fill="none">
                {/* Priok to Perak */}
                <path d="M 265,310 Q 340,300 420,345" />
                {/* Priok to Belawan */}
                <path d="M 265,310 Q 210,210 95,135" />
                {/* Perak to Banjarmasin / Balikpapan */}
                <path d="M 420,345 Q 460,280 505,225" />
                {/* Perak to Makassar */}
                <path d="M 420,345 Q 490,340 575,315" />
                {/* Makassar to Bitung */}
                <path d="M 575,315 Q 610,220 670,155" />
              </g>

              {/* Major Seaports Pins */}
              {INDONESIA_PORTS.map((port) => (
                <g key={port.id} className="cursor-pointer group">
                  <circle cx={port.x} cy={port.y} r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx={port.x} cy={port.y} r="2.5" fill="#38bdf8" />
                  <text
                    x={port.x + 8}
                    y={port.y + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    className="group-hover:fill-sky-400 font-bold"
                  >
                    {port.name}
                  </text>
                </g>
              ))}

              {/* Render Animated Vessels */}
              {(filterLayer === 'all' || filterLayer === 'vessels') &&
                animatedVessels.map((v) => {
                  const isSelected = selectedVessel?.id === v.id;
                  return (
                    <g
                      key={v.id}
                      onClick={() => { setSelectedVessel(v); setSelectedTruck(null); }}
                      className="cursor-pointer transition-all duration-300"
                    >
                      {/* Pulse circle for active vessel */}
                      <circle
                        cx={v.animX}
                        cy={v.animY}
                        r={isSelected ? 18 : 12}
                        fill={v.status.includes('Berthing') ? '#10b981' : '#38bdf8'}
                        fillOpacity="0.2"
                        className="animate-ping"
                      />
                      <circle
                        cx={v.animX}
                        cy={v.animY}
                        r={isSelected ? 10 : 7}
                        fill={isSelected ? '#f59e0b' : v.status.includes('Berthing') ? '#10b981' : '#0284c7'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Vessel Name Tag */}
                      <rect
                        x={v.animX - 35}
                        y={v.animY - 24}
                        width="70"
                        height="14"
                        rx="3"
                        fill="#0f172a"
                        fillOpacity="0.85"
                        stroke={isSelected ? '#f59e0b' : '#334155'}
                      />
                      <text
                        x={v.animX}
                        y={v.animY - 14}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="7.5"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {v.name.replace('KM ', '').substring(0, 10)}
                      </text>
                    </g>
                  );
                })}

              {/* Render Animated Trucks (Road Telematics) */}
              {(filterLayer === 'all' || filterLayer === 'trucks') &&
                animatedTrucks.map((t) => {
                  const isSelected = selectedTruck?.id === t.id;
                  return (
                    <g
                      key={t.id}
                      onClick={() => { setSelectedTruck(t); setSelectedVessel(null); }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={t.animX}
                        cy={t.animY}
                        r={isSelected ? 8 : 5}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <rect
                        x={t.animX - 25}
                        y={t.animY + 8}
                        width="50"
                        height="12"
                        rx="2"
                        fill="#0f172a"
                        stroke="#10b981"
                        strokeWidth="0.8"
                      />
                      <text
                        x={t.animX}
                        y={t.animY + 17}
                        textAnchor="middle"
                        fill="#10b981"
                        fontSize="6.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {t.truckPlateNo}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Map Footer Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Kapal Sandar (Dermaga)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Kapal Berlayar (Sailing)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Truk Pengantar Kargo</span>
              </span>
            </div>
            <div className="font-mono text-slate-500">
              Update AIS: <span className="text-emerald-400">1.2 detik lalu</span>
            </div>
          </div>
        </div>

        {/* Right: Telematics Detail & Container Journey Timeline */}
        <div className="space-y-4">
          {/* Selected Item Card */}
          {selectedVessel ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-blue-50 text-blue-700">
                      <Ship className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {selectedVessel.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {selectedVessel.imoNumber} • Call Sign: {selectedVessel.callSign}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedVessel.status.includes('Berthing') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedVessel.status}
                </span>
              </div>

              {/* Vessel Telemetry */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Kecepatan AIS:</span>
                  <strong className="font-mono text-slate-900">
                    {selectedVessel.speedKnots > 0 ? `${selectedVessel.speedKnots} Knots` : '0.0 (Tersandar)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Heading:</span>
                  <strong className="font-mono text-slate-900">{selectedVessel.heading}° Derajat</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Muatan Saat Ini:</span>
                  <strong className="text-blue-700 font-mono">
                    {selectedVessel.currentTeuLoad} / {selectedVessel.teuCapacity} TEU
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Panjang Kapal:</span>
                  <strong className="font-mono text-slate-900">{selectedVessel.loaMeter} Meter</strong>
                </div>
              </div>

              {/* Voyage Itinerary */}
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-slate-700">Rute Pelayaran Aktif:</div>
                <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-blue-950 font-medium">
                  {selectedVessel.route}
                </div>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                  <span>Asal: <strong>{selectedVessel.originPort}</strong></span>
                  <span>Tujuan: <strong>{selectedVessel.nextPort}</strong></span>
                </div>
              </div>

              {/* Nahkoda */}
              <div className="text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-3">
                <span>Nahkoda (Master):</span>
                <strong className="text-slate-900">{selectedVessel.captain}</strong>
              </div>
            </div>
          ) : selectedTruck ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-700">
                      <Truck className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base font-mono">
                      {selectedTruck.truckPlateNo}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supir: {selectedTruck.driverName} ({selectedTruck.driverPhone})
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {selectedTruck.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Muatan Peti Kemas:</span>
                  <strong className="font-mono text-blue-700">{selectedTruck.containerNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Penerima (Consignee):</span>
                  <strong className="text-slate-900">{selectedTruck.consigneeName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kecepatan GPS:</span>
                  <strong className="font-mono">{selectedTruck.speedKmh} km/jam</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Tiba (ETA):</span>
                  <strong className="text-emerald-700 font-bold">{selectedTruck.etaMinutes} Menit</strong>
                </div>
              </div>

              {/* Delivery Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Progres Pengantaran:</span>
                  <strong className="font-mono text-emerald-700">{selectedTruck.progressPercent}%</strong>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${selectedTruck.progressPercent}%` }} />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenNotifications}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Kirim Update WhatsApp ke Pelanggan</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Realtime Delivery Milestone Tracker */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Siklus Alur Peti Kemas (Milestone Tracking)
            </h4>

            <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
                <div className="font-semibold text-slate-900">Vessel Berthing & Discharge</div>
                <div className="text-[11px] text-slate-500">Peti kemas dibongkar oleh Quay Crane ke dermaga.</div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
                <div className="font-semibold text-slate-900">Yard Stacking & Cold Chain</div>
                <div className="text-[11px] text-slate-500">Penumpukan di Blok B (Reefer plugged suhu -18°C).</div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
                <div className="font-semibold text-slate-900">Customs Clearance (SPPB)</div>
                <div className="text-[11px] text-slate-500">Persetujuan Bea Cukai diterbitkan secara digital.</div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white animate-pulse">
                  <Truck className="w-2.5 h-2.5" />
                </span>
                <div className="font-semibold text-blue-700">Gate-Out & Delivery Truck On Road</div>
                <div className="text-[11px] text-slate-600">Truk sedang menuju ke gudang pelanggan (ETA: 35 mnt).</div>
              </div>

              <div className="relative opacity-60">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 text-white flex items-center justify-center ring-4 ring-white" />
                <div className="font-semibold text-slate-700">Proof of Delivery (POD)</div>
                <div className="text-[11px] text-slate-500">Konfirmasi serah terima di gudang consignee.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
