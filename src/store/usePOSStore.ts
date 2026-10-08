import { create } from 'zustand';
import type { CartItem, Customer } from '../types';

interface POSState {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  discount: number;
  taxRate: number;
  notes: string;
  heldOrders: { id: string; cart: CartItem[]; customer: Customer | null; discount: number; notes: string; createdAt: string }[];
  
  addToCart: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer | null) => void;
  setDiscount: (discount: number) => void;
  setNotes: (notes: string) => void;
  holdOrder: () => void;
  resumeOrder: (id: string) => void;
  deleteHeldOrder: (id: string) => void;
  
  getSubtotal: () => number;
  getTax: () => number;
  getGrandTotal: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  cart: [],
  selectedCustomer: null,
  discount: 0,
  taxRate: 5,
  notes: '',
  heldOrders: [],

  addToCart: (item) => {
    const existing = get().cart.find(c => c.variant_id === item.variant_id);
    if (existing) {
      set({
        cart: get().cart.map(c =>
          c.variant_id === item.variant_id
            ? { ...c, quantity: c.quantity + item.quantity, total: (c.quantity + item.quantity) * c.unit_price - c.discount }
            : c
        ),
      });
    } else {
      set({ cart: [...get().cart, item] });
    }
  },

  updateQuantity: (variantId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(variantId);
      return;
    }
    set({
      cart: get().cart.map(c =>
        c.variant_id === variantId
          ? { ...c, quantity, total: quantity * c.unit_price - c.discount }
          : c
      ),
    });
  },

  removeFromCart: (variantId) => {
    set({ cart: get().cart.filter(c => c.variant_id !== variantId) });
  },

  clearCart: () => set({ cart: [], selectedCustomer: null, discount: 0, notes: '' }),

  setCustomer: (customer) => set({ selectedCustomer: customer }),
  setDiscount: (discount) => set({ discount }),
  setNotes: (notes) => set({ notes }),

  holdOrder: () => {
    const { cart, selectedCustomer, discount, notes } = get();
    if (cart.length === 0) return;
    const id = `HOLD-${Date.now()}`;
    set({
      heldOrders: [...get().heldOrders, {
        id,
        cart: [...cart],
        customer: selectedCustomer,
        discount,
        notes,
        createdAt: new Date().toISOString(),
      }],
      cart: [],
      selectedCustomer: null,
      discount: 0,
      notes: '',
    });
  },

  resumeOrder: (id) => {
    const order = get().heldOrders.find(o => o.id === id);
    if (!order) return;
    set({
      cart: order.cart,
      selectedCustomer: order.customer,
      discount: order.discount,
      notes: order.notes,
      heldOrders: get().heldOrders.filter(o => o.id !== id),
    });
  },

  deleteHeldOrder: (id) => {
    set({ heldOrders: get().heldOrders.filter(o => o.id !== id) });
  },

  getSubtotal: () => get().cart.reduce((sum, item) => sum + item.total, 0),
  getTax: () => {
    const sub = get().getSubtotal() - get().discount;
    return (sub * get().taxRate) / 100;
  },
  getGrandTotal: () => {
    const sub = get().getSubtotal();
    return sub - get().discount + get().getTax();
  },
}));
