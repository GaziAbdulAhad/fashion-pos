import type { Product, Customer, Supplier, Category, Sale, User, Settings, DashboardStats } from '../types';

export const DEMO_USERS: User[] = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@fashionpos.com', phone: '01700000001', role: 'admin', is_active: true, created_at: '2025-01-01' },
  { id: 'USR-002', name: 'Rahim Cashier', email: 'cashier@fashionpos.com', phone: '01700000002', role: 'cashier', is_active: true, created_at: '2025-01-01' },
  { id: 'USR-003', name: 'Karim Manager', email: 'manager@fashionpos.com', phone: '01700000003', role: 'manager', is_active: true, created_at: '2025-01-01' },
];

export const DEMO_CATEGORIES: Category[] = [
  { id: 'CAT-001', name: 'Men Clothing', type: 'clothing', is_active: true },
  { id: 'CAT-002', name: 'Women Clothing', type: 'clothing', is_active: true },
  { id: 'CAT-003', name: 'Gold Jewelry', type: 'jewelry', is_active: true },
  { id: 'CAT-004', name: 'Silver Jewelry', type: 'jewelry', is_active: true },
  { id: 'CAT-005', name: 'Skincare', type: 'cosmetics', is_active: true },
  { id: 'CAT-006', name: 'Makeup', type: 'cosmetics', is_active: true },
  { id: 'CAT-007', name: 'Bags & Accessories', type: 'accessories', is_active: true },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'PRD-001', name: 'Premium Cotton Shirt', category_id: 'CAT-001', brand: 'FashionHub', type: 'clothing',
    has_variants: true, is_active: true, created_at: '2025-06-01',
    variants: [
      { id: 'VAR-001', sku: 'SHIRT-M-BLU', size: 'M', color: 'Blue', stock: 25, min_stock: 5, cost_price: 800, selling_price: 1490 },
      { id: 'VAR-002', sku: 'SHIRT-L-BLU', size: 'L', color: 'Blue', stock: 18, min_stock: 5, cost_price: 800, selling_price: 1490 },
      { id: 'VAR-003', sku: 'SHIRT-M-WHT', size: 'M', color: 'White', stock: 30, min_stock: 5, cost_price: 800, selling_price: 1490 },
      { id: 'VAR-004', sku: 'SHIRT-XL-BLK', size: 'XL', color: 'Black', stock: 12, min_stock: 5, cost_price: 850, selling_price: 1590 },
    ],
  },
  {
    id: 'PRD-002', name: 'Silk Saree - Banarasi', category_id: 'CAT-002', brand: 'Heritage', type: 'clothing',
    has_variants: true, is_active: true, created_at: '2025-06-01',
    variants: [
      { id: 'VAR-005', sku: 'SAREE-RED', color: 'Red', material: 'Silk', stock: 8, min_stock: 2, cost_price: 4500, selling_price: 8990 },
      { id: 'VAR-006', sku: 'SAREE-GRN', color: 'Green', material: 'Silk', stock: 5, min_stock: 2, cost_price: 4800, selling_price: 9500 },
    ],
  },
  {
    id: 'PRD-003', name: '22K Gold Necklace Set', category_id: 'CAT-003', brand: 'Golden Touch', type: 'jewelry',
    has_variants: true, is_active: true, created_at: '2025-06-01',
    variants: [
      { id: 'VAR-008', sku: 'GLD-NCK-22-15G', purity: '22K', weight: 15.2, stock: 4, min_stock: 1, cost_price: 145000, selling_price: 168000 },
      { id: 'VAR-009', sku: 'GLD-NCK-22-20G', purity: '22K', weight: 20.5, stock: 2, min_stock: 1, cost_price: 195000, selling_price: 225000 },
    ],
  },
  {
    id: 'PRD-005', name: 'Vitamin C Face Serum', category_id: 'CAT-005', brand: 'GlowSkin', type: 'cosmetics',
    has_variants: false, expiry_date: '2027-06-30', batch_no: 'GS-VC-2025-A', is_active: true, created_at: '2025-06-01',
    variants: [
      { id: 'VAR-012', sku: 'SERUM-VC-30ML', stock: 45, min_stock: 10, cost_price: 450, selling_price: 890 },
    ],
  },
  {
    id: 'PRD-006', name: 'Matte Lipstick Collection', category_id: 'CAT-006', brand: 'BeautyPro', type: 'cosmetics',
    has_variants: true, expiry_date: '2027-12-31', is_active: true, created_at: '2025-06-01',
    variants: [
      { id: 'VAR-013', sku: 'LIP-MAT-RED', color: 'Ruby Red', stock: 32, min_stock: 8, cost_price: 280, selling_price: 550 },
      { id: 'VAR-014', sku: 'LIP-MAT-PNK', color: 'Pink Nude', stock: 28, min_stock: 8, cost_price: 280, selling_price: 550 },
      { id: 'VAR-016', sku: 'LIP-MAT-COR', color: 'Coral', stock: 5, min_stock: 8, cost_price: 280, selling_price: 550 },
    ],
  },
  {
    id: 'PRD-007', name: 'Leather Handbag', category_id: 'CAT-007', brand: 'LuxeBag', type: 'accessories',
    has_variants: true, is_active: true, created_at: '2025-06-01',
    variants: [
      { id: 'VAR-017', sku: 'BAG-LTH-BLK', color: 'Black', material: 'Genuine Leather', stock: 10, min_stock: 2, cost_price: 3200, selling_price: 5990 },
      { id: 'VAR-018', sku: 'BAG-LTH-BRN', color: 'Brown', material: 'Genuine Leather', stock: 7, min_stock: 2, cost_price: 3200, selling_price: 5990 },
    ],
  },
];

export const DEMO_CUSTOMERS: Customer[] = [
  { id: 'CUS-001', name: 'Fatima Rahman', phone: '01711111111', email: 'fatima@email.com', address: 'Dhanmondi, Dhaka', opening_balance: 0, current_due: 2500, is_active: true, created_at: '2025-03-15' },
  { id: 'CUS-002', name: 'Karim Ahmed', phone: '01722222222', email: 'karim@email.com', address: 'Gulshan, Dhaka', opening_balance: 0, current_due: 0, is_active: true, created_at: '2025-04-20' },
  { id: 'CUS-003', name: 'Nusrat Jahan', phone: '01733333333', address: 'Uttara, Dhaka', opening_balance: 500, current_due: 12500, is_active: true, created_at: '2025-05-10' },
  { id: 'CUS-004', name: 'Walk-in Customer', phone: '00000000000', opening_balance: 0, current_due: 0, is_active: true, created_at: '2025-01-01' },
];

export const DEMO_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Dhaka Fashion Traders', phone: '01811111111', email: 'dft@email.com', address: 'New Market, Dhaka', opening_balance: 0, current_payable: 45000, is_active: true, created_at: '2025-02-01' },
  { id: 'SUP-002', name: 'Golden Jewellers Wholesale', phone: '01822222222', address: 'Bongshal, Dhaka', opening_balance: 0, current_payable: 320000, is_active: true, created_at: '2025-02-15' },
  { id: 'SUP-003', name: 'Beauty Cosmetics BD', phone: '01833333333', email: 'beauty@email.com', address: 'Mirpur, Dhaka', opening_balance: 0, current_payable: 18500, is_active: true, created_at: '2025-03-01' },
];

export const DEMO_SETTINGS: Settings = {
  business_name: 'Fashion & Glow Emporium',
  business_address: 'Shop 12-14, Bashundhara City, Dhaka-1212',
  phone: '02-55001234',
  email: 'info@fashionglow.com',
  tax_id: 'TIN-123456789',
  currency: 'BDT',
  currency_symbol: '\u09f3',
  tax_rate: 5,
  invoice_prefix: 'FGE',
  receipt_footer: 'Thank you for shopping with us! Exchange within 7 days with receipt.',
  timezone: 'Asia/Dhaka',
};

export const DEMO_SALES: Sale[] = [
  {
    id: 'SAL-001', invoice_no: 'FGE-2026-0001', customer_id: 'CUS-001', customer_name: 'Fatima Rahman',
    items: [
      { product_id: 'PRD-001', variant_id: 'VAR-001', name: 'Premium Cotton Shirt (M/Blue)', sku: 'SHIRT-M-BLU', quantity: 2, unit_price: 1490, discount: 0, tax: 149, total: 2980 },
      { product_id: 'PRD-006', variant_id: 'VAR-013', name: 'Matte Lipstick (Ruby Red)', sku: 'LIP-MAT-RED', quantity: 1, unit_price: 550, discount: 50, tax: 25, total: 500 },
    ],
    subtotal: 3480, discount: 50, tax: 174, charges: 0, grand_total: 3604, paid_amount: 3604, due_amount: 0,
    payments: [{ method: 'bkash', amount: 3604, reference: 'TXN123456' }],
    status: 'completed', created_by: 'USR-002', created_at: '2026-10-07T14:30:00',
  },
  {
    id: 'SAL-002', invoice_no: 'FGE-2026-0002', customer_id: 'CUS-003', customer_name: 'Nusrat Jahan',
    items: [
      { product_id: 'PRD-002', variant_id: 'VAR-005', name: 'Silk Saree - Banarasi (Red)', sku: 'SAREE-RED', quantity: 1, unit_price: 8990, discount: 500, tax: 424.5, total: 8490 },
    ],
    subtotal: 8990, discount: 500, tax: 424.5, charges: 0, grand_total: 8914.5, paid_amount: 5000, due_amount: 3914.5,
    payments: [{ method: 'cash', amount: 5000 }],
    status: 'completed', created_by: 'USR-002', created_at: '2026-10-07T16:15:00',
  },
];

export function getDashboardStats(): DashboardStats {
  return {
    today_sales: 12518.5,
    today_orders: 2,
    month_sales: 285600,
    month_profit: 98400,
    total_customers: DEMO_CUSTOMERS.length,
    total_products: DEMO_PRODUCTS.length,
    low_stock_count: DEMO_PRODUCTS.flatMap(p => p.variants).filter(v => v.stock <= v.min_stock).length,
    total_receivable: DEMO_CUSTOMERS.reduce((s, c) => s + c.current_due, 0),
    total_payable: DEMO_SUPPLIERS.reduce((s, c) => s + c.current_payable, 0),
    recent_sales: DEMO_SALES,
    top_products: [
      { name: 'Premium Cotton Shirt', qty: 45, amount: 67050 },
      { name: 'Matte Lipstick', qty: 38, amount: 20900 },
      { name: 'Silk Saree', qty: 12, amount: 108000 },
      { name: 'Vitamin C Serum', qty: 28, amount: 24920 },
    ],
    sales_chart: [
      { date: '01 Oct', amount: 18500 },
      { date: '02 Oct', amount: 22300 },
      { date: '03 Oct', amount: 15600 },
      { date: '04 Oct', amount: 28900 },
      { date: '05 Oct', amount: 31200 },
      { date: '06 Oct', amount: 24800 },
      { date: '07 Oct', amount: 12518 },
    ],
  };
}
