import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  Sidebar, 
  ActiveTab 
} from './components/Sidebar';
import { 
  LoginModal 
} from './components/LoginModal';
import { 
  DatabaseModal 
} from './components/DatabaseModal';
import { 
  NotificationsModal 
} from './components/NotificationsModal';
import { 
  DashboardAnalytics 
} from './components/DashboardAnalytics';
import { 
  MasterDataView 
} from './components/MasterDataView';
import { 
  TransactionsView 
} from './components/TransactionsView';
import { 
  RealtimeTrackingMap 
} from './components/RealtimeTrackingMap';
import { 
  ReportsView 
} from './components/ReportsView';
import { 
  api 
} from './services/api';
import { 
  INITIAL_CONTAINERS, 
  INITIAL_VESSELS, 
  INITIAL_YARD_BLOCKS, 
  INITIAL_CUSTOMERS, 
  INITIAL_GATE_TRANSACTIONS, 
  INITIAL_STEVEDORING, 
  INITIAL_SHIFTING, 
  INITIAL_TRUCKS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DB_CONFIG 
} from './data/initialData';
import { 
  UserSession, 
  DatabaseConfig, 
  Container, 
  Vessel, 
  YardBlock, 
  Customer, 
  GateTransaction, 
  StevedoringTransaction, 
  ShiftingTransaction, 
  TruckTracking, 
  CustomerNotification 
} from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication state - default logged in as Admin Terminal for instant full preview
  const [user, setUser] = useState<UserSession | null>({
    id: 'usr-admin',
    name: 'Capt. Rian Suryadharma, M.Mar',
    email: 'admin@pelayaran.co.id',
    role: 'admin',
    company: 'PT Pelayaran Samudera Terminal TOS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Modal open states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Database Connection Configuration State
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(INITIAL_DB_CONFIG);

  // Domain Operational States
  const [containers, setContainers] = useState<Container[]>(INITIAL_CONTAINERS);
  const [vessels, setVessels] = useState<Vessel[]>(INITIAL_VESSELS);
  const [yardBlocks, setYardBlocks] = useState<YardBlock[]>(INITIAL_YARD_BLOCKS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [gateTransactions, setGateTransactions] = useState<GateTransaction[]>(INITIAL_GATE_TRANSACTIONS);
  const [stevedoring, setStevedoring] = useState<StevedoringTransaction[]>(INITIAL_STEVEDORING);
  const [shifting, setShifting] = useState<ShiftingTransaction[]>(INITIAL_SHIFTING);
  const [trucks, setTrucks] = useState<TruckTracking[]>(INITIAL_TRUCKS);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(INITIAL_NOTIFICATIONS);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data from API server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [cRes, vRes, yRes, custRes, gRes, sRes, shfRes, nRes, dbRes] = await Promise.allSettled([
          api.getContainers(),
          api.getVessels(),
          api.getYardBlocks(),
          api.getCustomers(),
          api.getGateTransactions(),
          api.getStevedoring(),
          api.getShifting(),
          api.getNotifications(),
          api.getDbConfig()
        ]);

        if (cRes.status === 'fulfilled' && cRes.value) setContainers(cRes.value);
        if (vRes.status === 'fulfilled' && vRes.value) setVessels(vRes.value);
        if (yRes.status === 'fulfilled' && yRes.value) setYardBlocks(yRes.value);
        if (custRes.status === 'fulfilled' && custRes.value) setCustomers(custRes.value);
        if (gRes.status === 'fulfilled' && gRes.value) setGateTransactions(gRes.value);
        if (sRes.status === 'fulfilled' && sRes.value) setStevedoring(sRes.value);
        if (shfRes.status === 'fulfilled' && shfRes.value) setShifting(shfRes.value);
        if (nRes.status === 'fulfilled' && nRes.value) setNotifications(nRes.value);
        if (dbRes.status === 'fulfilled' && dbRes.value) setDbConfig(dbRes.value);
      } catch (err) {
        console.warn('Using local fallback seed data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers for Login / Logout
  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoginModalOpen(true);
  };

  // Handlers for Database Configuration Update
  const handleSaveDbConfig = async (newConfig: Partial<DatabaseConfig>) => {
    setDbConfig(prev => ({ ...prev, ...newConfig }));
    try {
      const saved = await api.saveDbConfig(newConfig);
      if (saved) setDbConfig(saved);
    } catch (err) {
      console.warn('Error saving db config to server:', err);
    }
  };

  // ==========================================
  // CRUD ACTIONS: CONTAINERS
  // ==========================================
  const handleAddContainer = async (data: Partial<Container>) => {
    const newCont: Container = {
      id: `cnt-${Date.now()}`,
      containerNo: data.containerNo || `SPIL-${Math.floor(100000 + Math.random() * 900000)}-4`,
      size: data.size || '40ft HC',
      type: data.type || 'Dry Container',
      shippingLine: data.shippingLine || 'PT Salam Pacific Indonesia Lines (SPIL)',
      status: data.status || 'Laden (Berisi)',
      maxGrossWeightKg: data.maxGrossWeightKg || 30480,
      tareWeightKg: data.tareWeightKg || 3880,
      payloadKg: (data.maxGrossWeightKg || 30480) - (data.tareWeightKg || 3880),
      currentLocation: data.currentLocation || 'Blok A - Bay 04 - Row 02',
      assignedShipper: data.assignedShipper || 'PT Indofood Sukses Makmur Tbk',
      isoCode: data.isoCode || '45G1',
      sealNo: data.sealNo || `SL-${Math.floor(10000 + Math.random() * 90000)}`,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      entryDate: new Date().toISOString().split('T')[0]
    };
    setContainers(prev => [newCont, ...prev]);
    try {
      await api.createContainer(newCont);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleUpdateContainer = async (id: string, data: Partial<Container>) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, ...data, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) } : c));
    try {
      await api.updateContainer(id, data);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleDeleteContainer = async (id: string) => {
    setContainers(prev => prev.filter(c => c.id !== id));
    try {
      await api.deleteContainer(id);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  // ==========================================
  // CRUD ACTIONS: VESSELS
  // ==========================================
  const handleAddVessel = async (data: Partial<Vessel>) => {
    const newVessel: Vessel = {
      id: `ves-${Date.now()}`,
      name: data.name || 'KM Nusantara Line 99',
      imoNumber: data.imoNumber || 'IMO 9821900',
      callSign: data.callSign || 'YDRT',
      flag: data.flag || 'Indonesia 🇮🇩',
      teuCapacity: data.teuCapacity || 1000,
      currentTeuLoad: data.currentTeuLoad || 600,
      loaMeter: data.loaMeter || 140,
      captain: data.captain || 'Capt. Bambang Santoso',
      route: data.route || 'Tanjung Priok - Belawan',
      status: data.status || 'Berthing (Dermaga)',
      currentBerth: data.currentBerth || 'Dermaga 03',
      lat: data.lat || -6.1025,
      lng: data.lng || 106.8845,
      heading: data.heading || 0,
      speedKnots: data.speedKnots || 0,
      eta: data.eta || '2026-09-18 08:00',
      etd: data.etd || '2026-09-19 18:00',
      originPort: data.originPort || 'Pelabuhan Tanjung Priok',
      nextPort: data.nextPort || 'Pelabuhan Belawan'
    };
    setVessels(prev => [newVessel, ...prev]);
    try {
      await api.createVessel(newVessel);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleUpdateVessel = async (id: string, data: Partial<Vessel>) => {
    setVessels(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    try {
      await api.updateVessel(id, data);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleDeleteVessel = async (id: string) => {
    setVessels(prev => prev.filter(v => v.id !== id));
    try {
      await api.deleteVessel(id);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  // ==========================================
  // CRUD ACTIONS: YARD BLOCKS
  // ==========================================
  const handleAddYardBlock = async (data: Partial<YardBlock>) => {
    const newYard: YardBlock = {
      id: `yb-${Date.now()}`,
      name: data.name || 'Blok G (Area Baru)',
      category: data.category || 'Dry General',
      totalBays: data.totalBays || 12,
      rowsPerBay: data.rowsPerBay || 6,
      tiersPerBay: data.tiersPerBay || 4,
      totalCapacityTeu: data.totalCapacityTeu || 288,
      currentTeuOccupied: data.currentTeuOccupied || 0,
      isHazardous: !!data.isHazardous,
      reeferPlugsAvailable: data.reeferPlugsAvailable
    };
    setYardBlocks(prev => [...prev, newYard]);
    try {
      await api.createYardBlock(newYard);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleUpdateYardBlock = async (id: string, data: Partial<YardBlock>) => {
    setYardBlocks(prev => prev.map(y => y.id === id ? { ...y, ...data } : y));
    try {
      await api.updateYardBlock(id, data);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleDeleteYardBlock = async (id: string) => {
    setYardBlocks(prev => prev.filter(y => y.id !== id));
    try {
      await api.deleteYardBlock(id);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  // ==========================================
  // CRUD ACTIONS: CUSTOMERS
  // ==========================================
  const handleAddCustomer = async (data: Partial<Customer>) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      companyName: data.companyName || 'PT Logistik Makmur Nusantara',
      picName: data.picName || 'Bpk. Ahmad Suhendra',
      whatsappNumber: data.whatsappNumber || '+6281234567890',
      email: data.email || 'ops@makmur.com',
      address: data.address || 'Kawasan Industri MM2100',
      city: data.city || 'Bekasi',
      creditTermDays: data.creditTermDays || 30,
      activeBookingsCount: data.activeBookingsCount || 1,
      category: data.category || 'Shipper'
    };
    setCustomers(prev => [...prev, newCust]);
    try {
      await api.createCustomer(newCust);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleUpdateCustomer = async (id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    try {
      await api.updateCustomer(id, data);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    try {
      await api.deleteCustomer(id);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  // ==========================================
  // TRANSACTIONS: GATE, STEVEDORING, SHIFTING
  // ==========================================
  const handleAddGateTransaction = async (data: Partial<GateTransaction>) => {
    const newGate: GateTransaction = {
      id: `gt-${Date.now()}`,
      transactionType: data.transactionType || 'Gate-In (Receiving)',
      containerNo: data.containerNo || 'SPIL-892103-4',
      containerSize: data.containerSize || '40ft HC',
      truckPlateNo: data.truckPlateNo || 'B 9812 UEN',
      driverName: data.driverName || 'Bambang Supriyanto',
      driverPhone: data.driverPhone || '+6281234567890',
      shippingLine: data.shippingLine || 'PT Salam Pacific Indonesia Lines (SPIL)',
      sealNo: data.sealNo || 'SL-SPIL-88192',
      grossWeightKg: data.grossWeightKg || 28900,
      tareWeightKg: data.tareWeightKg || 3880,
      netWeightKg: data.netWeightKg || 25020,
      conditionRemark: data.conditionRemark || 'Baik / Good',
      yardSlotAssigned: data.yardSlotAssigned || 'Blok A - Bay 06 - Row 02 - Tier 2',
      gateLane: data.gateLane || 'Gate-In Lane 02',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eirNumber: `EIR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
      customerName: data.customerName || 'PT Indofood Sukses Makmur Tbk'
    };
    setGateTransactions(prev => [newGate, ...prev]);

    // Automatically trigger notification in local state too
    const newNotif: CustomerNotification = {
      id: `notif-${Date.now()}`,
      customerName: newGate.customerName,
      customerPhone: '+628129881029',
      customerEmail: 'ops@logistik.com',
      recipientName: newGate.customerName,
      recipientPhone: '+628129881029',
      recipientEmail: 'ops@logistik.com',
      channel: 'WhatsApp',
      eventType: 'GATE_IN_CONFIRMED',
      containerNo: newGate.containerNo,
      title: `Konfirmasi ${newGate.transactionType} Peti Kemas`,
      message: `Peti kemas ${newGate.containerNo} telah selesai diproses di ${newGate.gateLane}. EIR: ${newGate.eirNumber}. Alokasi Yard: ${newGate.yardSlotAssigned}.`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Delivered',
      whatsappLink: `https://wa.me/628129881029?text=${encodeURIComponent(`Konfirmasi ${newGate.containerNo} EIR ${newGate.eirNumber}`)}`
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      await api.createGateTransaction(newGate);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleUpdateGateTransaction = async (id: string, data: Partial<GateTransaction>) => {
    setGateTransactions(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  const handleDeleteGateTransaction = async (id: string) => {
    setGateTransactions(prev => prev.filter(g => g.id !== id));
    try {
      await api.deleteGateTransaction(id);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleAddStevedoring = async (data: Partial<StevedoringTransaction>) => {
    const newStev: StevedoringTransaction = {
      id: `stv-${Date.now()}`,
      vesselId: data.vesselId || 'ves-01',
      vesselName: data.vesselName || 'KM Samudera Jaya 18',
      voyageNo: data.voyageNo || 'VOY-2026/049A',
      operationType: data.operationType || 'Discharge (Bongkar)',
      containerNo: data.containerNo || 'SMLU-662319-8',
      containerSize: data.containerSize || '40ft',
      craneId: data.craneId || 'Quay Crane 01 (QC-01)',
      baySlotVessel: data.baySlotVessel || 'Bay 14-02-82',
      yardTargetSlot: data.yardTargetSlot || 'Blok D-04-02-1',
      operatorName: data.operatorName || 'Dedi Kurniawan',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'In Progress',
      weightTon: data.weightTon || 24.5
    };
    setStevedoring(prev => [newStev, ...prev]);
    try {
      await api.createStevedoring(newStev);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleUpdateStevedoring = async (id: string, data: Partial<StevedoringTransaction>) => {
    setStevedoring(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const handleDeleteStevedoring = async (id: string) => {
    setStevedoring(prev => prev.filter(s => s.id !== id));
  };

  const handleAddShifting = async (data: Partial<ShiftingTransaction>) => {
    const newShift: ShiftingTransaction = {
      id: `shf-${Date.now()}`,
      containerNo: data.containerNo || 'SPIL-892103-4',
      fromSlot: data.fromSlot || 'Blok A-04-02-01',
      toSlot: data.toSlot || 'Blok A-06-03-02',
      equipmentUsed: data.equipmentUsed || 'RTG Crane 03',
      operator: data.operator || 'Suparman',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason: data.reason || 'Vessel Loading Sequence'
    };
    setShifting(prev => [newShift, ...prev]);
    try {
      await api.createShifting(newShift);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  const handleDeleteShifting = async (id: string) => {
    setShifting(prev => prev.filter(s => s.id !== id));
  };

  // Notification Manual Sender
  const handleSendManualNotification = async (notifData: Partial<CustomerNotification>) => {
    const newNotif: CustomerNotification = {
      id: `notif-${Date.now()}`,
      customerName: notifData.customerName || notifData.recipientName || 'Pelanggan',
      customerPhone: notifData.customerPhone || notifData.recipientPhone || '+6281234567890',
      customerEmail: notifData.customerEmail || notifData.recipientEmail || 'ops@customer.com',
      recipientName: notifData.recipientName || notifData.customerName || 'Pelanggan',
      recipientPhone: notifData.recipientPhone || notifData.customerPhone || '+6281234567890',
      recipientEmail: notifData.recipientEmail || notifData.customerEmail || 'ops@customer.com',
      channel: notifData.channel || 'WhatsApp',
      eventType: notifData.eventType || 'GATE_OUT_DELIVERY',
      containerNo: notifData.containerNo || 'SPIL-892103-4',
      title: notifData.title || 'Notifikasi Status Peti Kemas',
      message: notifData.message || 'Peti kemas Anda dalam perjalanan.',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Delivered',
      whatsappLink: `https://wa.me/${(notifData.customerPhone || '6281234567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(notifData.message || '')}`
    };
    setNotifications(prev => [newNotif, ...prev]);
    try {
      await api.createNotification(newNotif);
    } catch (e) {
      console.warn('API error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        dbConfig={dbConfig}
        unreadNotifsCount={notifications.length}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenDatabaseModal={() => setIsDbModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onResetData={async () => {
          setIsLoading(true);
          try {
            await api.resetDatabase();
            const [c, v, y, cust, g, s, shf, n] = await Promise.all([
              api.getContainers(),
              api.getVessels(),
              api.getYardBlocks(),
              api.getCustomers(),
              api.getGateTransactions(),
              api.getStevedoring(),
              api.getShifting(),
              api.getNotifications()
            ]);
            setContainers(c);
            setVessels(v);
            setYardBlocks(y);
            setCustomers(cust);
            setGateTransactions(g);
            setStevedoring(s);
            setShifting(shf);
            setNotifications(n);
          } catch (e) {
            console.warn('Reset error:', e);
          } finally {
            setIsLoading(false);
          }
        }}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onTabChange={(tab: ActiveTab) => {
            if (tab === 'notifications') {
              setIsNotificationsModalOpen(true);
            } else if (tab === 'database') {
              setIsDbModalOpen(true);
            } else {
              setActiveTab(tab);
            }
            setIsSidebarOpen(false);
          }}
          stats={{
            totalContainers: containers.length,
            activeVessels: vessels.filter(v => v.status.includes('Berthing')).length,
            pendingGate: gateTransactions.filter(g => g.status === 'Pending').length,
            unreadNotifs: notifications.length
          }}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-4 text-xs text-slate-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Sinkronisasi database operasional maritim...</span>
            </div>
          )}

          {/* Render Active View */}
          {activeTab === 'dashboard' && (
            <DashboardAnalytics
              containers={containers}
              vessels={vessels}
              yardBlocks={yardBlocks}
              gateTransactions={gateTransactions}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddContainer={() => {
                setActiveTab('master');
              }}
              onOpenGateIn={() => {
                setActiveTab('transactions');
              }}
            />
          )}

          {activeTab === 'master' && (
            <MasterDataView
              containers={containers}
              vessels={vessels}
              yardBlocks={yardBlocks}
              customers={customers}
              onAddContainer={handleAddContainer}
              onUpdateContainer={handleUpdateContainer}
              onDeleteContainer={handleDeleteContainer}
              onAddVessel={handleAddVessel}
              onUpdateVessel={handleUpdateVessel}
              onDeleteVessel={handleDeleteVessel}
              onAddYardBlock={handleAddYardBlock}
              onUpdateYardBlock={handleUpdateYardBlock}
              onDeleteYardBlock={handleDeleteYardBlock}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              gateTransactions={gateTransactions}
              stevedoring={stevedoring}
              shifting={shifting}
              containers={containers}
              vessels={vessels}
              customers={customers}
              onAddGateTransaction={handleAddGateTransaction}
              onUpdateGateTransaction={handleUpdateGateTransaction}
              onDeleteGateTransaction={handleDeleteGateTransaction}
              onAddStevedoring={handleAddStevedoring}
              onUpdateStevedoring={handleUpdateStevedoring}
              onDeleteStevedoring={handleDeleteStevedoring}
              onAddShifting={handleAddShifting}
              onDeleteShifting={handleDeleteShifting}
              onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            />
          )}

          {activeTab === 'tracking' && (
            <RealtimeTrackingMap
              vessels={vessels}
              trucks={trucks}
              containers={containers}
              onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              containers={containers}
              vessels={vessels}
              gateTransactions={gateTransactions}
              stevedoring={stevedoring}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLoginApi={api.login}
      />

      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        config={dbConfig}
        onSaveConfig={handleSaveDbConfig}
        onTestConnection={api.testConnection}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        customers={customers}
        onSendManualNotification={handleSendManualNotification}
      />
    </div>
  );
}
