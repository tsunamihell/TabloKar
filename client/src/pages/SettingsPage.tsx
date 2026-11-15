import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShopSetting } from '../types';
import { Store, Save, CheckCircle2, AlertCircle, MapPin, Phone, FileText } from 'lucide-react';

interface OutletContextType {
  shopSetting: ShopSetting | null;
  setShopSetting: React.Dispatch<React.SetStateAction<ShopSetting | null>>;
}

export default function SettingsPage() {
  const { shopSetting, setShopSetting } = useOutletContext<OutletContextType>();
  const [formData, setFormData] = useState<Partial<ShopSetting>>({
    shopName: '',
    tagline: '',
    city: 'میناب',
    address: '',
    phone: '',
    mobile: '',
    currency: 'تومان',
    receiptHeader: '',
    receiptFooter: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'خطا در دریافت اطلاعات');
        return data;
      })
      .then((data) => {
        if (data?.settings) {
          setFormData(data.settings);
          setShopSetting(data.settings);
        }
      })
      .catch((err) => {
        setErrorMessage('خطا در بارگذاری تنظیمات از سرور: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, [setShopSetting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ذخیره‌سازی تنظیمات');
      }

      setSuccessMessage('تنظیمات مغازه با موفقیت به‌روزرسانی شد.');
      setShopSetting(data.settings);
      setFormData(data.settings);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" />
            <span>تنظیمات پروفایل کارگاه و مغازه</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مشخصات مغازه، اطلاعات تماس، سربرگ و پانویس فاکتورهای چاپی
          </p>
        </div>

        <button
          type="submit"
          form="shop-settings-form"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات</span>
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <form id="shop-settings-form" onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Section 1: General Info */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-600" />
            <span>اطلاعات اصلی کارگاه</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نام مغازه یا تابلوسازی <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName || ''}
                onChange={handleChange}
                placeholder="مثال: چاپ و تابلوسازی آبرنگ"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">شهر یا شهرستان</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="مثال: میناب"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">شعار یا زمینه فعالیت</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                placeholder="مثال: طراحی و ساخت انواع تابلوهای چلنیوم، کامپوزیت و نئون"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>اطلاعات تماس و نشانی</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">تلفن مغازه / کارگاه</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="07642220000"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">شماره همراه / واتساپ</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleChange}
                placeholder="09170000000"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>آدرس دقیق کارگاه یا دفتر سفارشات</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="هرمزگان، میناب، بلوار امام خمینی..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Receipt & Currency */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>تنظیمات چاپ فاکتور و واحد پول</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">واحد پول پیش‌فرض</label>
              <input
                type="text"
                name="currency"
                value={formData.currency || 'تومان'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-600"
                readOnly
              />
              <p className="text-[11px] text-slate-500 mt-1">تمام محاسبات مالی سیستم به صورت استاندارد با تومان محاسبه می‌شود.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">متن سربرگ فاکتور و رسید مشتری</label>
              <input
                type="text"
                name="receiptHeader"
                value={formData.receiptHeader || ''}
                onChange={handleChange}
                placeholder="چاپ آبرنگ میناب - فاکتور خدمات تابلوسازی"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">متن پانویس فاکتور و شرایط تحویل</label>
              <textarea
                name="receiptFooter"
                rows={3}
                value={formData.receiptFooter || ''}
                onChange={handleChange}
                placeholder="از حسن اعتماد شما سپاسگزاریم..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

