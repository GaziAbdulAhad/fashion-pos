import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import type { Sale } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSales().then(res => {
      if (res.success) setSales(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Sales</h1>
        <p className="text-sm text-slate-500">{sales.length} transactions</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Paid</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3 font-medium text-primary-700">{s.invoice_no}</td>
                    <td className="px-5 py-3">{s.customer_name || 'Walk-in'}</td>
                    <td className="px-5 py-3">{s.items.length}</td>
                    <td className="px-5 py-3 font-medium">{formatCurrency(s.grand_total)}</td>
                    <td className="px-5 py-3">{formatCurrency(s.paid_amount)}</td>
                    <td className="px-5 py-3">
                      {s.due_amount > 0 ? <span className="text-amber-600 font-medium">{formatCurrency(s.due_amount)}</span> : '\u2014'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={s.due_amount > 0 ? 'warning' : 'success'}>
                        {s.due_amount > 0 ? 'Partial' : 'Paid'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDateTime(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sales.length === 0 && (
            <div className="flex h-40 flex-col items-center justify-center text-slate-400">
              <Receipt className="mb-2 h-8 w-8" />
              <p>No sales yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
