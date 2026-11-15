import { useState, useEffect } from 'react';
import { ProductTypeCatalog } from '../types';
import { Layers, AlertCircle } from 'lucide-react';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<ProductTypeCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'خطا در دریافت اطلاعات');
        return data;
      })
      .then((data) => {
        if (data?.catalog) {
          setCatalog(data.catalog);
        }
      })
      .catch((err) => setError('خطا در دریافت کاتالوگ: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <span>کاتالوگ و تعرفه پایه انواع تابلو</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            انواع متریال استاندارد، واحدهای سنجش و نرخ مبنای محاسبه سفارشات در کارگاه آبرنگ
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">کد</th>
                <th className="py-3.5 px-4">عنوان محصول یا خدمت</th>
                <th className="py-3.5 px-4">واحد اندازه‌گیری</th>
                <th className="py-3.5 px-4">نرخ پایه برآورد (تومان)</th>
                <th className="py-3.5 px-4">توضیحات و مشخصات فنی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {catalog.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">{item.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {item.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    {formatPrice(item.defaultBasePrice)}
                  </td>
                  <td className="py-3 px-4 text-slate-500 leading-relaxed">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

