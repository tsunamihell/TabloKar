import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardHome from './pages/DashboardHome';
import SettingsPage from './pages/SettingsPage';
import CatalogPage from './pages/CatalogPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="catalog" element={<CatalogPage />} />
            <Route
              path="orders"
              element={
                <PlaceholderPage
                  title="مدیریت سفارش‌ها و صدور پیش‌فاکتور"
                  description="ماژول ثبت مشخصات تابلو، صدور پیش‌فاکتور رسمی، دریافت بیعانه و تخصیص کد پیگیری در مراحل بعدی تکمیل خواهد شد."
                />
              }
            />
            <Route
              path="customers"
              element={
                <PlaceholderPage
                  title="بانک مشتریان و کارفرمایان"
                  description="ثبت مشخصات مغازه‌داران، شرکت‌ها، شماره‌های تماس و تاریخچه سفارشات تابلوسازی."
                />
              }
            />
            <Route
              path="designs"
              element={
                <PlaceholderPage
                  title="آتلیه طراحی و تأییدیه نهایی مشتری"
                  description="مدیریت فایل‌های وکتور، موکاپ‌های سردر مغازه و ثبت تأییدیه صریح مشتری قبل از برش چلنیوم و پلکسی."
                />
              }
            />
            <Route
              path="workshop"
              element={
                <PlaceholderPage
                  title="کارگاه، لبه‌کنی و مونتاژ تابلو"
                  description="پیگیری مراحل واقعی ساخت، مصرف ورق‌های کامپوزیت، روشنایی اس‌ام‌دی، ترانس و تست نهایی."
                />
              }
            />
            <Route
              path="installations"
              element={
                <PlaceholderPage
                  title="برنامه‌ریزی نصب و اعزام نصاب"
                  description="هماهنگی داربست، جرثقیل، زمان‌بندی نصاب‌ها و نصب مقاوم در برابر شرایط جوی میناب."
                />
              }
            />
            <Route
              path="finance"
              element={
                <PlaceholderPage
                  title="صندوق، دریافت وجه و تسویه حساب"
                  description="ثبت بیعانه، مبالغ دستگاه کارتخوان، مانده حساب کارفرما و صدور رسید تسویه به تومان."
                />
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
