import React, { useState } from 'react';
import { 
  Boxes, 
  Ship, 
  Layers, 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { 
  Container, 
  Vessel, 
  YardBlock, 
  Customer, 
  ContainerSize, 
  ContainerType, 
  ContainerStatus 
} from '../types';

interface MasterDataViewProps {
  containers: Container[];
  vessels: Vessel[];
  yardBlocks: YardBlock[];
  customers: Customer[];
  onAddContainer: (data: Partial<Container>) => Promise<any>;
  onUpdateContainer: (id: string, data: Partial<Container>) => Promise<any>;
  onDeleteContainer: (id: string) => Promise<any>;
  onAddVessel: (data: Partial<Vessel>) => Promise<any>;
  onUpdateVessel: (id: string, data: Partial<Vessel>) => Promise<any>;
  onDeleteVessel: (id: string) => Promise<any>;
  onAddYardBlock: (data: Partial<YardBlock>) => Promise<any>;
  onUpdateYardBlock: (id: string, data: Partial<YardBlock>) => Promise<any>;
  onDeleteYardBlock: (id: string) => Promise<any>;
  onAddCustomer: (data: Partial<Customer>) => Promise<any>;
  onUpdateCustomer: (id: string, data: Partial<Customer>) => Promise<any>;
  onDeleteCustomer: (id: string) => Promise<any>;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  containers,
  vessels,
  yardBlocks,
  customers,
  onAddContainer,
  onUpdateContainer,
  onDeleteContainer,
  onAddVessel,
  onUpdateVessel,
  onDeleteVessel,
  onAddYardBlock,
  onUpdateYardBlock,
  onDeleteYardBlock,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}) => {
  const [activeTab, setActiveTab] = useState<'containers' | 'vessels' | 'yard' | 'customers'>('containers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete confirmation modal
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; name: string; type: string } | null>(null);

  // Form states for Container
  const [containerForm, setContainerForm] = useState<Partial<Container>>({
    containerNo: '',
    size: '40ft HC',
    type: 'Dry Container',
    shippingLine: 'PT Salam Pacific Indonesia Lines (SPIL)',
    status: 'Laden (Berisi)',
    maxGrossWeightKg: 30480,
    tareWeightKg: 3880,
    payloadKg: 26600,
    currentLocation: 'Blok A - Bay 04 - Row 02 - Tier 3',
    assignedShipper: '',
    isoCode: '45G1',
    sealNo: ''
  });

  // Form states for Vessel
  const [vesselForm, setVesselForm] = useState<Partial<Vessel>>({
    name: '',
    imoNumber: '',
    callSign: '',
    flag: 'Indonesia 🇮🇩',
    teuCapacity: 1000,
    currentTeuLoad: 0,
    loaMeter: 140,
    captain: '',
    route: 'Tanjung Priok - Tanjung Perak - Makassar',
    status: 'Berthing (Dermaga)',
    currentBerth: 'Dermaga 02',
    lat: -6.1025,
    lng: 106.8845,
    heading: 0,
    speedKnots: 0,
    eta: '2026-09-18 08:00',
    etd: '2026-09-19 16:00',
    originPort: 'Pelabuhan Tanjung Priok',
    nextPort: 'Pelabuhan Tanjung Perak'
  });

  // Form states for Customer
  const [customerForm, setCustomerForm] = useState<Partial<Customer>>({
    companyName: '',
    picName: '',
    whatsappNumber: '+628',
    email: '',
    address: '',
    city: 'Jakarta',
    creditTermDays: 30,
    activeBookingsCount: 0,
    category: 'Shipper'
  });

  // Form states for Yard Block
  const [yardForm, setYardForm] = useState<Partial<YardBlock>>({
    name: '',
    category: 'Dry General',
    totalBays: 12,
    rowsPerBay: 6,
    tiersPerBay: 4,
    totalCapacityTeu: 288,
    currentTeuOccupied: 0,
    isHazardous: false
  });

  // Filtered lists
  const filteredContainers = containers.filter(c => {
    const matchSearch = c.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shippingLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.assignedShipper && c.assignedShipper.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSize = filterSize === 'all' || c.size === filterSize;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchSize && matchStatus;
  });

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.imoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredYard = yardBlocks.filter(y =>
    y.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    y.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(c =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.picName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingItem(null);
    if (activeTab === 'containers') {
      setContainerForm({
        containerNo: `SPIL-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
        size: '40ft HC',
        type: 'Dry Container',
        shippingLine: 'PT Salam Pacific Indonesia Lines (SPIL)',
        status: 'Laden (Berisi)',
        maxGrossWeightKg: 30480,
        tareWeightKg: 3880,
        payloadKg: 26600,
        currentLocation: 'Blok A - Bay 06 - Row 02 - Tier 2',
        assignedShipper: 'PT Indofood Sukses Makmur Tbk',
        isoCode: '45G1',
        sealNo: `SL-${Math.floor(10000 + Math.random() * 90000)}`
      });
    } else if (activeTab === 'vessels') {
      setVesselForm({
        name: 'KM Nusantara Line 08',
        imoNumber: `IMO ${Math.floor(9000000 + Math.random() * 999999)}`,
        callSign: 'YDRT',
        flag: 'Indonesia 🇮🇩',
        teuCapacity: 1200,
        currentTeuLoad: 850,
        loaMeter: 145,
        captain: 'Capt. Bambang Santoso',
        route: 'Tanjung Priok - Belawan - Batam',
        status: 'Berthing (Dermaga)',
        currentBerth: 'Dermaga 03-A',
        lat: -6.1020,
        lng: 106.8840,
        heading: 0,
        speedKnots: 0,
        eta: '2026-09-18 10:00',
        etd: '2026-09-19 20:00',
        originPort: 'Pelabuhan Tanjung Priok',
        nextPort: 'Pelabuhan Belawan'
      });
    } else if (activeTab === 'customers') {
      setCustomerForm({
        companyName: '',
        picName: '',
        whatsappNumber: '+6281234567890',
        email: 'ops@logistik.com',
        address: 'Kawasan Industri MM2100, Cikarang Barat',
        city: 'Bekasi',
        creditTermDays: 30,
        activeBookingsCount: 5,
        category: 'Shipper'
      });
    } else if (activeTab === 'yard') {
      setYardForm({
        name: `Blok G (Depot Penumpukan Baru)`,
        category: 'Dry General',
        totalBays: 12,
        rowsPerBay: 6,
        tiersPerBay: 4,
        totalCapacityTeu: 288,
        currentTeuOccupied: 0,
        isHazardous: false
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setEditingItem(item);
    if (activeTab === 'containers') {
      setContainerForm({ ...item });
    } else if (activeTab === 'vessels') {
      setVesselForm({ ...item });
    } else if (activeTab === 'customers') {
      setCustomerForm({ ...item });
    } else if (activeTab === 'yard') {
      setYardForm({ ...item });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'containers') {
      if (modalMode === 'add') {
        await onAddContainer(containerForm);
      } else {
        await onUpdateContainer(editingItem.id, containerForm);
      }
    } else if (activeTab === 'vessels') {
      if (modalMode === 'add') {
        await onAddVessel(vesselForm);
      } else {
        await onUpdateVessel(editingItem.id, vesselForm);
      }
    } else if (activeTab === 'customers') {
      if (modalMode === 'add') {
        await onAddCustomer(customerForm);
      } else {
        await onUpdateCustomer(editingItem.id, customerForm);
      }
    } else if (activeTab === 'yard') {
      if (modalMode === 'add') {
        await onAddYardBlock(yardForm);
      } else {
        await onUpdateYardBlock(editingItem.id, yardForm);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem) return;
    const { id, type } = deleteConfirmItem;
    if (type === 'container') {
      await onDeleteContainer(id);
    } else if (type === 'vessel') {
      await onDeleteVessel(id);
    } else if (type === 'customer') {
      await onDeleteCustomer(id);
    } else if (type === 'yard') {
      await onDeleteYardBlock(id);
    }
    setDeleteConfirmItem(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Sub-Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            Modul Master Data Operasional Terminal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data terpusat Peti Kemas, Kapal Pelayaran, Blok Lapangan, dan Pelanggan dengan aksi CRUD lengkap.
          </p>
        </div>

        {/* Action Button */}
        <button
          id="btn-add-master-data"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'containers' ? 'Tambah Peti Kemas' :
             activeTab === 'vessels' ? 'Tambah Kapal' :
             activeTab === 'customers' ? 'Tambah Pelanggan' : 'Tambah Blok Yard'}
          </span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2 text-xs font-semibold overflow-x-auto shadow-xs">
        <button
          id="tab-master-containers"
          onClick={() => { setActiveTab('containers'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'containers'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Master Peti Kemas ({containers.length})</span>
        </button>

        <button
          id="tab-master-vessels"
          onClick={() => { setActiveTab('vessels'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'vessels'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>Master Kapal & Voyage ({vessels.length})</span>
        </button>

        <button
          id="tab-master-yard"
          onClick={() => { setActiveTab('yard'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'yard'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Master Blok Yard ({yardBlocks.length})</span>
        </button>

        <button
          id="tab-master-customers"
          onClick={() => { setActiveTab('customers'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'customers'
              ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Master Pelanggan & Shipper ({customers.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-b-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs -mt-5">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'containers' ? 'Cari no kontainer, pelayaran, shipper...' :
                activeTab === 'vessels' ? 'Cari nama kapal, nomor IMO, rute...' :
                activeTab === 'customers' ? 'Cari nama PT, PIC, kota...' : 'Cari nama blok...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {activeTab === 'containers' && (
          <div className="flex items-center gap-2">
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="all">Semua Ukuran</option>
              <option value="20ft">20ft</option>
              <option value="40ft">40ft</option>
              <option value="40ft HC">40ft HC</option>
              <option value="45ft">45ft</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="Laden (Berisi)">Laden (Berisi)</option>
              <option value="Empty">Empty</option>
              <option value="Damaged (Rusak)">Damaged (Rusak)</option>
            </select>
          </div>
        )}
      </div>

      {/* ======================================= */}
      {/* 1. MASTER PETI KEMAS TABLE */}
      {/* ======================================= */}
      {activeTab === 'containers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Peti Kemas & ISO</th>
                  <th className="py-3 px-4">Ukuran & Tipe</th>
                  <th className="py-3 px-4">Perusahaan Pelayaran</th>
                  <th className="py-3 px-4">Lokasi Saat Ini</th>
                  <th className="py-3 px-4">Berat Kotor / Payload</th>
                  <th className="py-3 px-4">Status & Segel</th>
                  <th className="py-3 px-4">Shipper / Penerima</th>
                  <th className="py-3 px-4 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredContainers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div>{c.containerNo}</div>
                      <div className="text-[10px] text-slate-500 font-sans font-normal">ISO: {c.isoCode || '45G1'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.size}</div>
                      <div className="text-[10px] text-slate-500">{c.type}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {c.shippingLine}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-medium border border-blue-200">
                        {c.currentLocation}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div>Max: {(c.maxGrossWeightKg / 1000).toFixed(1)} Ton</div>
                      <div className="text-[10px] text-slate-500">Payload: {(c.payloadKg / 1000).toFixed(1)} T</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status.includes('Laden') ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'Empty' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-800'
                      }`}>
                        {c.status}
                      </span>
                      {c.sealNo && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Seal: {c.sealNo}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 truncate max-w-[150px]">
                      {c.assignedShipper || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-edit-container-${c.id}`}
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ubah Data Peti Kemas"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-container-${c.id}`}
                          onClick={() => setDeleteConfirmItem({ id: c.id, name: c.containerNo, type: 'container' })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Peti Kemas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 2. MASTER KAPAL TABLE */}
      {/* ======================================= */}
      {activeTab === 'vessels' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Kapal & IMO</th>
                  <th className="py-3 px-4">Kapasitas TEU</th>
                  <th className="py-3 px-4">Panjang (LOA)</th>
                  <th className="py-3 px-4">Nahkoda (Captain)</th>
                  <th className="py-3 px-4">Rute Pelayaran</th>
                  <th className="py-3 px-4">Status & Posisi</th>
                  <th className="py-3 px-4 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredVessels.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{v.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{v.imoNumber} • {v.callSign}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {v.teuCapacity} TEU
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {v.loaMeter} Meter
                    </td>
                    <td className="py-3 px-4">
                      {v.captain}
                    </td>
                    <td className="py-3 px-4 max-w-[220px] truncate">
                      {v.route}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        v.status.includes('Berthing') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {v.status}
                      </span>
                      {v.currentBerth && (
                        <div className="text-[10px] text-slate-500 mt-0.5">{v.currentBerth}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ubah Kapal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmItem({ id: v.id, name: v.name, type: 'vessel' })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Kapal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 3. MASTER BLOK YARD TABLE */}
      {/* ======================================= */}
      {activeTab === 'yard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredYard.map((y) => {
            const pct = Math.round((y.currentTeuOccupied / y.totalCapacityTeu) * 100);
            return (
              <div key={y.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{y.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      y.isHazardous ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {y.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mt-3">
                    <div className="flex justify-between">
                      <span>Total Bay / Row / Tier:</span>
                      <strong className="text-slate-800 font-mono">{y.totalBays} Bay × {y.rowsPerBay} Row × {y.tiersPerBay} Tier</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Kapasitas:</span>
                      <strong className="text-slate-800">{y.totalCapacityTeu} TEU</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Saat ini Terisi:</span>
                      <strong className="text-blue-700 font-mono">{y.currentTeuOccupied} TEU ({pct}%)</strong>
                    </div>
                    {y.reeferPlugsAvailable && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Colokan Reefer:</span>
                        <strong>{y.reeferPlugsAvailable} Plugs Tersedia</strong>
                      </div>
                    )}
                  </div>

                  {/* Visual Yard Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${pct > 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(y)}
                    className="px-2.5 py-1 text-blue-700 hover:bg-blue-50 rounded-md text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ubah</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmItem({ id: y.id, name: y.name, type: 'yard' })}
                    className="px-2.5 py-1 text-red-700 hover:bg-red-50 rounded-md text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================= */}
      {/* 4. MASTER PELANGGAN TABLE */}
      {/* ======================================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Perusahaan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">PIC & Kontak</th>
                  <th className="py-3 px-4">Nomor WhatsApp Notifikasi</th>
                  <th className="py-3 px-4">Kota / Lokasi Gudang</th>
                  <th className="py-3 px-4">Credit Term</th>
                  <th className="py-3 px-4 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{cust.companyName}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{cust.address}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {cust.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{cust.picName}</div>
                      <div className="text-[10px] text-slate-500">{cust.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                      {cust.whatsappNumber}
                    </td>
                    <td className="py-3 px-4">
                      {cust.city}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {cust.creditTermDays} Hari
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ubah Pelanggan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmItem({ id: cust.id, name: cust.companyName, type: 'customer' })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Pelanggan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: TAMBAH / UBAH MASTER DATA */}
      {/* ======================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {modalMode === 'add' ? 'Tambah' : 'Ubah'} {
                  activeTab === 'containers' ? 'Peti Kemas' :
                  activeTab === 'vessels' ? 'Kapal Pelayaran' :
                  activeTab === 'customers' ? 'Pelanggan & Shipper' : 'Blok Lapangan'
                }
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Form Container */}
              {activeTab === 'containers' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor Peti Kemas (ISO 6346)
                    </label>
                    <input
                      type="text"
                      required
                      value={containerForm.containerNo}
                      onChange={(e) => setContainerForm({ ...containerForm, containerNo: e.target.value.toUpperCase() })}
                      placeholder="e.g. SPIL-892103-4"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Ukuran (Size)</label>
                      <select
                        value={containerForm.size}
                        onChange={(e) => setContainerForm({ ...containerForm, size: e.target.value as ContainerSize })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="20ft">20ft</option>
                        <option value="40ft">40ft</option>
                        <option value="40ft HC">40ft HC (High Cube)</option>
                        <option value="45ft">45ft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tipe Peti Kemas</label>
                      <select
                        value={containerForm.type}
                        onChange={(e) => setContainerForm({ ...containerForm, type: e.target.value as ContainerType })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Dry Container">Dry Container</option>
                        <option value="Reefer (Berpendingin)">Reefer (Berpendingin)</option>
                        <option value="Open Top">Open Top</option>
                        <option value="Flat Rack">Flat Rack</option>
                        <option value="ISO Tank">ISO Tank</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Perusahaan Pelayaran (Owner)</label>
                    <input
                      type="text"
                      required
                      value={containerForm.shippingLine}
                      onChange={(e) => setContainerForm({ ...containerForm, shippingLine: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Status Kargo</label>
                      <select
                        value={containerForm.status}
                        onChange={(e) => setContainerForm({ ...containerForm, status: e.target.value as ContainerStatus })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Laden (Berisi)">Laden (Berisi)</option>
                        <option value="Empty">Empty (Kosong)</option>
                        <option value="Damaged (Rusak)">Damaged (Rusak)</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nomor Segel (Seal No)</label>
                      <input
                        type="text"
                        value={containerForm.sealNo || ''}
                        onChange={(e) => setContainerForm({ ...containerForm, sealNo: e.target.value })}
                        placeholder="SL-SPIL-99201"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Max Gross (Kg)</label>
                      <input
                        type="number"
                        value={containerForm.maxGrossWeightKg}
                        onChange={(e) => setContainerForm({ ...containerForm, maxGrossWeightKg: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tare Weight (Kg)</label>
                      <input
                        type="number"
                        value={containerForm.tareWeightKg}
                        onChange={(e) => setContainerForm({ ...containerForm, tareWeightKg: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lokasi Lapangan / Kapal</label>
                    <input
                      type="text"
                      required
                      value={containerForm.currentLocation}
                      onChange={(e) => setContainerForm({ ...containerForm, currentLocation: e.target.value })}
                      placeholder="e.g. Blok A - Bay 04 - Row 02 - Tier 3"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Shipper / Penerima</label>
                    <input
                      type="text"
                      value={containerForm.assignedShipper || ''}
                      onChange={(e) => setContainerForm({ ...containerForm, assignedShipper: e.target.value })}
                      placeholder="PT Indofood Sukses Makmur Tbk"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {/* Form Vessel */}
              {activeTab === 'vessels' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Kapal (Vessel Name)</label>
                    <input
                      type="text"
                      required
                      value={vesselForm.name}
                      onChange={(e) => setVesselForm({ ...vesselForm, name: e.target.value })}
                      placeholder="KM Samudera Jaya 18"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nomor IMO</label>
                      <input
                        type="text"
                        required
                        value={vesselForm.imoNumber}
                        onChange={(e) => setVesselForm({ ...vesselForm, imoNumber: e.target.value })}
                        placeholder="IMO 9821490"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Call Sign</label>
                      <input
                        type="text"
                        value={vesselForm.callSign}
                        onChange={(e) => setVesselForm({ ...vesselForm, callSign: e.target.value })}
                        placeholder="YDYB"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kapasitas TEU</label>
                      <input
                        type="number"
                        required
                        value={vesselForm.teuCapacity}
                        onChange={(e) => setVesselForm({ ...vesselForm, teuCapacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Panjang LOA (Meter)</label>
                      <input
                        type="number"
                        value={vesselForm.loaMeter}
                        onChange={(e) => setVesselForm({ ...vesselForm, loaMeter: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nahkoda (Captain)</label>
                    <input
                      type="text"
                      value={vesselForm.captain}
                      onChange={(e) => setVesselForm({ ...vesselForm, captain: e.target.value })}
                      placeholder="Capt. Hendra Gunawan"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rute Pelayaran</label>
                    <input
                      type="text"
                      value={vesselForm.route}
                      onChange={(e) => setVesselForm({ ...vesselForm, route: e.target.value })}
                      placeholder="Tj. Priok ➔ Tj. Perak ➔ Makassar"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Status Kapal</label>
                      <select
                        value={vesselForm.status}
                        onChange={(e) => setVesselForm({ ...vesselForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Berthing (Dermaga)">Berthing (Dermaga)</option>
                        <option value="Sailing (Berlayar)">Sailing (Berlayar)</option>
                        <option value="Anchorage (Lego Jangkar)">Anchorage (Lego Jangkar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Dermaga Sandar</label>
                      <input
                        type="text"
                        value={vesselForm.currentBerth || ''}
                        onChange={(e) => setVesselForm({ ...vesselForm, currentBerth: e.target.value })}
                        placeholder="Dermaga 02"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Customer */}
              {activeTab === 'customers' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Perusahaan (PT/CV)</label>
                    <input
                      type="text"
                      required
                      value={customerForm.companyName}
                      onChange={(e) => setCustomerForm({ ...customerForm, companyName: e.target.value })}
                      placeholder="PT Indofood Sukses Makmur Tbk"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama PIC</label>
                      <input
                        type="text"
                        required
                        value={customerForm.picName}
                        onChange={(e) => setCustomerForm({ ...customerForm, picName: e.target.value })}
                        placeholder="Irwan Santoso"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                      <select
                        value={customerForm.category}
                        onChange={(e) => setCustomerForm({ ...customerForm, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Shipper">Shipper</option>
                        <option value="Consignee">Consignee</option>
                        <option value="Forwarder">Forwarder</option>
                        <option value="EMKL">EMKL</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp (Untuk Notifikasi Otomatis Realtime)
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.whatsappNumber}
                      onChange={(e) => setCustomerForm({ ...customerForm, whatsappNumber: e.target.value })}
                      placeholder="+6281234567890"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      required
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      placeholder="logistics@company.co.id"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Gudang / Kantor</label>
                    <textarea
                      rows={2}
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      placeholder="Kawasan Industri Cikarang Barat, Bekasi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {/* Form Yard Block */}
              {activeTab === 'yard' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Blok Lapangan</label>
                    <input
                      type="text"
                      required
                      value={yardForm.name}
                      onChange={(e) => setYardForm({ ...yardForm, name: e.target.value })}
                      placeholder="Blok G (Area Penumpukan Baru)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kategori Kargo</label>
                    <select
                      value={yardForm.category}
                      onChange={(e) => setYardForm({ ...yardForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Dry General">Dry General</option>
                      <option value="Reefer Area">Reefer Area</option>
                      <option value="Dangerous Cargo (DG)">Dangerous Cargo (DG)</option>
                      <option value="Empty Depot">Empty Depot</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bays</label>
                      <input
                        type="number"
                        value={yardForm.totalBays}
                        onChange={(e) => setYardForm({ ...yardForm, totalBays: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Rows/Bay</label>
                      <input
                        type="number"
                        value={yardForm.rowsPerBay}
                        onChange={(e) => setYardForm({ ...yardForm, rowsPerBay: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tiers/Bay</label>
                      <input
                        type="number"
                        value={yardForm.tiersPerBay}
                        onChange={(e) => setYardForm({ ...yardForm, tiersPerBay: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Kapasitas (TEU)</label>
                    <input
                      type="number"
                      required
                      value={yardForm.totalCapacityTeu}
                      onChange={(e) => setYardForm({ ...yardForm, totalCapacityTeu: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Simpan ke Real Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: HAPUS KONFIRMASI */}
      {/* ======================================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Konfirmasi Hapus Data
            </h3>
            <p className="text-xs text-slate-600 text-center mt-1">
              Apakah Anda yakin ingin menghapus data <strong>"{deleteConfirmItem.name}"</strong>? Aksi ini akan menghapus data secara permanen dari database.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
