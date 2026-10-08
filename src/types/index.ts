export type UserRole = 'admin' | 'manager' | 'cashier' | 'warehouse_staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id?: string | null;
  type: 'clothing' | 'jewelry' | 'cosmetics' | 'accessories';
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  size?: string;
  color?: string;
  material?: string;
  purity?: string;
  weight?: number;
  stock: number;
  min_stock: number;
  cost_price: number;
  selling_price: number;
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  brand?: string;
  description?: string;
  image_url?: string;
  type: 'clothing' | 'jewelry' | 'cosmetics' | 'accessories';
  has_variants: boolean;
  variants: ProductVariant[];
  expiry_date?: string;
  batch_no?: string;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  opening_balance: number;
  current_due: number;
  is_active: boolean;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  opening_balance: number;
  current_payable: number;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  variant_id: string;
  name: string;
  sku: string;
  size?: string;
  color?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  total: number;
  stock: number;
}

export interface SaleItem {
  product_id: string;
  variant_id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Payment {
  method: 'cash' | 'card' | 'bkash' | 'nagad' | 'bank' | 'credit';
  amount: number;
  reference?: string;
}

export interface Sale {
  id: string;
  invoice_no: string;
  customer_id?: string;
  customer_name?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  charges: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  payments: Payment[];
  status: 'draft' | 'held' | 'completed' | 'cancelled' | 'returned';
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  purchase_no: string;
  supplier_id: string;
  supplier_name: string;
  items: any[];
  subtotal: number;
  tax: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  status: 'pending' | 'partial' | 'received' | 'cancelled';
  created_at: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  payment_method: string;
  description?: string;
  created_by: string;
}

export interface Settings {
  business_name: string;
  business_address: string;
  phone: string;
  email: string;
  tax_id?: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  invoice_prefix: string;
  receipt_footer: string;
  logo_url?: string;
  timezone: string;
}

export interface DashboardStats {
  today_sales: number;
  today_orders: number;
  month_sales: number;
  month_profit: number;
  total_customers: number;
  total_products: number;
  low_stock_count: number;
  total_receivable: number;
  total_payable: number;
  recent_sales: Sale[];
  top_products: { name: string; qty: number; amount: number }[];
  sales_chart: { date: string; amount: number }[];
}
