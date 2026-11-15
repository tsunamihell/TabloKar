import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, ArrowLeft, Paintbrush } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('لطفاً نام کاربری و کلمه عبور را وارد کنید.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'نام کاربری یا کلمه عبور نادرست است.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4 ring-8 ring-blue-500/10">
            <Paintbrush className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">سامانه تابلوکار</h1>
          <p className="text-slate-400 text-sm mt-1">مدیریت سفارشات و تولید کارگاه چاپ و تابلوسازی آبرنگ میناب</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">ورود به حساب کاربری</h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نام کاربری</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: admin"
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-800 bg-white"
                  autoFocus
                  required
                />
                <User className="w-5 h-5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">کلمه عبور</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-800 bg-white"
                  required
                />
                <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>ورود به سیستم</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>


        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          سامانه تحت شبکه محلی مغازه • بدون نیاز به اینترنت
        </p>
      </div>
    </div>
  );
}

