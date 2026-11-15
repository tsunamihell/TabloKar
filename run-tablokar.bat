@echo off
chcp 65001 > nul
title سامانه تابلوکار - مدیریت کارگاه چاپ و تابلوسازی آبرنگ میناب

echo ======================================================================
echo    سامانه مدیریت کارگاه تابلوسازی تابلوکار
echo    چاپ و تابلوسازی آبرنگ میناب
echo ======================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [خطا] محیط Node.js روی این سیستم نصب نیست یا در PATH قرار ندارد.
    echo لطفاً ابتدا Node.js را نصب کنید.
    pause
    exit /b 1
)

cd /d "%~dp0"

if not exist "node_modules" (
    echo [اطلاعیه] در حال نصب وابستگی‌های اولیه سیستم...
    call npm install
    if errorlevel 1 (
        echo [خطا] نصب بسته‌ها با شکست مواجه شد.
        pause
        exit /b 1
    )
)

if not exist "server\.env" (
    echo [Error] Create server\.env using server\.env.example first.
    pause
    exit /b 1
)

rem Prisma resolves DATABASE_URL; do not guess the database path.
rem Seed inserts missing records and preserves existing settings and accounts.
cd server
call npx prisma migrate deploy
if errorlevel 1 exit /b 1
call npx tsx prisma/seed.ts
if errorlevel 1 exit /b 1
cd ..

echo [موفقیت] پایگاه داده محلی آماده است.
echo [اطلاعیه] در حال راه‌اندازی سرور و رابط کاربری...
echo.
echo آدرس سامانه در مرورگر: http://localhost:5173
echo جهت دسترسی سایر سیستم‌ها در شبکه داخلی مغازه، از IP این سیستم استفاده کنید.
echo.

timeout /t 3 >nul
start http://localhost:5173

npm run dev

