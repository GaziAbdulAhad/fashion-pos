import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Users, AlertTriangle, DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import type { DashboardStats } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(res => {
      if (res.success) setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  const kpis = [
    { label: "Today's Sales", value: formatCurrency(stats.today_sales), icon: DollarSign, color: 'bg-emerald-500' },
    { label: "Today's Orders", value: stats.today_orders.toString(), icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Month Sales', value: formatCurrency(stats.month_sales), icon: TrendingUp, color: 'bg-violet-500' },
    { label: 'Month Profit', value: formatCurrency(stats.month_profit), icon: Wallet, color: 'bg-accent-500' },
    { label: 'Customers', value: stats.total_customers.toString(), icon: Users, color: 'bg-cyan-500' },
    { label: 'Low Stock', value: stats.low_stock_count.toString(), icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Receivable', value: formatCurrency(stats.total_receivable), icon: ArrowUpRight, color: 'bg-orange-500' },
    { label: 'Payable', value: formatCurrency(stats.total_payable), icon: ArrowDownRight, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500">Fashion \u2022 Jewelry \u2022 Cosmetics overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${kpi.color}`}>
                <kpi.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">{kpi.label}</p>
                <p className="truncate text-lg font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Sales Trend (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.sales_chart}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#486581" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#486581" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="amount" stroke="#486581" fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.top_products} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="amount" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Sales</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_sales.map(sale => (
                  <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3 font-medium text-primary-700">{sale.invoice_no}</td>
                    <td className="px-5 py-3">{sale.customer_name || 'Walk-in'}</td>
                    <td className="px-5 py-3">{sale.items.length}</td>
                    <td className="px-5 py-3 font-medium">{formatCurrency(sale.grand_total)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={sale.due_amount > 0 ? 'warning' : 'success'}>
                        {sale.due_amount > 0 ? 'Partial' : 'Paid'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDateTime(sale.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
