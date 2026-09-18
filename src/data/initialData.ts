import { Container, Vessel, YardBlock, Customer, GateTransaction, StevedoringTransaction, ShiftingTransaction, CustomerNotification, TruckTracking, DatabaseConfig } from '../types';

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'cnt-01',
    containerNo: 'SPIL-892103-4',
    size: '40ft HC',
    type: 'Dry Container',
    shippingLine: 'PT Salam Pacific Indonesia Lines (SPIL)',
    status: 'Laden (Berisi)',
    maxGrossWeightKg: 30480,
    tareWeightKg: 3880,
    payloadKg: 26600,
    currentLocation: 'Blok A - Bay 04 - Row 02 - Tier 3',
    assignedShipper: 'PT Indofood Sukses Makmur Tbk',
    lastUpdated: '2026-09-17 19:40:00',
    isoCode: '45G1',
    sealNo: 'SL-SPIL-99201'
  },
  {
    id: 'cnt-02',
    containerNo: 'MRTS-441209-1',
    size: '20ft',
    type: 'Reefer (Berpendingin)',
    shippingLine: 'PT Meratus Line',
    status: 'Laden (Berisi)',
    maxGrossWeightKg: 24000,
    tareWeightKg: 2850,
    payloadKg: 21150,
    currentLocation: 'Blok B - Bay 02 - Row 01 - Tier 2 (Plugged)',
    assignedShipper: 'PT Charoen Pokphand Indonesia',
    lastUpdated: '2026-09-17 20:15:00',
    isoCode: '22R1',
    sealNo: 'SL-MRTS-77124'
  },
  {
    id: 'cnt-03',
    containerNo: 'SMLU-662319-8',
    size: '40ft',
    type: 'Dry Container',
    shippingLine: 'PT Samudera Indonesia Tbk',
    status: 'Laden (Berisi)',
    maxGrossWeightKg: 30480,
    tareWeightKg: 3750,
    payloadKg: 26730,
    currentLocation: 'Di Atas Kapal KM Samudera Jaya',
    currentVesselId: 'ves-01',
    assignedShipper: 'PT Unilever Indonesia Tbk',
    lastUpdated: '2026-09-17 18:30:00',
    isoCode: '42G1',
    sealNo: 'SL-SMDR-44390'
  },
  {
    id: 'cnt-04',
    containerNo: 'TMLU-110294-5',
    size: '20ft',
    type: 'Dry Container',
    shippingLine: 'PT Temas Line Tbk',
    status: 'Empty',
    maxGrossWeightKg: 24000,
    tareWeightKg: 2200,
    payloadKg: 0,
    currentLocation: 'Blok E - Bay 06 - Row 04 - Tier 4',
    assignedShipper: 'PT Temas Depot Services',
    lastUpdated: '2026-09-17 15:10:00',
    isoCode: '22G1'
  },
  {
    id: 'cnt-05',
    containerNo: 'MSKU-993144-0',
    size: '40ft HC',
    type: 'Dry Container',
    shippingLine: 'Maersk Line Indonesia',
    status: 'Laden (Berisi)',
    maxGrossWeightKg: 32500,
    tareWeightKg: 3900,
    payloadKg: 28600,
    currentLocation: 'Blok C - Bay 08 - Row 03 - Tier 2',
    assignedShipper: 'PT Mayora Indah Tbk',
    lastUpdated: '2026-09-17 17:25:00',
    isoCode: '45G1',
    sealNo: 'SL-MSK-88219'
  },
  {
    id: 'cnt-06',
    containerNo: 'SPIL-338291-7',
    size: '20ft',
    type: 'ISO Tank',
    shippingLine: 'PT Salam Pacific Indonesia Lines (SPIL)',
    status: 'Laden (Berisi)',
    maxGrossWeightKg: 26000,
    tareWeightKg: 3400,
    payloadKg: 22600,
    currentLocation: 'Blok F - Bay 01 - Row 02 - Tier 1 (Hazardous Zone)',
    assignedShipper: 'PT Wilmar Nabati Indonesia',
    lastUpdated: '2026-09-17 14:00:00',
    isoCode: '22T6',
    sealNo: 'SL-SPIL-55102'
  },
  {
    id: 'cnt-07',
    containerNo: 'TNTO-772910-3',
    size: '40ft',
    type: 'Open Top',
    shippingLine: 'PT Tanto Intim Lines',
    status: 'Damaged (Rusak)',
    maxGrossWeightKg: 30480,
    tareWeightKg: 4100,
    payloadKg: 18000,
    currentLocation: 'Area Maintenance & Repair (M&R)',
    assignedShipper: 'PT Astra Otoparts Tbk',
    lastUpdated: '2026-09-17 12:20:00',
    isoCode: '42U1'
  }
];

export const INITIAL_VESSELS: Vessel[] = [
  {
    id: 'ves-01',
    name: 'KM Samudera Jaya 18',
    imoNumber: 'IMO 9821490',
    callSign: 'YDYB',
    flag: 'Indonesia 🇮🇩',
    teuCapacity: 1250,
    currentTeuLoad: 980,
    loaMeter: 148,
    captain: 'Capt. Bambang Suryadi, M.Mar',
    route: 'Tj. Priok (Jakarta) ➔ Tj. Perak (Surabaya) ➔ Makassar',
    status: 'Berthing (Dermaga)',
    currentBerth: 'Dermaga 02 - Kade Meter 150-300',
    lat: -6.1025,
    lng: 106.8845,
    heading: 45,
    speedKnots: 0,
    eta: '2026-09-17 06:00',
    etd: '2026-09-18 18:00',
    originPort: 'Pelabuhan Tanjung Priok (Jakarta)',
    nextPort: 'Pelabuhan Tanjung Perak (Surabaya)'
  },
  {
    id: 'ves-02',
    name: 'MV Meratus Borneo',
    imoNumber: 'IMO 9734120',
    callSign: 'YDRK',
    flag: 'Indonesia 🇮🇩',
    teuCapacity: 850,
    currentTeuLoad: 720,
    loaMeter: 132,
    captain: 'Capt. Hendra Gunawan',
    route: 'Tj. Perak (Surabaya) ➔ Banjarmasin ➔ Balikpapan',
    status: 'Sailing (Berlayar)',
    lat: -5.4500,
    lng: 113.8200, // Laut Jawa tengah
    heading: 32,
    speedKnots: 14.8,
    eta: '2026-09-18 10:30',
    etd: '2026-09-17 04:00',
    originPort: 'Pelabuhan Tanjung Perak',
    nextPort: 'Pelabuhan Trisakti (Banjarmasin)'
  },
  {
    id: 'ves-03',
    name: 'KM SPIL Nirmala',
    imoNumber: 'IMO 9642019',
    callSign: 'YDPO',
    flag: 'Indonesia 🇮🇩',
    teuCapacity: 1600,
    currentTeuLoad: 1420,
    loaMeter: 172,
    captain: 'Capt. Agus Prasetyo',
    route: 'Tj. Priok ➔ Belawan (Medan) ➔ Batam',
    status: 'Sailing (Berlayar)',
    lat: -3.2000,
    lng: 106.5000, // Selat Bangka / Laut Natuna
    heading: 340,
    speedKnots: 16.2,
    eta: '2026-09-19 07:00',
    etd: '2026-09-17 14:00',
    originPort: 'Pelabuhan Tanjung Priok',
    nextPort: 'Pelabuhan Belawan (Medan)'
  },
  {
    id: 'ves-04',
    name: 'KM Temas Fortune',
    imoNumber: 'IMO 9801243',
    callSign: 'YDTM',
    flag: 'Indonesia 🇮🇩',
    teuCapacity: 1100,
    currentTeuLoad: 650,
    loaMeter: 140,
    captain: 'Capt. Rahmat Hidayat',
    route: 'Makassar ➔ Bitung (Manado) ➔ Ambon',
    status: 'Anchorage (Lego Jangkar)',
    lat: -5.1150,
    lng: 119.3800,
    heading: 180,
    speedKnots: 0.1,
    eta: '2026-09-17 15:00',
    etd: '2026-09-18 08:00',
    originPort: 'Pelabuhan Soekarno-Hatta (Makassar)',
    nextPort: 'Pelabuhan Bitung'
  }
];

export const INITIAL_YARD_BLOCKS: YardBlock[] = [
  {
    id: 'yard-a',
    name: 'Blok A (Dry Domestic)',
    category: 'Dry General',
    totalBays: 16,
    rowsPerBay: 6,
    tiersPerBay: 4,
    totalCapacityTeu: 384,
    currentTeuOccupied: 295,
    isHazardous: false
  },
  {
    id: 'yard-b',
    name: 'Blok B (Reefer Cold Chain)',
    category: 'Reefer Area',
    totalBays: 8,
    rowsPerBay: 4,
    tiersPerBay: 3,
    totalCapacityTeu: 96,
    currentTeuOccupied: 72,
    reeferPlugsAvailable: 24,
    temperatureTarget: -18,
    isHazardous: false
  },
  {
    id: 'yard-c',
    name: 'Blok C (Export Cargo)',
    category: 'Dry General',
    totalBays: 14,
    rowsPerBay: 6,
    tiersPerBay: 4,
    totalCapacityTeu: 336,
    currentTeuOccupied: 260,
    isHazardous: false
  },
  {
    id: 'yard-d',
    name: 'Blok D (Import Staging)',
    category: 'Dry General',
    totalBays: 12,
    rowsPerBay: 6,
    tiersPerBay: 4,
    totalCapacityTeu: 288,
    currentTeuOccupied: 210,
    isHazardous: false
  },
  {
    id: 'yard-e',
    name: 'Blok E (Empty Container Depot)',
    category: 'Empty Depot',
    totalBays: 10,
    rowsPerBay: 6,
    tiersPerBay: 5,
    totalCapacityTeu: 300,
    currentTeuOccupied: 190,
    isHazardous: false
  },
  {
    id: 'yard-f',
    name: 'Blok F (Hazardous / DG Cargo)',
    category: 'Dangerous Cargo (DG)',
    totalBays: 4,
    rowsPerBay: 4,
    tiersPerBay: 2,
    totalCapacityTeu: 32,
    currentTeuOccupied: 14,
    isHazardous: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    companyName: 'PT Indofood Sukses Makmur Tbk',
    picName: 'Bapak Irwan Santoso',
    whatsappNumber: '+6281234567890',
    email: 'logistics@indofood.co.id',
    address: 'Kawasan Industri Indotaisei Sektor 1A, Cikampek',
    city: 'Karawang',
    creditTermDays: 30,
    activeBookingsCount: 14,
    category: 'Shipper'
  },
  {
    id: 'cust-02',
    companyName: 'PT Mayora Indah Tbk',
    picName: 'Ibu Devi Maharani',
    whatsappNumber: '+6281398765432',
    email: 'supplychain@mayora.co.id',
    address: 'Jl. Telesonic No. 9, Jatake',
    city: 'Tangerang',
    creditTermDays: 45,
    activeBookingsCount: 9,
    category: 'Shipper'
  },
  {
    id: 'cust-03',
    companyName: 'PT Unilever Indonesia Tbk',
    picName: 'Bapak Ferry Gunawan',
    whatsappNumber: '+6281122334455',
    email: 'shipping.desk@unilever.com',
    address: 'BSD Green Office Park Kav 3, Tangerang',
    city: 'Tangerang Selatan',
    creditTermDays: 30,
    activeBookingsCount: 22,
    category: 'Consignee'
  },
  {
    id: 'cust-04',
    companyName: 'PT Charoen Pokphand Indonesia',
    picName: 'Bapak Rudi Setiawan',
    whatsappNumber: '+6281788990011',
    email: 'coldchain@cp.co.id',
    address: 'Jl. Rungkut Industri IV No. 22',
    city: 'Surabaya',
    creditTermDays: 30,
    activeBookingsCount: 6,
    category: 'Shipper'
  },
  {
    id: 'cust-05',
    companyName: 'PT Samudera Logistik Nusantara (Forwarding)',
    picName: 'Ibu Ratna Dewi',
    whatsappNumber: '+6281566778899',
    email: 'ops.jkt@samuderalog.com',
    address: 'Gedung Samudera Indonesia Lt. 5, Slipi',
    city: 'Jakarta Barat',
    creditTermDays: 14,
    activeBookingsCount: 18,
    category: 'Forwarder'
  }
];

export const INITIAL_GATE_TRANSACTIONS: GateTransaction[] = [
  {
    id: 'gt-01',
    transactionType: 'Gate-In (Receiving)',
    containerNo: 'SPIL-892103-4',
    containerSize: '40ft HC',
    truckPlateNo: 'B 9482 UEN',
    driverName: 'Suryadi Pratama',
    driverPhone: '+6281234111222',
    shippingLine: 'PT Salam Pacific Indonesia Lines (SPIL)',
    sealNo: 'SL-SPIL-99201',
    grossWeightKg: 28450,
    tareWeightKg: 3880,
    netWeightKg: 24570,
    conditionRemark: 'Baik / Good',
    yardSlotAssigned: 'Blok A - Bay 04 - Row 02 - Tier 3',
    gateLane: 'Gate In Lane 02',
    timestamp: '2026-09-17 19:15:00',
    status: 'Completed',
    eirNumber: 'EIR/20260917/0081',
    customerName: 'PT Indofood Sukses Makmur Tbk'
  },
  {
    id: 'gt-02',
    transactionType: 'Gate-Out (Delivery)',
    containerNo: 'MSKU-993144-0',
    containerSize: '40ft HC',
    truckPlateNo: 'B 9104 TEB',
    driverName: 'Wahyu Nugroho',
    driverPhone: '+6281355443322',
    shippingLine: 'Maersk Line Indonesia',
    sealNo: 'SL-MSK-88219',
    grossWeightKg: 31200,
    tareWeightKg: 3900,
    netWeightKg: 27300,
    conditionRemark: 'Baik / Good',
    yardSlotAssigned: 'Blok C - Bay 08 - Row 03 - Tier 2',
    gateLane: 'Gate Out Lane 01',
    timestamp: '2026-09-17 19:45:00',
    status: 'Completed',
    eirNumber: 'EIR/20260917/0082',
    customerName: 'PT Mayora Indah Tbk'
  },
  {
    id: 'gt-03',
    transactionType: 'Gate-In (Receiving)',
    containerNo: 'MRTS-441209-1',
    containerSize: '20ft',
    truckPlateNo: 'L 8820 ZX',
    driverName: 'Joko Sutrisno',
    driverPhone: '+6281900112233',
    shippingLine: 'PT Meratus Line',
    sealNo: 'SL-MRTS-77124',
    grossWeightKg: 21900,
    tareWeightKg: 2850,
    netWeightKg: 19050,
    conditionRemark: 'Baik / Good',
    yardSlotAssigned: 'Blok B - Bay 02 - Row 01 - Tier 2 (Plugged)',
    gateLane: 'Gate In Lane 01 (Reefer Dedicated)',
    timestamp: '2026-09-17 20:05:00',
    status: 'Completed',
    eirNumber: 'EIR/20260917/0083',
    customerName: 'PT Charoen Pokphand Indonesia'
  }
];

export const INITIAL_STEVEDORING: StevedoringTransaction[] = [
  {
    id: 'stv-01',
    vesselId: 'ves-01',
    vesselName: 'KM Samudera Jaya 18',
    voyageNo: 'VOY-2026/048B',
    operationType: 'Discharge (Bongkar)',
    containerNo: 'SMLU-662319-8',
    containerSize: '40ft',
    craneId: 'Quay Crane 02 (QC-02)',
    baySlotVessel: 'Bay 12-04-82',
    yardTargetSlot: 'Blok D-03-02-1',
    operatorName: 'Dedi Kurniawan',
    timestamp: '2026-09-17 18:20:00',
    status: 'Finished',
    weightTon: 26.7
  },
  {
    id: 'stv-02',
    vesselId: 'ves-01',
    vesselName: 'KM Samudera Jaya 18',
    voyageNo: 'VOY-2026/048B',
    operationType: 'Loading (Muat)',
    containerNo: 'SPIL-892103-4',
    containerSize: '40ft HC',
    craneId: 'Quay Crane 01 (QC-01)',
    baySlotVessel: 'Bay 08-02-84',
    yardTargetSlot: 'Blok A-04-02-3',
    operatorName: 'Budi Raharjo',
    timestamp: '2026-09-17 20:30:00',
    status: 'In Progress',
    weightTon: 24.5
  }
];

export const INITIAL_SHIFTING: ShiftingTransaction[] = [
  {
    id: 'shf-01',
    containerNo: 'SPIL-892103-4',
    fromSlot: 'Blok A-04-02-01',
    toSlot: 'Blok A-04-02-03',
    equipmentUsed: 'RTG Crane 03',
    operator: 'Suparman',
    reason: 'Vessel Loading Sequence',
    timestamp: '2026-09-17 17:40:00'
  },
  {
    id: 'shf-02',
    containerNo: 'TMLU-110294-5',
    fromSlot: 'Blok E-02-01-02',
    toSlot: 'Blok E-06-04-04',
    equipmentUsed: 'Reach Stacker 01',
    operator: 'Heru Wibowo',
    reason: 'Housekeeping (Penataan)',
    timestamp: '2026-09-17 15:30:00'
  }
];

export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif-01',
    customerName: 'PT Indofood Sukses Makmur Tbk',
    customerPhone: '+6281234567890',
    customerEmail: 'logistics@indofood.co.id',
    containerNo: 'SPIL-892103-4',
    eventType: 'GATE_IN_CONFIRMED',
    channel: 'WhatsApp',
    title: 'Peti Kemas Telah Gate-In di Terminal',
    message: 'Halo PT Indofood Sukses Makmur Tbk, peti kemas SPIL-892103-4 (40ft HC) telah sukses GATE-IN pada pukul 19:15 WIB. EIR No: EIR/20260917/0081. Stacking: Blok A-04-02-3.',
    sentAt: '2026-09-17 19:16:00',
    status: 'Delivered',
    whatsappLink: 'https://wa.me/6281234567890?text=Halo%20PT%20Indofood%2C%20peti%20kemas%20SPIL-892103-4%20telah%20selesai%20GATE-IN%20di%20Terminal%20Peti%20Kemas'
  },
  {
    id: 'notif-02',
    customerName: 'PT Charoen Pokphand Indonesia',
    customerPhone: '+6281788990011',
    customerEmail: 'coldchain@cp.co.id',
    containerNo: 'MRTS-441209-1',
    eventType: 'DISCHARGE_COMPLETED',
    channel: 'WhatsApp',
    title: 'Peti Kemas Reefer Telah Di-Plug In',
    message: 'Update Cold Chain: Peti kemas Reefer MRTS-441209-1 telah tersambung pada colokan listrik Blok B Slot 02-01-2. Suhu terkontrol saat ini: -18.2°C.',
    sentAt: '2026-09-17 20:10:00',
    status: 'Delivered',
    whatsappLink: 'https://wa.me/6281788990011?text=Update%20Cold%20Chain%3A%20Peti%20kemas%20MRTS-441209-1%20tersambung%20suhu%20-18C'
  },
  {
    id: 'notif-03',
    customerName: 'PT Mayora Indah Tbk',
    customerPhone: '+6281398765432',
    customerEmail: 'supplychain@mayora.co.id',
    containerNo: 'MSKU-993144-0',
    eventType: 'GATE_OUT_DELIVERY',
    channel: 'WhatsApp',
    title: 'Truk Pengantar Sedang Dalam Perjalanan',
    message: 'Peti kemas MSKU-993144-0 telah Gate-Out dari terminal bersama armada Truk B 9104 TEB (Driver: Wahyu Nugroho). Estimasi tiba di Gudang Tangerang: 45 Menit.',
    sentAt: '2026-09-17 19:48:00',
    status: 'Delivered',
    whatsappLink: 'https://wa.me/6281398765432?text=Peti%20kemas%20MSKU-993144-0%20telah%20Gate-Out%20menuju%20gudang%20Mayora'
  }
];

export const INITIAL_TRUCKS: TruckTracking[] = [
  {
    id: 'trk-01',
    truckPlateNo: 'B 9104 TEB',
    driverName: 'Wahyu Nugroho',
    driverPhone: '+6281355443322',
    containerNo: 'MSKU-993144-0',
    consigneeName: 'PT Mayora Indah Tbk',
    destinationAddress: 'Jl. Telesonic No. 9, Kawasan Industri Jatake, Tangerang',
    currentLat: -6.1820,
    currentLng: 106.7200, // Tol Jakarta - Tangerang KM 14
    speedKmh: 64,
    status: 'On Route to Consignee',
    etaMinutes: 38,
    progressPercent: 55
  },
  {
    id: 'trk-02',
    truckPlateNo: 'B 9482 UEN',
    driverName: 'Suryadi Pratama',
    driverPhone: '+6281234111222',
    containerNo: 'SPIL-892103-4',
    consigneeName: 'Terminal Peti Kemas (Receiving Export)',
    destinationAddress: 'Terminal Peti Kemas Dermaga 02',
    currentLat: -6.1022,
    currentLng: 106.8839,
    speedKmh: 0,
    status: 'At Terminal',
    etaMinutes: 0,
    progressPercent: 100
  },
  {
    id: 'trk-03',
    truckPlateNo: 'L 8820 ZX',
    driverName: 'Joko Sutrisno',
    driverPhone: '+6281900112233',
    containerNo: 'MRTS-441209-1',
    consigneeName: 'PT Charoen Pokphand Cold Storage',
    destinationAddress: 'Kawasan Pergudangan Margomulyo, Surabaya',
    currentLat: -7.2210,
    currentLng: 112.6840,
    speedKmh: 48,
    status: 'On Route to Consignee',
    etaMinutes: 25,
    progressPercent: 70
  }
];

export const INITIAL_DB_CONFIG: DatabaseConfig = {
  activeProvider: 'supabase',
  supabaseUrl: 'https://vquxhykloasbmwplqwer.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  neonDatabaseUrl: 'postgresql://tos_admin:Nusantara2026@ep-terminal-maritim-99214.ap-southeast-1.aws.neon.tech/terminal_db?sslmode=require',
  firebaseProjectId: 'terminal-petikemas-maritim',
  isConnected: true,
  lastTestedAt: '2026-09-17 21:00:00',
  latencyMs: 34
};
