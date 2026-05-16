import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Permissions
  const permissions = [
    { name: 'Dashboard Access', key: 'dashboard.view', module: 'Dashboard' },
    { name: 'View Users', key: 'users.view', module: 'Users' },
    { name: 'Create Users', key: 'users.create', module: 'Users' },
    { name: 'Edit Users', key: 'users.edit', module: 'Users' },
    { name: 'Delete Users', key: 'users.delete', module: 'Users' },
    { name: 'View Roles', key: 'roles.view', module: 'Roles' },
    { name: 'Manage Permissions', key: 'roles.manage', module: 'Roles' },
    { name: 'View Income', key: 'income.view', module: 'Income' },
    { name: 'Create Income', key: 'income.create', module: 'Income' },
    { name: 'Edit Income', key: 'income.edit', module: 'Income' },
    { name: 'Delete Income', key: 'income.delete', module: 'Income' },
    { name: 'View Expenses', key: 'expenses.view', module: 'Expenses' },
    { name: 'Create Expenses', key: 'expenses.create', module: 'Expenses' },
    { name: 'Edit Expenses', key: 'expenses.edit', module: 'Expenses' },
    { name: 'Delete Expenses', key: 'expenses.delete', module: 'Expenses' },
    { name: 'View Reports', key: 'reports.view', module: 'Reports' },
  ];

  const permissionMap = {};
  for (const p of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key: p.key },
      update: { name: p.name, module: p.module },
      create: p,
    });
    permissionMap[p.key] = permission.id;
  }

  // 2. Seed Roles
  const roles = [
    { name: 'Superadmin', description: 'Full system access', perms: permissions.map(p => p.key) },
    { name: 'Admin', description: 'Administrative access', perms: ['dashboard.view', 'users.view', 'users.create', 'users.edit', 'income.view', 'income.create', 'expenses.view', 'expenses.create', 'reports.view'] },
    { name: 'Finance', description: 'Financial management access', perms: ['dashboard.view', 'income.view', 'income.create', 'income.edit', 'expenses.view', 'expenses.create', 'expenses.edit', 'reports.view'] },
    { name: 'Normal User', description: 'Basic operational access', perms: ['dashboard.view', 'income.view', 'expenses.view'] },
  ];

  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: {
        name: r.name,
        description: r.description,
      },
    });

    // Assign permissions
    for (const pKey of r.perms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permissionMap[pKey],
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permissionMap[pKey],
        },
      });
    }
  }

  // 3. Seed Income Categories
  const incomeCategories = [
    'Lacagta Rarista',
    'Lacagta Shidaalka',
    'Adeegyada Dheeraadka ah',
    'Sheegashada Caymiska',
    'Gunno',
    'Dakhli Kale'
  ];

  for (const name of incomeCategories) {
    await prisma.incomeCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 4. Seed Expense Categories
  const expenseCategories = [
    'Shidaal',
    'Dayactir',
    'Caymis',
    'Canshuurta Wadooyinka',
    'Diiwaangelinta',
    'Mushaharka Darawalka',
    'Lacagta Kirada',
    'Canshuuro',
    'Kharashyo Kale'
  ];

  for (const name of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
