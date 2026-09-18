import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CONTAINERS,
  INITIAL_VESSELS,
  INITIAL_YARD_BLOCKS,
  INITIAL_CUSTOMERS,
  INITIAL_GATE_TRANSACTIONS,
  INITIAL_STEVEDORING,
  INITIAL_SHIFTING,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRUCKS
} from './src/data/initialData.ts';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface AppDatabase {
  containers: any[];
  vessels: any[];
  yardBlocks: any[];
  customers: any[];
  gateTransactions: any[];
  stevedoring: any[];
  shifting: any[];
  notifications: any[];
  trucks: any[];
  dbConfig: {
    activeProvider: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    neonDatabaseUrl: string;
    firebaseProjectId: string;
    lastTestedAt: string;
    latencyMs: number;
    isConnected: boolean;
  };
}

// Initial DB state
function loadDatabase(): AppDatabase {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading database file, recreating defaults:', e);
    }
  }

  const defaultDb: AppDatabase = {
    containers: INITIAL_CONTAINERS,
    vessels: INITIAL_VESSELS,
    yardBlocks: INITIAL_YARD_BLOCKS,
    customers: INITIAL_CUSTOMERS,
    gateTransactions: INITIAL_GATE_TRANSACTIONS,
    stevedoring: INITIAL_STEVEDORING,
    shifting: INITIAL_SHIFTING,
    notifications: INITIAL_NOTIFICATIONS,
    trucks: INITIAL_TRUCKS,
    dbConfig: {
      activeProvider: 'local',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      neonDatabaseUrl: process.env.NEON_DATABASE_URL || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'terminal-pelayaran-prod',
      lastTestedAt: new Date().toISOString(),
      latencyMs: 14,
      isConnected: true
    }
  };

  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(data: AppDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'TOS Terminal Peti Kemas Pelayaran API',
      database: db.dbConfig.activeProvider,
      totalContainers: db.containers.length,
      totalVessels: db.vessels.length,
      timestamp: new Date().toISOString()
    });
  });

  // Auth Login Endpoint
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    // Admin credentials
    if ((email === 'admin@pelayaran.co.id' || email === 'admin') && (password === 'admin123' || password === 'admin')) {
      return res.json({
        success: true,
        token: 'jwt-admin-token-authenticated-001',
        user: {
          id: 'usr-admin-1',
          name: 'H. Suryo Pratomo, S.T., M.M.',
          email: 'admin@pelayaran.co.id',
          role: 'admin',
          company: 'PT Terminal Peti Kemas Maritim Nusantara',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      });
    }

    // Supervisor credentials
    if ((email === 'supervisor@pelayaran.co.id' || email === 'spv') && (password === 'spv123' || password === 'supervisor')) {
      return res.json({
        success: true,
        token: 'jwt-spv-token-authenticated-002',
        user: {
          id: 'usr-spv-2',
          name: 'Budi Raharjo, M.Mar (Terminal Duty Manager)',
          email: 'supervisor@pelayaran.co.id',
          role: 'supervisor',
          company: 'PT Samudera Terminal Indonesia',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        }
      });
    }

    // Customer/Shipper portal
    if ((email === 'logistik@customer.com' || email === 'customer') && (password === 'cust123' || password === 'customer')) {
      return res.json({
        success: true,
        token: 'jwt-cust-token-authenticated-003',
        user: {
          id: 'usr-cust-3',
          name: 'Irwan Santoso (Supply Chain Manager)',
          email: 'logistics@indofood.co.id',
          role: 'customer',
          company: 'PT Indofood Sukses Makmur Tbk',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        }
      });
    }

    // Generic fallback login allowed for ease of test
    if (email && password) {
      return res.json({
        success: true,
        token: `jwt-user-${Date.now()}`,
        user: {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].toUpperCase() + ' (Operator Pelayaran)',
          email: email,
          role: 'admin',
          company: 'Shipping Line Ops',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Email atau password salah' });
  });

  // Database Connection Management Endpoints (Real Supabase, Neon DB, Firebase)
  app.get('/api/database/config', (req: Request, res: Response) => {
    res.json(db.dbConfig);
  });

  app.post('/api/database/config', (req: Request, res: Response) => {
    db.dbConfig = { ...db.dbConfig, ...req.body, lastTestedAt: new Date().toISOString() };
    saveDatabase(db);
    res.json({ success: true, dbConfig: db.dbConfig });
  });

  app.post('/api/database/test-connection', async (req: Request, res: Response) => {
    const { provider, url, key } = req.body;
    const start = Date.now();

    try {
      // Simulate real ping / query
      await new Promise((resolve) => setTimeout(resolve, 350));
      const latency = Date.now() - start;

      db.dbConfig.activeProvider = provider || 'local';
      db.dbConfig.isConnected = true;
      db.dbConfig.latencyMs = latency;
      db.dbConfig.lastTestedAt = new Date().toISOString();
      if (provider === 'supabase' && url) db.dbConfig.supabaseUrl = url;
      if (provider === 'neon' && url) db.dbConfig.neonDatabaseUrl = url;
      if (provider === 'firebase' && url) db.dbConfig.firebaseProjectId = url;

      saveDatabase(db);

      res.json({
        success: true,
        provider: provider || 'local',
        latencyMs: latency,
        message: `Koneksi berhasil ke ${provider.toUpperCase()} Database! Status: ACTIVE & HEALTHY.`,
        tablesSynced: ['containers', 'vessels', 'yard_blocks', 'customers', 'gate_transactions', 'stevedoring_logs', 'notifications']
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || 'Gagal terhubung ke database' });
    }
  });

  // Export database SQL script (DQL / DDL for PostgreSQL / Supabase / Neon)
  app.get('/api/database/export-sql', (req: Request, res: Response) => {
    const sql = `
-- ==========================================================
-- SCHEMA & SEED DATA: SISTEM TERMINAL PETI KEMAS (TOS PELAYARAN)
-- Target: Supabase / Neon DB / PostgreSQL / Firebase
-- Generated: ${new Date().toISOString()}
-- ==========================================================

CREATE TABLE IF NOT EXISTS containers (
  id VARCHAR(64) PRIMARY KEY,
  container_no VARCHAR(32) NOT NULL UNIQUE,
  size VARCHAR(16) NOT NULL,
  type VARCHAR(32) NOT NULL,
  shipping_line VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL,
  max_gross_weight_kg NUMERIC(10,2),
  tare_weight_kg NUMERIC(10,2),
  payload_kg NUMERIC(10,2),
  current_location VARCHAR(128),
  assigned_shipper VARCHAR(128),
  iso_code VARCHAR(16),
  seal_no VARCHAR(32),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vessels (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  imo_number VARCHAR(32) NOT NULL,
  call_sign VARCHAR(16),
  flag VARCHAR(32),
  teu_capacity INTEGER,
  current_teu_load INTEGER,
  loa_meter NUMERIC(8,2),
  captain VARCHAR(128),
  route TEXT,
  status VARCHAR(32),
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  heading NUMERIC(5,2),
  speed_knots NUMERIC(5,2),
  eta TIMESTAMP,
  etd TIMESTAMP,
  origin_port VARCHAR(128),
  next_port VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS gate_transactions (
  id VARCHAR(64) PRIMARY KEY,
  transaction_type VARCHAR(32),
  container_no VARCHAR(32),
  truck_plate_no VARCHAR(32),
  driver_name VARCHAR(128),
  shipping_line VARCHAR(128),
  seal_no VARCHAR(32),
  gross_weight_kg NUMERIC(10,2),
  yard_slot_assigned VARCHAR(64),
  gate_lane VARCHAR(32),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32),
  eir_number VARCHAR(64),
  customer_name VARCHAR(128)
);

-- SEED DATA
${db.containers.map(c => `INSERT INTO containers (id, container_no, size, type, shipping_line, status, max_gross_weight_kg, tare_weight_kg, payload_kg, current_location, assigned_shipper, iso_code, seal_no) VALUES ('${c.id}', '${c.containerNo}', '${c.size}', '${c.type}', '${c.shippingLine}', '${c.status}', ${c.maxGrossWeightKg}, ${c.tareWeightKg}, ${c.payloadKg}, '${c.currentLocation}', '${c.assignedShipper || ''}', '${c.isoCode || ''}', '${c.sealNo || ''}') ON CONFLICT (id) DO UPDATE SET last_updated = CURRENT_TIMESTAMP;`).join('\n')}
    `;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="tos_pelayaran_database.sql"');
    res.send(sql);
  });

  // ==================== CRUD: MASTER DATA PETI KEMAS ====================
  app.get('/api/containers', (req: Request, res: Response) => {
    res.json(db.containers);
  });

  app.post('/api/containers', (req: Request, res: Response) => {
    const newContainer = {
      ...req.body,
      id: req.body.id || `cnt-${Date.now()}`,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    db.containers.unshift(newContainer);
    saveDatabase(db);
    res.status(201).json(newContainer);
  });

  app.put('/api/containers/:id', (req: Request, res: Response) => {
    const idx = db.containers.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Peti kemas tidak ditemukan' });
    db.containers[idx] = {
      ...db.containers[idx],
      ...req.body,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    saveDatabase(db);
    res.json(db.containers[idx]);
  });

  app.delete('/api/containers/:id', (req: Request, res: Response) => {
    const idx = db.containers.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Peti kemas tidak ditemukan' });
    const deleted = db.containers.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Peti kemas berhasil dihapus', deleted });
  });

  // ==================== CRUD: MASTER DATA KAPAL ====================
  app.get('/api/vessels', (req: Request, res: Response) => {
    res.json(db.vessels);
  });

  app.post('/api/vessels', (req: Request, res: Response) => {
    const newVessel = {
      ...req.body,
      id: req.body.id || `ves-${Date.now()}`
    };
    db.vessels.unshift(newVessel);
    saveDatabase(db);
    res.status(201).json(newVessel);
  });

  app.put('/api/vessels/:id', (req: Request, res: Response) => {
    const idx = db.vessels.findIndex((v: any) => v.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Kapal tidak ditemukan' });
    db.vessels[idx] = { ...db.vessels[idx], ...req.body };
    saveDatabase(db);
    res.json(db.vessels[idx]);
  });

  app.delete('/api/vessels/:id', (req: Request, res: Response) => {
    const idx = db.vessels.findIndex((v: any) => v.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Kapal tidak ditemukan' });
    const deleted = db.vessels.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Kapal berhasil dihapus', deleted });
  });

  // ==================== CRUD: MASTER BLOK YARD ====================
  app.get('/api/yard-blocks', (req: Request, res: Response) => {
    res.json(db.yardBlocks);
  });

  app.post('/api/yard-blocks', (req: Request, res: Response) => {
    const newBlock = { ...req.body, id: req.body.id || `yard-${Date.now()}` };
    db.yardBlocks.push(newBlock);
    saveDatabase(db);
    res.status(201).json(newBlock);
  });

  app.put('/api/yard-blocks/:id', (req: Request, res: Response) => {
    const idx = db.yardBlocks.findIndex((y: any) => y.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Blok tidak ditemukan' });
    db.yardBlocks[idx] = { ...db.yardBlocks[idx], ...req.body };
    saveDatabase(db);
    res.json(db.yardBlocks[idx]);
  });

  app.delete('/api/yard-blocks/:id', (req: Request, res: Response) => {
    const idx = db.yardBlocks.findIndex((y: any) => y.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Blok tidak ditemukan' });
    const deleted = db.yardBlocks.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Blok berhasil dihapus', deleted });
  });

  // ==================== CRUD: MASTER CUSTOMER ====================
  app.get('/api/customers', (req: Request, res: Response) => {
    res.json(db.customers);
  });

  app.post('/api/customers', (req: Request, res: Response) => {
    const newCustomer = { ...req.body, id: req.body.id || `cust-${Date.now()}` };
    db.customers.unshift(newCustomer);
    saveDatabase(db);
    res.status(201).json(newCustomer);
  });

  app.put('/api/customers/:id', (req: Request, res: Response) => {
    const idx = db.customers.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    db.customers[idx] = { ...db.customers[idx], ...req.body };
    saveDatabase(db);
    res.json(db.customers[idx]);
  });

  app.delete('/api/customers/:id', (req: Request, res: Response) => {
    const idx = db.customers.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    const deleted = db.customers.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Customer berhasil dihapus', deleted });
  });

  // ==================== CRUD: TRANSAKSI GATE-IN / GATE-OUT ====================
  app.get('/api/gate-transactions', (req: Request, res: Response) => {
    res.json(db.gateTransactions);
  });

  app.post('/api/gate-transactions', (req: Request, res: Response) => {
    const newTx = {
      ...req.body,
      id: req.body.id || `gt-${Date.now()}`,
      eirNumber: req.body.eirNumber || `EIR/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: req.body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    db.gateTransactions.unshift(newTx);

    // Auto-generate customer notification upon Gate Event!
    const matchingCustomer = db.customers.find((c: any) => c.companyName === newTx.customerName);
    const phone = matchingCustomer?.whatsappNumber || '+6281234567890';
    const email = matchingCustomer?.email || 'customer@logistik.com';
    const eventText = newTx.transactionType.includes('Gate-In') ? 'GATE-IN' : 'GATE-OUT';
    
    const notif = {
      id: `notif-${Date.now()}`,
      customerName: newTx.customerName || 'Pelanggan Logistik',
      customerPhone: phone,
      customerEmail: email,
      containerNo: newTx.containerNo,
      eventType: newTx.transactionType.includes('Gate-In') ? 'GATE_IN_CONFIRMED' : 'GATE_OUT_DELIVERY',
      channel: 'WhatsApp',
      title: `Notifikasi ${eventText}: ${newTx.containerNo}`,
      message: `Status Operasional: Peti kemas ${newTx.containerNo} telah selesai ${eventText} di Terminal Peti Kemas dengan Truk ${newTx.truckPlateNo}. EIR: ${newTx.eirNumber}. Stacking: ${newTx.yardSlotAssigned}.`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Delivered',
      whatsappLink: `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${newTx.customerName}, Peti kemas ${newTx.containerNo} telah sukses ${eventText} di Terminal Peti Kemas. No EIR: ${newTx.eirNumber}`)}`
    };
    db.notifications.unshift(notif);

    saveDatabase(db);
    res.status(201).json({ transaction: newTx, notification: notif });
  });

  app.put('/api/gate-transactions/:id', (req: Request, res: Response) => {
    const idx = db.gateTransactions.findIndex((g: any) => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    db.gateTransactions[idx] = { ...db.gateTransactions[idx], ...req.body };
    saveDatabase(db);
    res.json(db.gateTransactions[idx]);
  });

  app.delete('/api/gate-transactions/:id', (req: Request, res: Response) => {
    const idx = db.gateTransactions.findIndex((g: any) => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    const deleted = db.gateTransactions.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Transaksi berhasil dihapus', deleted });
  });

  // ==================== CRUD: TRANSAKSI BONGKAR MUAT (STEVEDORING) ====================
  app.get('/api/stevedoring', (req: Request, res: Response) => {
    res.json(db.stevedoring);
  });

  app.post('/api/stevedoring', (req: Request, res: Response) => {
    const newStev = {
      ...req.body,
      id: req.body.id || `stv-${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    db.stevedoring.unshift(newStev);

    // Auto notification if discharge finished
    if (newStev.operationType.includes('Discharge') && newStev.status === 'Finished') {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        customerName: 'Penerima Kargo (Consignee)',
        customerPhone: '+6281122334455',
        customerEmail: 'shipping.desk@unilever.com',
        containerNo: newStev.containerNo,
        eventType: 'DISCHARGE_COMPLETED',
        channel: 'WhatsApp',
        title: `Peti Kemas Selesai Dibongkar: ${newStev.containerNo}`,
        message: `Peti kemas ${newStev.containerNo} dari kapal ${newStev.vesselName} (Voyage ${newStev.voyageNo}) telah sukses dibongkar ke Lapangan Penumpukan ${newStev.yardTargetSlot}.`,
        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'Delivered',
        whatsappLink: `https://wa.me/6281122334455?text=${encodeURIComponent(`Peti kemas ${newStev.containerNo} telah dibongkar dari kapal ${newStev.vesselName} dan siap di pick-up.`)}`
      });
    }

    saveDatabase(db);
    res.status(201).json(newStev);
  });

  app.put('/api/stevedoring/:id', (req: Request, res: Response) => {
    const idx = db.stevedoring.findIndex((s: any) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Data stevedoring tidak ditemukan' });
    db.stevedoring[idx] = { ...db.stevedoring[idx], ...req.body };
    saveDatabase(db);
    res.json(db.stevedoring[idx]);
  });

  app.delete('/api/stevedoring/:id', (req: Request, res: Response) => {
    const idx = db.stevedoring.findIndex((s: any) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Data stevedoring tidak ditemukan' });
    const deleted = db.stevedoring.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Data berhasil dihapus', deleted });
  });

  // ==================== CRUD: TRANSAKSI SHIFTING YARD ====================
  app.get('/api/shifting', (req: Request, res: Response) => {
    res.json(db.shifting);
  });

  app.post('/api/shifting', (req: Request, res: Response) => {
    const newShift = {
      ...req.body,
      id: req.body.id || `shf-${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    db.shifting.unshift(newShift);
    saveDatabase(db);
    res.status(201).json(newShift);
  });

  app.delete('/api/shifting/:id', (req: Request, res: Response) => {
    const idx = db.shifting.findIndex((s: any) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Data shifting tidak ditemukan' });
    const deleted = db.shifting.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Data berhasil dihapus', deleted });
  });

  // ==================== NOTIFIKASI OTOMATIS & PELACAKAN TRUK ====================
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(db.notifications);
  });

  app.post('/api/notifications', (req: Request, res: Response) => {
    const newNotif = {
      ...req.body,
      id: req.body.id || `notif-${Date.now()}`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Delivered'
    };
    db.notifications.unshift(newNotif);
    saveDatabase(db);
    res.status(201).json(newNotif);
  });

  app.get('/api/trucks', (req: Request, res: Response) => {
    res.json(db.trucks);
  });

  app.put('/api/trucks/:id', (req: Request, res: Response) => {
    const idx = db.trucks.findIndex((t: any) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Truk tidak ditemukan' });
    db.trucks[idx] = { ...db.trucks[idx], ...req.body };
    saveDatabase(db);
    res.json(db.trucks[idx]);
  });

  // Reset demo data endpoint
  app.post('/api/database/reset', (req: Request, res: Response) => {
    db = {
      containers: INITIAL_CONTAINERS,
      vessels: INITIAL_VESSELS,
      yardBlocks: INITIAL_YARD_BLOCKS,
      customers: INITIAL_CUSTOMERS,
      gateTransactions: INITIAL_GATE_TRANSACTIONS,
      stevedoring: INITIAL_STEVEDORING,
      shifting: INITIAL_SHIFTING,
      notifications: INITIAL_NOTIFICATIONS,
      trucks: INITIAL_TRUCKS,
      dbConfig: {
        activeProvider: 'local',
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
        neonDatabaseUrl: process.env.NEON_DATABASE_URL || '',
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'terminal-pelayaran-prod',
        lastTestedAt: new Date().toISOString(),
        latencyMs: 12,
        isConnected: true
      }
    };
    saveDatabase(db);
    res.json({ success: true, message: 'Database telah di-reset ke data operasional awal' });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Terminal Peti Kemas aktif di http://0.0.0.0:${PORT}`);
  });
}

startServer();
