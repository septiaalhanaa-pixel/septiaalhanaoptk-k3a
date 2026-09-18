export type ContainerSize = '20ft' | '40ft' | '40ft HC' | '45ft';
export type ContainerType = 'Dry Container' | 'Reefer (Berpendingin)' | 'Open Top' | 'Flat Rack' | 'ISO Tank';
export type ContainerStatus = 'Empty' | 'Laden (Berisi)' | 'Damaged (Rusak)' | 'Maintenance' | 'Quarantine';

export interface Container {
  id: string;
  containerNo: string; // e.g. TEMU-892134-2
  size: ContainerSize;
  type: ContainerType;
  shippingLine: string; // e.g. SPIL, Meratus, Samudera, Temas, Maersk
  status: ContainerStatus;
  maxGrossWeightKg: number;
  tareWeightKg: number;
  payloadKg: number;
  currentLocation: string; // e.g. "Blok B - Bay 04 - Row 02 - Tier 3" or "Di Atas Kapal KM SPIL Nirmala"
  currentVesselId?: string;
  assignedShipper?: string;
  lastUpdated: string;
  entryDate?: string;
  isoCode: string;
  sealNo?: string;
}

export interface Vessel {
  id: string;
  name: string; // e.g. KM Meratus Jaya 5
  imoNumber: string;
  callSign: string;
  flag: string;
  teuCapacity: number;
  currentTeuLoad: number;
  loaMeter: number; // Length overall
  captain: string;
  route: string; // e.g. Tanjung Priok - Tanjung Perak - Makassar
  status: 'Berthing (Dermaga)' | 'Anchorage (Lego Jangkar)' | 'Sailing (Berlayar)' | 'Departed';
  currentBerth?: string; // e.g. Dermaga 02-B
  lat: number;
  lng: number;
  heading: number;
  speedKnots: number;
  eta: string;
  etd: string;
  nextPort: string;
  originPort: string;
}

export interface YardBlock {
  id: string;
  name: string; // Blok A, Blok B, etc.
  category: 'Dry General' | 'Reefer Area' | 'Dangerous Cargo (DG)' | 'Empty Depot';
  totalBays: number;
  rowsPerBay: number;
  tiersPerBay: number;
  totalCapacityTeu: number;
  currentTeuOccupied: number;
  reeferPlugsAvailable?: number;
  temperatureTarget?: number;
  isHazardous: boolean;
}

export interface Customer {
  id: string;
  companyName: string;
  picName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  creditTermDays: number;
  activeBookingsCount: number;
  category: 'Shipper' | 'Consignee' | 'Forwarder' | 'EMKL';
}

export interface GateTransaction {
  id: string;
  transactionType: 'Gate-In (Receiving)' | 'Gate-Out (Delivery)' | 'Empty Return';
  containerNo: string;
  containerSize: ContainerSize;
  truckPlateNo: string;
  driverName: string;
  driverPhone: string;
  shippingLine: string;
  sealNo: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  conditionRemark: 'Baik / Good' | 'Baret / Minor Scratch' | 'Penyok / Dent' | 'Segel Rusak';
  yardSlotAssigned: string; // e.g. Blok C-08-03-2
  gateLane: string; // Gate Lane 01
  timestamp: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  eirNumber: string; // Equipment Interchange Receipt
  customerName: string;
}

export interface StevedoringTransaction {
  id: string;
  vesselId: string;
  vesselName: string;
  voyageNo: string;
  operationType: 'Discharge (Bongkar)' | 'Loading (Muat)';
  containerNo: string;
  containerSize: ContainerSize;
  craneId: string; // QC-01, QC-02
  baySlotVessel: string; // e.g. Bay 14-04-82
  yardTargetSlot: string; // e.g. Blok A-02-01-3
  operatorName: string;
  timestamp: string;
  startTime?: string;
  status: 'In Progress' | 'Finished' | 'Pending';
  weightTon: number;
}

export interface ShiftingTransaction {
  id: string;
  containerNo: string;
  fromSlot: string;
  toSlot: string;
  equipmentUsed: 'RTG Crane 03' | 'Reach Stacker 01' | 'Top Loader';
  operator: string;
  reason: 'Housekeeping (Penataan)' | 'Vessel Loading Sequence' | 'Inspection Gate' | 'Reefer Monitoring';
  timestamp: string;
}

export interface CustomerNotification {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  containerNo: string;
  eventType: 'DISCHARGE_COMPLETED' | 'GATE_IN_CONFIRMED' | 'CUSTOMS_CLEARED' | 'GATE_OUT_DELIVERY' | 'TRUCK_ON_WAY' | 'DELIVERED_POD' | 'gate_in' | 'gate_out' | 'discharged' | 'loaded' | 'customs_cleared';
  channel: 'WhatsApp' | 'Email' | 'InApp' | 'Both';
  title: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Failed' | 'Sent';
  whatsappLink?: string;
}

export interface TruckTracking {
  id: string;
  truckPlateNo: string;
  driverName: string;
  driverPhone: string;
  containerNo: string;
  consigneeName: string;
  destinationAddress: string;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  status: 'At Terminal' | 'On Route to Consignee' | 'At Consignee Warehouse' | 'Returning Empty';
  etaMinutes: number;
  progressPercent: number;
}

export interface DatabaseConfig {
  activeProvider: 'local' | 'supabase' | 'neon' | 'firebase';
  supabaseUrl: string;
  supabaseAnonKey: string;
  neonDatabaseUrl: string;
  firebaseProjectId: string;
  isConnected: boolean;
  lastTestedAt?: string;
  latencyMs?: number;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'dispatcher' | 'customer';
  company: string;
  avatar: string;
}
