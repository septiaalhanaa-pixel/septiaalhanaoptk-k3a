import {
  Container,
  Vessel,
  YardBlock,
  Customer,
  GateTransaction,
  StevedoringTransaction,
  ShiftingTransaction,
  CustomerNotification,
  TruckTracking,
  DatabaseConfig,
  UserSession
} from '../types';

const BASE_URL = '/api';

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: UserSession; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e: any) {
      // Fallback in case fetch fails
      return { success: false, message: e?.message || 'Gagal terhubung ke server auth' };
    }
  },

  // Database Connection
  async getDbConfig(): Promise<DatabaseConfig> {
    const res = await fetch(`${BASE_URL}/database/config`);
    return await res.json();
  },

  async saveDbConfig(config: Partial<DatabaseConfig>): Promise<any> {
    const res = await fetch(`${BASE_URL}/database/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  },

  async testConnection(provider: string, url: string, key?: string): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const res = await fetch(`${BASE_URL}/database/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, url, key })
    });
    return await res.json();
  },

  // Containers CRUD
  async getContainers(): Promise<Container[]> {
    const res = await fetch(`${BASE_URL}/containers`);
    return await res.json();
  },

  async createContainer(data: Partial<Container>): Promise<Container> {
    const res = await fetch(`${BASE_URL}/containers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateContainer(id: string, data: Partial<Container>): Promise<Container> {
    const res = await fetch(`${BASE_URL}/containers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteContainer(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/containers/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Vessels CRUD
  async getVessels(): Promise<Vessel[]> {
    const res = await fetch(`${BASE_URL}/vessels`);
    return await res.json();
  },

  async createVessel(data: Partial<Vessel>): Promise<Vessel> {
    const res = await fetch(`${BASE_URL}/vessels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateVessel(id: string, data: Partial<Vessel>): Promise<Vessel> {
    const res = await fetch(`${BASE_URL}/vessels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteVessel(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/vessels/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Yard Blocks CRUD
  async getYardBlocks(): Promise<YardBlock[]> {
    const res = await fetch(`${BASE_URL}/yard-blocks`);
    return await res.json();
  },

  async createYardBlock(data: Partial<YardBlock>): Promise<YardBlock> {
    const res = await fetch(`${BASE_URL}/yard-blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateYardBlock(id: string, data: Partial<YardBlock>): Promise<YardBlock> {
    const res = await fetch(`${BASE_URL}/yard-blocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteYardBlock(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/yard-blocks/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Customers CRUD
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${BASE_URL}/customers`);
    return await res.json();
  },

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteCustomer(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/customers/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Gate Transactions CRUD
  async getGateTransactions(): Promise<GateTransaction[]> {
    const res = await fetch(`${BASE_URL}/gate-transactions`);
    return await res.json();
  },

  async createGateTransaction(data: Partial<GateTransaction>): Promise<{ transaction: GateTransaction; notification?: CustomerNotification }> {
    const res = await fetch(`${BASE_URL}/gate-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateGateTransaction(id: string, data: Partial<GateTransaction>): Promise<GateTransaction> {
    const res = await fetch(`${BASE_URL}/gate-transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteGateTransaction(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/gate-transactions/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Stevedoring CRUD
  async getStevedoring(): Promise<StevedoringTransaction[]> {
    const res = await fetch(`${BASE_URL}/stevedoring`);
    return await res.json();
  },

  async createStevedoring(data: Partial<StevedoringTransaction>): Promise<StevedoringTransaction> {
    const res = await fetch(`${BASE_URL}/stevedoring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateStevedoring(id: string, data: Partial<StevedoringTransaction>): Promise<StevedoringTransaction> {
    const res = await fetch(`${BASE_URL}/stevedoring/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteStevedoring(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/stevedoring/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Shifting
  async getShifting(): Promise<ShiftingTransaction[]> {
    const res = await fetch(`${BASE_URL}/shifting`);
    return await res.json();
  },

  async createShifting(data: Partial<ShiftingTransaction>): Promise<ShiftingTransaction> {
    const res = await fetch(`${BASE_URL}/shifting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteShifting(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/shifting/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Notifications
  async getNotifications(): Promise<CustomerNotification[]> {
    const res = await fetch(`${BASE_URL}/notifications`);
    return await res.json();
  },

  async createNotification(data: Partial<CustomerNotification>): Promise<CustomerNotification> {
    const res = await fetch(`${BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Trucks
  async getTrucks(): Promise<TruckTracking[]> {
    const res = await fetch(`${BASE_URL}/trucks`);
    return await res.json();
  },

  // Reset demo
  async resetDatabase(): Promise<any> {
    const res = await fetch(`${BASE_URL}/database/reset`, { method: 'POST' });
    return await res.json();
  }
};
