import prisma from './src/config/db.js';
import bcrypt from 'bcrypt';

async function createSuperadmin() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@1212', salt);
  
  // Find Superadmin role
  const superadminRole = await prisma.role.findUnique({ where: { name: 'Superadmin' } });
  
  if (!superadminRole) {
    console.error('Superadmin role not found. Please seed the database first.');
    return;
  }

  const user = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: { 
      roleId: superadminRole.id,
      password: hashedPassword 
    },
    create: {
      fullName: 'Master Admin',
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      roleId: superadminRole.id,
      status: 'ACTIVE'
    }
  });
  
  console.log('Superadmin user created/updated: superadmin@example.com / Admin@1212');
  await prisma.$disconnect();
}

createSuperadmin().catch(e => {
  console.error(e);
  process.exit(1);
});
