import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Truck, 
  Ship, 
  RotateCw, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  X,
  Zap,
  Clock,
  Weight,
  Send
} from 'lucide-react';
import { 
  GateTransaction, 
  StevedoringTransaction, 
  ShiftingTransaction, 
  Container, 
  Vessel,
  Customer
} from '../types';

interface TransactionsViewProps {
  gateTransactions: GateTransaction[];
  stevedoring: StevedoringTransaction[];
  shifting: ShiftingTransaction[];
  containers: Container[];
  vessels: Vessel[];
  customers: Customer[];
  onAddGateTransaction: (data: Partial<GateTransaction>) => Promise<any>;
  onUpdateGateTransaction: (id: string, data: Partial<GateTransaction>) => Promise<any>;
  onDeleteGateTransaction: (id: string) => Promise<any>;
  onAddStevedoring: (data: Partial<StevedoringTransaction>) => Promise<any>;
  onUpdateStevedoring: (id: string, data: Partial<StevedoringTransaction>) => Promise<any>;
  onDeleteStevedoring: (id: string) => Promise<any>;
  onAddShifting: (data: Partial<ShiftingTransaction>) => Promise<any>;
  onDeleteShifting: (id: string) => Promise<any>;
  onOpenNotifications: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  gateTransactions,
  stevedoring,
  shifting,
  containers,
  vessels,
  customers,
  onAddGateTransaction,
  onUpdateGateTransaction,
  onDeleteGateTransaction,
  onAddStevedoring,
  onUpdateStevedoring,
  onDeleteStevedoring,
  onAddShifting,
  onDeleteShifting,
  onOpenNotifications
}) => {
  const [activeTab, setActiveTab] = useState<'gate' | 'stevedoring' | 'shifting'>('gate');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddGateOpen, setIsAddGateOpen] = useState(false);
  const [isAddStevOpen, setIsAddStevOpen] = useState(false);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [eirModalItem, setEirModalItem] = useState<GateTransaction | null>(null);

  // Form Gate
  const [gateForm, setGateForm] = useState<Partial<GateTransaction>>({
    transactionType: 'Gate-In (Receiving)',
    containerNo: 'SPIL-892103-4',
    containerSize: '40ft HC',
    truckPlateNo: 'B 9812 UEN',
    driverName: 'Bambang Supriyanto',
    driverPhone: '+6281234567890',
    shippingLine: 'PT Salam Pacific Indonesia Lines (SPIL)',
    sealNo: 'SL-SPIL-88192',
    grossWeightKg: 28900,
    tareWeightKg: 3880,
    netWeightKg: 25020,
    conditionRemark: 'Baik / Good',
    yardSlotAssigned: 'Blok A - Bay 06 - Row 02 - Tier 2',
    gateLane: 'Gate-In Lane 02',
    status: 'Completed',
    customerName: 'PT Indofood Sukses Makmur Tbk'
  });

  // Form Stevedoring
  const [stevForm, setStevForm] = useState<Partial<StevedoringTransaction>>({
    vesselId: vessels[0]?.id || 'ves-01',
    vesselName: vessels[0]?.name || 'KM Samudera Jaya 18',
    voyageNo: 'VOY-2026/049A',
    operationType: 'Discharge (Bongkar)',
    containerNo: 'SMLU-662319-8',
    containerSize: '40ft',
    craneId: 'Quay Crane 01 (QC-01)',
    baySlotVessel: 'Bay 14-02-82',
    yardTargetSlot: 'Blok D-04-02-1',
    operatorName: 'Dedi Kurniawan',
    status: 'In Progress',
    weightTon: 24.5
  });

  // Form Shifting
  const [shiftForm, setShiftForm] = useState<Partial<ShiftingTransaction>>({
    containerNo: 'SPIL-892103-4',
    fromSlot: 'Blok A-04-02-01',
    toSlot: 'Blok A-06-03-02',
    equipmentUsed: 'RTG Crane 03',
    operator: 'Suparman',
    reason: 'Vessel Loading Sequence'
  });

  const handleSaveGate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddGateTransaction(gateForm);
    setIsAddGateOpen(false);
  };

  const handleSaveStev = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddStevedoring(stevForm);
    setIsAddStevOpen(false);
  };

  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddShifting(shiftForm);
    setIsAddShiftOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            Modul Transaksi Operasional Terminal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Eksekusi Gate-In / Gate-Out truk, bongkar muat kapal (Stevedoring), dan relokasi yard container dengan integrasi EIR otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'gate' && (
            <button
              onClick={() => setIsAddGateOpen(true)}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Transaksi Gate</span>
            </button>
          )}

          {activeTab === 'stevedoring' && (
            <button
              onClick={() => setIsAddStevOpen(true)}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Stevedoring Kapal</span>
            </button>
          )}

          {activeTab === 'shifting' && (
            <button
              onClick={() => setIsAddShiftOpen(true)}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Shifting Yard</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2 text-xs font-semibold overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('gate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'gate'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Gate-In & Gate-Out ({gateTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stevedoring')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'stevedoring'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>Bongkar Muat Kapal / Stevedoring ({stevedoring.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shifting')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'shifting'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>Yard Shifting & Relokasi ({shifting.length})</span>
        </button>
      </div>

      {/* ======================================= */}
      {/* 1. GATE TRANSACTIONS TABLE */}
      {/* ======================================= */}
      {activeTab === 'gate' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu & Tipe Gate</th>
                  <th className="py-3 px-4">No. Peti Kemas & Segel</th>
                  <th className="py-3 px-4">Truk & Driver</th>
                  <th className="py-3 px-4">Pelayaran & Shipper</th>
                  <th className="py-3 px-4">Timbang (Bruto / Netto)</th>
                  <th className="py-3 px-4">Slot Penumpukan</th>
                  <th className="py-3 px-4">EIR & Status</th>
                  <th className="py-3 px-4 text-center">Cetak EIR</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {gateTransactions.map((gt) => (
                  <tr key={gt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        gt.transactionType.includes('Gate-In')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {gt.transactionType}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{gt.timestamp}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">{gt.containerNo}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{gt.containerSize} • Seal: {gt.sealNo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{gt.truckPlateNo}</div>
                      <div className="text-[10px] text-slate-500">{gt.driverName}</div>
                    </td>
                    <td className="py-3 px-4 truncate max-w-[170px]">
                      <div className="font-medium text-slate-800">{gt.customerName}</div>
                      <div className="text-[10px] text-slate-500">{gt.shippingLine}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div>{(gt.grossWeightKg / 1000).toFixed(1)} T Bruto</div>
                      <div className="text-[10px] text-slate-500">{(gt.netWeightKg / 1000).toFixed(1)} T Muatan</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] border border-blue-200 font-semibold">
                        {gt.yardSlotAssigned}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-[11px] font-semibold text-blue-800">{gt.eirNumber}</div>
                      <span className="text-[10px] text-emerald-700 font-sans font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Gate Cleared
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setEirModalItem(gt)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                        title="Lihat & Cetak EIR (Equipment Interchange Receipt)"
                      >
                        <Printer className="w-3.5 h-3.5 text-blue-600" />
                        <span>EIR</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteGateTransaction(gt.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 2. STEVEDORING (BONGKAR MUAT) TABLE */}
      {/* ======================================= */}
      {activeTab === 'stevedoring' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Kapal & Voyage</th>
                  <th className="py-3 px-4">Operasi Bongkar/Muat</th>
                  <th className="py-3 px-4">No. Peti Kemas & Ukuran</th>
                  <th className="py-3 px-4">Alat (Quay Crane)</th>
                  <th className="py-3 px-4">Slot Bay Kapal</th>
                  <th className="py-3 px-4">Target Slot Yard</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {stevedoring.map((stv) => (
                  <tr key={stv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{stv.vesselName}</div>
                      <div className="text-[10px] text-slate-500 font-mono font-normal">{stv.voyageNo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stv.operationType.includes('Discharge')
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {stv.operationType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">{stv.containerNo}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{stv.containerSize} • {stv.weightTon} Ton</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {stv.craneId}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                      {stv.baySlotVessel}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] border border-slate-200">
                        {stv.yardTargetSlot}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {stv.operatorName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        stv.status === 'Finished' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800 animate-pulse'
                      }`}>
                        {stv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteStevedoring(stv.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Stevedoring"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 3. SHIFTING YARD TABLE */}
      {/* ======================================= */}
      {activeTab === 'shifting' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu Shifting</th>
                  <th className="py-3 px-4">No. Peti Kemas</th>
                  <th className="py-3 px-4">Dari Slot (Asal)</th>
                  <th className="py-3 px-4">Ke Slot (Tujuan)</th>
                  <th className="py-3 px-4">Alat Pemindah</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Alasan Shifting</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {shifting.map((shf) => (
                  <tr key={shf.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                      {shf.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {shf.containerNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-red-700 font-medium">
                      {shf.fromSlot}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-medium">
                      {shf.toSlot}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {shf.equipmentUsed}
                    </td>
                    <td className="py-3 px-4">
                      {shf.operator}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {shf.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteShifting(shf.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL INPUT GATE TRANSACTION */}
      {/* ======================================= */}
      {isAddGateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Input Transaksi Gate (In/Out)</h3>
              </div>
              <button
                onClick={() => setIsAddGateOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGate} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Transaksi</label>
                  <select
                    value={gateForm.transactionType}
                    onChange={(e) => setGateForm({ ...gateForm, transactionType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="Gate-In (Receiving)">Gate-In (Receiving Kargo)</option>
                    <option value="Gate-Out (Delivery)">Gate-Out (Delivery ke Pabrik)</option>
                    <option value="Empty Return">Empty Return (Depot)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jalur Gerbang (Lane)</label>
                  <select
                    value={gateForm.gateLane}
                    onChange={(e) => setGateForm({ ...gateForm, gateLane: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Gate-In Lane 01">Gate-In Lane 01 (Reefer Dedicated)</option>
                    <option value="Gate-In Lane 02">Gate-In Lane 02 (Dry Cargo)</option>
                    <option value="Gate-Out Lane 01">Gate-Out Lane 01</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Peti Kemas</label>
                  <input
                    type="text"
                    required
                    value={gateForm.containerNo}
                    onChange={(e) => setGateForm({ ...gateForm, containerNo: e.target.value.toUpperCase() })}
                    placeholder="SPIL-892103-4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ukuran</label>
                  <select
                    value={gateForm.containerSize}
                    onChange={(e) => setGateForm({ ...gateForm, containerSize: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                    <option value="40ft HC">40ft HC</option>
                    <option value="45ft">45ft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Polisi Truk</label>
                  <input
                    type="text"
                    required
                    value={gateForm.truckPlateNo}
                    onChange={(e) => setGateForm({ ...gateForm, truckPlateNo: e.target.value.toUpperCase() })}
                    placeholder="B 9812 UEN"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Supir & HP</label>
                  <input
                    type="text"
                    required
                    value={gateForm.driverName}
                    onChange={(e) => setGateForm({ ...gateForm, driverName: e.target.value })}
                    placeholder="Bambang Supriyanto"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Perusahaan Pelayaran</label>
                  <input
                    type="text"
                    required
                    value={gateForm.shippingLine}
                    onChange={(e) => setGateForm({ ...gateForm, shippingLine: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer / Shipper</label>
                  <input
                    type="text"
                    required
                    value={gateForm.customerName}
                    onChange={(e) => setGateForm({ ...gateForm, customerName: e.target.value })}
                    placeholder="PT Indofood Sukses Makmur Tbk"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Berat Bruto (Kg)</label>
                  <input
                    type="number"
                    value={gateForm.grossWeightKg}
                    onChange={(e) => {
                      const gross = Number(e.target.value);
                      const tare = gateForm.tareWeightKg || 3880;
                      setGateForm({ ...gateForm, grossWeightKg: gross, netWeightKg: gross - tare });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tare (Kg)</label>
                  <input
                    type="number"
                    value={gateForm.tareWeightKg}
                    onChange={(e) => setGateForm({ ...gateForm, tareWeightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Netto (Kg)</label>
                  <input
                    type="number"
                    readOnly
                    value={gateForm.netWeightKg}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg font-mono text-blue-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Segel (Seal No)</label>
                  <input
                    type="text"
                    value={gateForm.sealNo}
                    onChange={(e) => setGateForm({ ...gateForm, sealNo: e.target.value })}
                    placeholder="SL-SPIL-88192"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slot Yard Ditugaskan</label>
                  <input
                    type="text"
                    required
                    value={gateForm.yardSlotAssigned}
                    onChange={(e) => setGateForm({ ...gateForm, yardSlotAssigned: e.target.value })}
                    placeholder="Blok A - Bay 06 - Row 02 - Tier 2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-emerald-800"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Notifikasi otomatis WhatsApp akan langsung dikirimkan ke Pelanggan saat transaksi ini disimpan!
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddGateOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Selesaikan Gate-In & Terbitkan EIR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL INPUT STEVEDORING */}
      {/* ======================================= */}
      {isAddStevOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-600" />
                Input Bongkar Muat (Stevedoring)
              </h3>
              <button onClick={() => setIsAddStevOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStev} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kapal Sandar</label>
                <select
                  value={stevForm.vesselName}
                  onChange={(e) => setStevForm({ ...stevForm, vesselName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                >
                  {vessels.map(v => (
                    <option key={v.id} value={v.name}>{v.name} ({v.currentBerth || 'Dermaga'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Operasi</label>
                  <select
                    value={stevForm.operationType}
                    onChange={(e) => setStevForm({ ...stevForm, operationType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Discharge (Bongkar)">Discharge (Bongkar)</option>
                    <option value="Loading (Muat)">Loading (Muat)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quay Crane</label>
                  <select
                    value={stevForm.craneId}
                    onChange={(e) => setStevForm({ ...stevForm, craneId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Quay Crane 01 (QC-01)">Quay Crane 01</option>
                    <option value="Quay Crane 02 (QC-02)">Quay Crane 02</option>
                    <option value="Quay Crane 03 (QC-03)">Quay Crane 03</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. Peti Kemas</label>
                <input
                  type="text"
                  required
                  value={stevForm.containerNo}
                  onChange={(e) => setStevForm({ ...stevForm, containerNo: e.target.value.toUpperCase() })}
                  placeholder="SMLU-662319-8"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slot Bay Kapal</label>
                  <input
                    type="text"
                    required
                    value={stevForm.baySlotVessel}
                    onChange={(e) => setStevForm({ ...stevForm, baySlotVessel: e.target.value })}
                    placeholder="Bay 14-02-82"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Slot Lapangan</label>
                  <input
                    type="text"
                    required
                    value={stevForm.yardTargetSlot}
                    onChange={(e) => setStevForm({ ...stevForm, yardTargetSlot: e.target.value })}
                    placeholder="Blok D-04-02-1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Operator Crane</label>
                <input
                  type="text"
                  value={stevForm.operatorName}
                  onChange={(e) => setStevForm({ ...stevForm, operatorName: e.target.value })}
                  placeholder="Dedi Kurniawan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddStevOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Catat Pergerakan Crane
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL PRINT RESMI EIR (EQUIPMENT INTERCHANGE RECEIPT) */}
      {/* ======================================= */}
      {eirModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header Dokumen Resmi */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-black tracking-wider uppercase text-slate-900">
                  PT TERMINAL PETI KEMAS MARITIM INDONESIA
                </h3>
                <div className="text-[10px] text-slate-600">
                  Dermaga Peti Kemas Pelabuhan Nasional • Telp: (021) 4301122 • NPWP: 01.302.991.2-042.000
                </div>
                <div className="text-xs font-bold text-blue-900 mt-2">
                  EQUIPMENT INTERCHANGE RECEIPT (EIR)
                </div>
              </div>
              <div className="text-right font-mono text-[11px]">
                <div className="font-bold text-slate-900">{eirModalItem.eirNumber}</div>
                <div className="text-slate-500 text-[10px]">{eirModalItem.timestamp}</div>
              </div>
            </div>

            {/* Konten EIR */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] block">No. Peti Kemas / Size:</span>
                  <strong className="font-mono text-sm text-slate-900">{eirModalItem.containerNo}</strong>
                  <div className="text-[11px] text-slate-600">{eirModalItem.containerSize}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Nomor Segel (Seal):</span>
                  <strong className="font-mono text-sm text-slate-900">{eirModalItem.sealNo}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Perusahaan Pelayaran (Carrier):</span>
                  <strong className="text-slate-800">{eirModalItem.shippingLine}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Shipper / Consignee:</span>
                  <strong className="text-slate-800">{eirModalItem.customerName}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">No Polisi Truk / Driver:</span>
                  <strong className="text-slate-800">{eirModalItem.truckPlateNo} ({eirModalItem.driverName})</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Lokasi Penumpukan (Yard Slot):</span>
                  <strong className="font-mono text-blue-700">{eirModalItem.yardSlotAssigned}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Gross Weight</span>
                  <strong>{eirModalItem.grossWeightKg.toLocaleString()} Kg</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Tare Weight</span>
                  <strong>{eirModalItem.tareWeightKg.toLocaleString()} Kg</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Net Weight</span>
                  <strong className="text-emerald-700">{eirModalItem.netWeightKg.toLocaleString()} Kg</strong>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-600 border-t border-slate-200">
                <div>
                  <p>Petugas Timbang & Gate</p>
                  <div className="h-10 mt-1 flex items-center justify-center font-serif italic text-slate-400">
                    [Tanda Tangan Digital]
                  </div>
                  <p className="font-semibold text-slate-800">Gate Checker TOS</p>
                </div>
                <div>
                  <p>Supir Angkutan Truk</p>
                  <div className="h-10 mt-1 flex items-center justify-center font-serif italic text-slate-400">
                    [Telah Divalidasi]
                  </div>
                  <p className="font-semibold text-slate-800">{eirModalItem.driverName}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono">
                Sistem Validasi QR EIR: TOS-SEC-VERIFIED
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEirModalItem(null)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak EIR Resmi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
