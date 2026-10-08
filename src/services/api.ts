/**
 * Centralized API Service
 * Currently uses mock data. Replace with real Google Apps Script endpoints later.
 */

import {
  DEMO_USERS, DEMO_PRODUCTS, DEMO_CUSTOMERS, DEMO_SUPPLIERS,
  DEMO_CATEGORIES, DEMO_SALES, DEMO_SETTINGS, getDashboardStats
} from './mockData';
import type { User, Product, Customer, Supplier, Sale, Settings, DashboardStats } from '../types';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const api = {
  async login(email: string, password: string): Promise<{ success: boolean; data?: { user: User; token: string }; message?: string }> {
    await delay();
    const user = DEMO_USERS.find(u => u.email === email);
    if (user && password === '123456') {
      return { success: true, data: { user, token: 'demo-token-' + user.id } };
    }
    return { success: false, message: 'Invalid email or password' };
  },

  async logout(): Promise<{ success: boolean }> {
    await delay(200);
    return { success: true };
  },

  async getDashboard(): Promise<{ success: boolean; data: DashboardStats }> {
    await delay();
    return { success: true, data: getDashboardStats() };
  },

  async getProducts(): Promise<{ success: boolean; data: Product[] }> {
    await delay();
    return { success: true, data: DEMO_PRODUCTS };
  },

  async getProduct(id: string): Promise<{ success: boolean; data?: Product }> {
    await delay();
    const p = DEMO_PRODUCTS.find(x => x.id === id);
    return p ? { success: true, data: p } : { success: false };
  },

  async getCustomers(): Promise<{ success: boolean; data: Customer[] }> {
    await delay();
    return { success: true, data: DEMO_CUSTOMERS };
  },

  async getSuppliers(): Promise<{ success: boolean; data: Supplier[] }> {
    await delay();
    return { success: true, data: DEMO_SUPPLIERS };
  },

  async getCategories() {
    await delay();
    return { success: true, data: DEMO_CATEGORIES };
  },

  async getSales(): Promise<{ success: boolean; data: Sale[] }> {
    await delay();
    return { success: true, data: DEMO_SALES };
  },

  async createSale(saleData: any): Promise<{ success: boolean; data?: Sale; message?: string }> {
    await delay(600);
    const invoiceNo = `FGE-2026-${String(DEMO_SALES.length + 1).padStart(4, '0')}`;
    const sale: Sale = {
      id: `SAL-${Date.now()}`,
      invoice_no: invoiceNo,
      ...saleData,
      status: 'completed',
      created_at: new Date().toISOString(),
    };
    DEMO_SALES.unshift(sale);
    return { success: true, data: sale, message: 'Sale completed successfully' };
  },

  async getSettings(): Promise<{ success: boolean; data: Settings }> {
    await delay();
    return { success: true, data: DEMO_SETTINGS };
  },

  async updateSettings(settings: Partial<Settings>): Promise<{ success: boolean; data: Settings }> {
    await delay();
    Object.assign(DEMO_SETTINGS, settings);
    return { success: true, data: DEMO_SETTINGS };
  },
};
