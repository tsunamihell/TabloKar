import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Palette,
  Hammer,
  Truck,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { ShopSetting } from '../types';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[]; // Allowed roles. If empty/undefined, all authenticated users have access.
  badge?: string;
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopSetting, setShopSetting] = useState<ShopSetting | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setShopSetting(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const navItems: NavItem[] = [
    { name: 'پیشخوان و آمار', path: '/', icon: LayoutDashboard },
    {
      name: 'سفارش‌ها و فاکتورها',
      path: '/orders',
      icon: ClipboardList,
      roles: ['Admin', 'Sales', 'Designer', 'Workshop', 'Installer', 'Cashier'],
    },
    { name: 'مشتریان', path: '/customers', icon: Users, roles: ['Admin', 'Sales'] },
    { name: 'طراحی و تأییدیه طرح', path: '/designs', icon: Palette, roles: ['Admin', 'Designer', 'Sales'] },
    { name: 'کارگاه و مراحل ساخت', path: '/workshop', icon: Hammer, roles: ['Admin', 'Workshop'] },
    { name: 'نصب و تحویل پروژه', path: '/installations', icon: Truck, roles: ['Admin', 'Installer'] },
    { name: 'صندوق و پرداخت‌ها', path: '/finance', icon: CreditCard, roles: ['Admin', 'Cashier'] },
    { name: 'کاتالوگ و نرخ پایه تابلو', path: '/catalog', icon: Layers, roles: ['Admin', 'Sales'] },
    { name: 'تنظیمات مغازه', path: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (user?.role.name === 'Admin') return true;
    return user?.role.name ? item.roles.includes(user.role.name) : false;
  });

  const handleLogout = async () => {
    if (window.confirm('آیا از خروج از حساب کاربری اطمینان دارید؟')) {
      try {
        await logout();
        navigate('/login');
      } catch {
        window.alert('خروج از حساب انجام نشد. اتصال به سرور را بررسی و دوباره تلاش کنید.');
      }
    }
  };

  const shopTitle = shopSetting?.shopName || 'چاپ و تابلوسازی آبرنگ';
  const shopCity = shopSetting?.city || 'میناب';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">{shopTitle}</h1>
            <p className="text-xs text-slate-400">شعبه {shopCity}</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          aria-label="منوی ناوبری"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 right-0 z-40 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Shop Info */}
        <div>
          <div className="p-5 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm text-white truncate" title={shopTitle}>
                {shopTitle}
              </h1>
              <p className="text-xs text-blue-400 mt-0.5">شهرستان {shopCity}</p>
            </div>
          </div>

          {/* User Badge */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {user?.fullName ? user.fullName[0] : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">@{user?.username}</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex-shrink-0">
                {user?.role.title}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronLeft className="w-3.5 h-3.5 opacity-70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-medium">سامانه مدیریت کارگاه</span>
          </div>

          <div className="text-xs text-slate-500">
            نسخه آزمایشی کارگاه • بدون وابستگی به اینترنت
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          <Outlet context={{ shopSetting, setShopSetting }} />
        </div>
      </main>
    </div>
  );
}

