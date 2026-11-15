import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-700 font-medium">در حال بررسی اطلاعات کاربری...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user.role.name !== 'Admin' && !allowedRoles.includes(user.role.name)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">عدم دسترسی به این بخش</h2>
          <p className="text-slate-600 text-sm mb-6">
            نقش شما «{user.role.title}» است و مجوز دسترسی به این صفحه را ندارید. دسترسی به این صفحه برای نقش‌های مجاز محدود شده است.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition"
          >
            بازگشت به پیشخوان اصلی
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

