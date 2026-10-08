import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Truck, Receipt,
  BarChart3, Settings, LogOut, Gem, Warehouse,
  CreditCard, FileText, UserCog
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'cashier'] },
  { to: '/pos', icon: ShoppingCart, label: 'POS', roles: ['admin', 'manager', 'cashier'] },
  { to: '/sales', icon: Receipt, label: 'Sales', roles: ['admin', 'manager', 'cashier'] },
  { to: '/products', icon: Package, label: 'Products', roles: ['admin', 'manager', 'warehouse_staff'] },
  { to: '/inventory', icon: Warehouse, label: 'Inventory', roles: ['admin', 'manager', 'warehouse_staff'] },
  { to: '/customers', icon: Users, label: 'Customers', roles: ['admin', 'manager', 'cashier'] },
  { to: '/suppliers', icon: Truck, label: 'Suppliers', roles: ['admin', 'manager'] },
  { to: '/purchases', icon: CreditCard, label: 'Purchases', roles: ['admin', 'manager'] },
  { to: '/expenses', icon: FileText, label: 'Expenses', roles: ['admin', 'manager'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager'] },
  { to: '/users', icon: UserCog, label: 'Users', roles: ['admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin', 'manager'] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const role = user?.role || 'cashier';
  const filtered = navItems.filter(item => item.roles.includes(role));

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-primary-900 text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-3 border-b border-primary-800 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Fashion & Glow</h1>
            <p className="text-[10px] text-primary-300">POS System</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filtered.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-accent-500 text-white' : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-primary-800 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-primary-400 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary-300 hover:bg-primary-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
