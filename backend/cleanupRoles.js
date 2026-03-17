
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('🚀 Starting role cleanup for users without roles...');

  const usersWithoutRoles = await prisma.user.findMany({
    where: {
      userRoles: {
        none: {}
      },
      isSuperAdmin: false
    }
  });

  console.log(`🔍 Found ${usersWithoutRoles.length} users without roles.`);

  if (usersWithoutRoles.length === 0) {
    console.log('✅ No users need cleanup.');
    return;
  }

  const userRole = await prisma.role.findUnique({ where: { name: 'User' } });
  if (!userRole) {
    console.error('❌ "User" role not found in database. Please run seeding first.');
    return;
  }

  let successCount = 0;
  for (const user of usersWithoutRoles) {
    try {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id
        }
      });
      console.log(`✅ Assigned 'User' role to: ${user.email}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to assign role to ${user.email}:`, error.message);
    }
  }

  console.log(`\n🎉 Cleanup complete! ${successCount}/${usersWithoutRoles.length} users fixed.`);
}

cleanup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
