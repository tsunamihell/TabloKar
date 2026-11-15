import { Construction, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/50">
          <Construction className="w-8 h-8" />
        </div>
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3">
          در دست توسعه
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <span>بازگشت به پیشخوان اصلی</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}

