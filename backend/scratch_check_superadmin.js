import prisma from './src/config/db.js';

async function main() {
  const user = await prisma.user.findFirst({
    where: { username: 'superadmin' },
    include: { role: true }
  });
  console.log('Superadmin user:');
  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
