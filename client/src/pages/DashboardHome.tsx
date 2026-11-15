import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopSetting } from '../types';
import {
  ClipboardList,
  Store,
  Palette,
  Truck,
  PlusCircle,
  FileCheck2,
  PhoneCall,
  Clock,
  Layers
} from 'lucide-react';

interface OutletContextType {
  shopSetting: ShopSetting | null;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const { shopSetting } = useOutletContext<OutletContextType>();

  const shopName = shopSetting?.shopName || 'چاپ و تابلوسازی آبرنگ';
  const shopCity = shopSetting?.city || 'میناب';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-medium mb-3 border border-blue-400/20">
            <span>سیستم محلی کارگاه</span>
            <span>•</span>
            <span>شهرستان {shopCity}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            به سامانه مدیریت {shopName} خوش آمدید
          </h1>
          <p className="text-blue-100/80 text-sm max-w-2xl leading-relaxed">
            کاربر گرامی <span className="font-bold text-white">{user?.fullName}</span> (نقش: {user?.role.title})،
            در این نسخه، ورود کاربران، تنظیمات مغازه و مشاهدهٔ کاتالوگ فعال است. سایر بخش‌ها در حال توسعه هستند.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>مشاهده و ثبت سفارش</span>
            </Link>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white rounded-xl text-xs font-medium border border-blue-400/30 transition"
            >
              <Layers className="w-4 h-4" />
              <span>نرخ‌نامه و کاتالوگ تابلوها</span>
            </Link>

            {user?.role.name === 'Admin' && (
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white rounded-xl text-xs font-medium border border-blue-400/30 transition"
              >
                <Store className="w-4 h-4" />
                <span>ویرایش اطلاعات مغازه</span>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Quick Status Cards */}
      <p className="text-sm text-amber-700">آمار زیر نمونهٔ نمایشی است؛ ماژول‌های سفارش، تولید و نصب هنوز فعال نشده‌اند.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">سفارش‌های در حال بررسی</p>
            <p className="text-xl font-bold text-slate-800 mt-1">۳ سفارش</p>
            <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">نیازمند پیش‌فاکتور</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">طرح‌های در انتظار تایید</p>
            <p className="text-xl font-bold text-slate-800 mt-1">۲ پروژه</p>
            <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">ارسال شده به مشتری</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Palette className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">در حال ساخت در کارگاه</p>
            <p className="text-xl font-bold text-slate-800 mt-1">۴ تابلو</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">چلنیوم و کامپوزیت</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">پروژه‌های آماده نصب</p>
            <p className="text-xl font-bold text-slate-800 mt-1">۱ پروژه</p>
            <span className="text-[11px] text-indigo-600 font-medium mt-1 inline-block">هماهنگ شده برای فردا</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Workshop Profile Summary & Operating Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <span>گردش کار استاندارد تابلوکار در کارگاه میناب</span>
          </h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">۱</span>
              <div>
                <p className="text-xs font-bold text-slate-800">ثبت اولیه و دریافت بیعانه</p>
                <p className="text-[11px] text-slate-600 mt-0.5">دریافت مشخصات تابلو (ابعاد حدودی یا بازدید حضوری) و ثبت بیعانه نقدی یا دستگاه کارتخوان.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">۲</span>
              <div>
                <p className="text-xs font-bold text-slate-800">طراحی و تأییدیه کتبی مشتری</p>
                <p className="text-[11px] text-slate-600 mt-0.5">آماده‌سازی فایل برش، موکاپ روی سردر مغازه و تأییدیه صریح مشتری قبل از شروع ساخت.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">۳</span>
              <div>
                <p className="text-xs font-bold text-slate-800">ساخت، نصب و تسویه نهایی</p>
                <p className="text-[11px] text-slate-600 mt-0.5">برش پلکسی، لبه‌کنی چلنیوم، اسکلت‌سازی آهن و نصب در محل میناب با صدور فاکتور نهایی به تومان.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>مشخصات تماس کارگاه</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">نام مرکز:</span>
                <span className="font-semibold text-slate-800">{shopSetting?.shopName || 'چاپ و تابلوسازی آبرنگ'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">شهر:</span>
                <span className="font-semibold text-slate-800">{shopSetting?.city || 'میناب'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">تلفن ثابت:</span>
                <span className="font-semibold text-slate-800 dir-ltr text-right inline-block">{shopSetting?.phone || '۰۷۶۴۲۲۲۰۰۰۰'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">همراه و واتساپ:</span>
                <span className="font-semibold text-slate-800 dir-ltr text-right inline-block">{shopSetting?.mobile || '۰۹۱۷۰۰۰۰۰۰۰'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">نشانی:</span>
                <span className="text-slate-700">{shopSetting?.address || 'هرمزگان، میناب، بلوار امام خمینی'}</span>
              </div>
            </div>
          </div>

          {user?.role.name === 'Admin' && (
            <Link
              to="/settings"
              className="mt-6 block text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              ویرایش اطلاعات مغازه
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

