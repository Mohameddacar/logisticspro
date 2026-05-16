import prisma from './src/config/db.js';

async function test() {
  try {
    console.log('Checking User table...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ User table accessible. Found:', users.length);
  } catch (err) {
    console.error('❌ User table NOT accessible:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
