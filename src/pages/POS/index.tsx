import { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, User, Pause, CreditCard, X, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { usePOSStore } from '../../store/usePOSStore';
import { api } from '../../services/api';
import type { Product, Customer } from '../../types';
import { formatCurrency } from '../../utils/format';
import { toast } from '../../components/ui/Toast';
import { useAuthStore } from '../../store/useAuthStore';

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bkash' | 'nagad' | 'credit'>('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const {
    cart, selectedCustomer, discount, heldOrders,
    addToCart, updateQuantity, removeFromCart, clearCart,
    setCustomer, setDiscount, holdOrder, resumeOrder, deleteHeldOrder,
    getSubtotal, getTax, getGrandTotal,
  } = usePOSStore();

  const user = useAuthStore(s => s.user);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCustomers()]).then(([p, c]) => {
      if (p.success) setProducts(p.data);
      if (c.success) setCustomers(c.data);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.variants.some(v => v.sku.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoryFilter === 'all' || p.type === categoryFilter;
      return matchSearch && matchCat && p.is_active;
    });
  }, [products, search, categoryFilter]);

  const handleAddVariant = (product: Product, variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant || variant.stock <= 0) {
      toast.warning('Out of stock');
      return;
    }
    const existing = cart.find(c => c.variant_id === variantId);
    if (existing && existing.quantity >= variant.stock) {
      toast.warning('Not enough stock');
      return;
    }
    const label = [product.name, variant.size && `(${variant.size})`, variant.color, variant.purity, variant.weight && `${variant.weight}g`].filter(Boolean).join(' ');
    addToCart({
      product_id: product.id, variant_id: variant.id, name: label, sku: variant.sku,
      size: variant.size, color: variant.color, quantity: 1,
      unit_price: variant.selling_price, discount: 0, tax: 0,
      total: variant.selling_price, stock: variant.stock,
    });
  };

  const handlePayment = async () => {
    const total = getGrandTotal();
    const paid = paymentMethod === 'credit' ? 0 : parseFloat(paidAmount) || total;
    if (paymentMethod !== 'credit' && paid < total && !selectedCustomer) {
      toast.error('Select a customer for partial/due payment');
      return;
    }
    setProcessing(true);
    try {
      const res = await api.createSale({
        customer_id: selectedCustomer?.id,
        customer_name: selectedCustomer?.name || 'Walk-in Customer',
        items: cart.map(c => ({
          product_id: c.product_id, variant_id: c.variant_id, name: c.name, sku: c.sku,
          quantity: c.quantity, unit_price: c.unit_price, discount: c.discount, tax: 0, total: c.total,
        })),
        subtotal: getSubtotal(), discount, tax: getTax(), charges: 0,
        grand_total: total, paid_amount: paid, due_amount: Math.max(0, total - paid),
        payments: [{ method: paymentMethod, amount: paid }],
        created_by: user?.id || 'USR-001',
      });
      if (res.success) {
        toast.success(`Sale completed! Invoice: ${res.data?.invoice_no}`);
        clearCart();
        setShowPayment(false);
        setPaidAmount('');
      } else {
        toast.error(res.message || 'Sale failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setProcessing(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All' }, { id: 'clothing', label: 'Clothing' },
    { id: 'jewelry', label: 'Jewelry' }, { id: 'cosmetics', label: 'Cosmetics' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search product, SKU..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
          <div className="flex gap-1">
            {categories.map(c => (
              <button key={c.id} onClick={() => setCategoryFilter(c.id)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  categoryFilter === c.id ? 'bg-primary-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                }`}>{c.label}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map(product => (
              <div key={product.id} className="card overflow-hidden">
                <div className="flex h-16 items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/20">
                  <span className="text-2xl">{product.type === 'jewelry' ? '\ud83d\udc8e' : product.type === 'cosmetics' ? '\ud83d\udc84' : product.type === 'accessories' ? '\ud83d\udc5c' : '\ud83d\udc55'}</span>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.brand}</p>
                  <div className="mt-2 space-y-1">
                    {product.variants.map(v => (
                      <button key={v.id} onClick={() => handleAddVariant(product, v.id)} disabled={v.stock <= 0}
                        className="flex w-full items-center justify-between rounded-md border border-slate-100 px-2 py-1.5 text-left text-xs transition-colors hover:border-primary-300 hover:bg-primary-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-primary-900/30">
                        <span className="truncate">{[v.size, v.color, v.purity, v.weight && `${v.weight}g`].filter(Boolean).join(' / ') || v.sku}</span>
                        <span className="ml-1 shrink-0 font-medium text-primary-700">{formatCurrency(v.selling_price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex h-40 flex-col items-center justify-center text-slate-400">
              <ShoppingBag className="mb-2 h-8 w-8" /><p>No products found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 p-3 dark:border-slate-800">
          <button onClick={() => setShowCustomer(true)}
            className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm hover:border-primary-400 hover:bg-primary-50 dark:border-slate-600 dark:hover:bg-primary-900/20">
            <User className="h-4 w-4 text-slate-400" />
            {selectedCustomer ? <span className="font-medium">{selectedCustomer.name}</span> : <span className="text-slate-400">Select Customer</span>}
          </button>
          {selectedCustomer && (
            <button onClick={() => setCustomer(null)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <ShoppingBag className="mb-2 h-10 w-10" /><p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.variant_id} className="rounded-lg border border-slate-100 p-2.5 dark:border-slate-800">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.sku} \u2022 {formatCurrency(item.unit_price)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.variant_id)} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.variant_id, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variant_id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-3 dark:border-slate-800 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(getSubtotal())}</span></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Discount</span>
            <input type="number" className="w-24 rounded border border-slate-200 px-2 py-0.5 text-right text-sm dark:border-slate-700 dark:bg-slate-800"
              value={discount || ''} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} placeholder="0" />
          </div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Tax (5%)</span><span>{formatCurrency(getTax())}</span></div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold dark:border-slate-800">
            <span>Total</span><span className="text-primary-700">{formatCurrency(getGrandTotal())}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={holdOrder} disabled={cart.length === 0} className="flex-1"><Pause className="h-3.5 w-3.5" /> Hold</Button>
            <Button variant="accent" size="sm" className="flex-[2]" disabled={cart.length === 0}
              onClick={() => { setPaidAmount(getGrandTotal().toString()); setShowPayment(true); }}>
              <CreditCard className="h-3.5 w-3.5" /> Pay
            </Button>
          </div>
          {heldOrders.length > 0 && (
            <div className="pt-1">
              <p className="mb-1 text-xs font-medium text-slate-500">Held ({heldOrders.length})</p>
              {heldOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5 text-xs dark:bg-slate-800">
                  <span>{o.cart.length} items</span>
                  <div className="flex gap-1">
                    <button onClick={() => resumeOrder(o.id)} className="text-primary-600 hover:underline">Resume</button>
                    <button onClick={() => deleteHeldOrder(o.id)} className="text-red-500 hover:underline">\u00d7</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={showCustomer} onClose={() => setShowCustomer(false)} title="Select Customer" size="md">
        <Input placeholder="Search by name or phone..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="mb-3" />
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {filteredCustomers.map(c => (
            <button key={c.id} onClick={() => { setCustomer(c); setShowCustomer(false); setCustomerSearch(''); }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800">
              <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-slate-500">{c.phone}</p></div>
              {c.current_due > 0 && <Badge variant="warning">Due: {formatCurrency(c.current_due)}</Badge>}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Payment" size="md">
        <div className="space-y-4">
          <div className="rounded-lg bg-primary-50 p-4 text-center dark:bg-primary-900/30">
            <p className="text-sm text-slate-500">Amount Due</p>
            <p className="text-3xl font-bold text-primary-700">{formatCurrency(getGrandTotal())}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {(['cash', 'card', 'bkash', 'nagad', 'credit'] as const).map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)}
                className={`rounded-lg border py-2.5 text-xs font-medium capitalize transition-colors ${
                  paymentMethod === m ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/40' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                }`}>{m}</button>
            ))}
          </div>
          {paymentMethod !== 'credit' && (
            <Input label="Paid Amount" type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} placeholder="0" />
          )}
          {parseFloat(paidAmount) > getGrandTotal() && (
            <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">Change: {formatCurrency(parseFloat(paidAmount) - getGrandTotal())}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>Cancel</Button>
            <Button className="flex-1" loading={processing} onClick={handlePayment}>Complete Sale</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
