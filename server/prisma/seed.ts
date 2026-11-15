import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TabloKar database seed...');
  const existingAdmin = await prisma.user.findUnique({ where: { username: 'admin' } });
  const adminPassword = process.env.ADMIN_PASSWORD;
  const installerPassword = process.env.INSTALLER_PASSWORD;
  if (!existingAdmin && (!adminPassword || adminPassword.length < 12 || Buffer.byteLength(adminPassword, 'utf8') > 72)) {
    throw new Error('Set ADMIN_PASSWORD to 12 characters or more (maximum 72 UTF-8 bytes) before creating the admin.');
  }
  if (installerPassword && (installerPassword.length < 12 || Buffer.byteLength(installerPassword, 'utf8') > 72)) {
    throw new Error('INSTALLER_PASSWORD must contain at least 12 characters (maximum 72 UTF-8 bytes).');
  }

  // 1. Seed Roles
  const rolesData = [
    {
      name: 'Admin',
      title: 'مدیر',
      permissions: JSON.stringify(['*']),
    },
    {
      name: 'Sales',
      title: 'پذیرش و فروش',
      permissions: JSON.stringify(['customers:read', 'customers:write', 'orders:read', 'orders:write', 'invoices:read']),
    },
    {
      name: 'Designer',
      title: 'طراح',
      permissions: JSON.stringify(['orders:read', 'designs:read', 'designs:write']),
    },
    {
      name: 'Workshop',
      title: 'مسئول کارگاه و ساخت',
      permissions: JSON.stringify(['orders:read', 'production:read', 'production:write', 'inventory:read']),
    },
    {
      name: 'Installer',
      title: 'نصاب',
      permissions: JSON.stringify(['orders:read', 'installations:read', 'installations:write']),
    },
    {
      name: 'Cashier',
      title: 'صندوق و امور مالی',
      permissions: JSON.stringify(['invoices:read', 'invoices:write', 'payments:read', 'payments:write']),
    },
  ];

  const rolesMap = new Map<string, number>();

  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
    rolesMap.set(role.name, role.id);
  }

  // 2. Seed Default Admin User
  const adminRoleId = rolesMap.get('Admin')!;
  const adminPasswordHash = existingAdmin?.passwordHash ?? await bcrypt.hash(adminPassword!, 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      fullName: 'مدیر سیستم (چاپ آبرنگ)',
      passwordHash: adminPasswordHash,
      roleId: adminRoleId,
      phone: '09170000000',
      isActive: true,
    },
  });

  // Seed sample Installer user for testing role-based restrictions
  const installerRoleId = rolesMap.get('Installer')!;
  if (installerPassword) {
  const installerPasswordHash = await bcrypt.hash(installerPassword, 10);
  await prisma.user.upsert({
    where: { username: 'installer' },
    update: {},
    create: {
      username: 'installer',
      fullName: 'علی نصاب',
      passwordHash: installerPasswordHash,
      roleId: installerRoleId,
      phone: '09171112233',
      isActive: true,
    },
  });

  // 3. Seed Shop Settings (چاپ آبرنگ میناب)
  }
  await prisma.shopSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      shopName: 'چاپ و تابلوسازی آبرنگ',
      city: 'میناب',
      address: 'هرمزگان، میناب، بلوار امام خمینی',
      phone: '07642220000',
      mobile: '09170000000',
      currency: 'تومان',
      receiptHeader: 'چاپ آبرنگ میناب - فاکتور خدمات تابلوسازی',
      receiptFooter: 'از حسن اعتماد شما سپاسگزاریم. لطفاً در حفظ این فاکتور کوشا باشید.',
      tagline: 'طراحی و ساخت تخصصی انواع تابلوهای چلنیوم، کامپوزیت و نئون',
    },
  });

  // 4. Seed Product & Service Catalog
  const products = [
    {
      code: 'CHELENGK',
      name: 'حروف برجسته چلنیوم (چلنک)',
      unit: 'متر محیط',
      defaultBasePrice: 450000,
      description: 'لبه آلومینیومی با پلکسی تایوانی و روشنایی SMD ضدآب',
    },
    {
      code: 'COMPOSITE',
      name: 'زیرسازی نمای کامپوزیت',
      unit: 'متر مربع',
      defaultBasePrice: 1250000,
      description: 'ورق آلومینیوم کامپوزیت درجه یک ضد حریق با زیرسازی قوطی آهن',
    },
    {
      code: 'PLEXI',
      name: 'حروف کریستال و دوبل پلکسی',
      unit: 'متر محیط',
      defaultBasePrice: 380000,
      description: 'حروف تمام پلکسی گلاس با نوردهی یکدست و لبه کریستال',
    },
    {
      code: 'NEON_SILICON',
      name: 'نئون فلکسی سیلیکونی',
      unit: 'متر طول',
      defaultBasePrice: 220000,
      description: 'نئون منعطف ۱۲ ولت ضد آب در رنگ‌های متنوع مناسب دکور و ویترین',
    },
    {
      code: 'IRON_FRAME',
      name: 'اسکلت فلزی و آهن‌کشی تابلو',
      unit: 'متر مربع',
      defaultBasePrice: 420000,
      description: 'آهن‌کشی مستحکم با پروفیل سنگین ضد زنگ برای مقاومت باد در میناب',
    },
    {
      code: 'INSTALLATION',
      name: 'اجرت نصب و راه‌اندازی در محل',
      unit: 'پروژه',
      defaultBasePrice: 850000,
      description: 'نصب با داربست/جرثقیل و سیم‌کشی و تست ترانس',
    },
  ];

  for (const p of products) {
    await prisma.productTypeCatalog.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

