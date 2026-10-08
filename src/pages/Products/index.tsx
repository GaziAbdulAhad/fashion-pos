import { useEffect, useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/format';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then(res => {
      if (res.success) setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.variants.some(v => v.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const typeBadge = (type: string) => {
    const map: Record<string, 'info' | 'warning' | 'success' | 'default'> = {
      clothing: 'info', jewelry: 'warning', cosmetics: 'success', accessories: 'default',
    };
    return map[type] || 'default';
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-slate-500">{products.length} products with variants</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.brand}</p>
                </div>
                <Badge variant={typeBadge(p.type)}>{p.type}</Badge>
              </div>
              {p.expiry_date && (
                <p className="mb-2 text-xs text-amber-600">Exp: {p.expiry_date} {p.batch_no && `\u2022 Batch: ${p.batch_no}`}</p>
              )}
              <div className="space-y-1">
                {p.variants.map(v => (
                  <div key={v.id} className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-slate-800">
                    <span>
                      {[v.size, v.color, v.purity, v.weight && `${v.weight}g`].filter(Boolean).join(' / ') || v.sku}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={v.stock <= v.min_stock ? 'font-medium text-red-500' : 'text-slate-500'}>
                        Stock: {v.stock}
                      </span>
                      <span className="font-medium">{formatCurrency(v.selling_price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center text-slate-400">
          <Package className="mb-2 h-8 w-8" />
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}
