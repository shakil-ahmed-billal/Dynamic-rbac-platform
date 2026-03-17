
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAll() {
  const perms = await prisma.permission.findMany({
    include: { module: true }
  });
  console.log('--- PERMISSIONS ---');
  perms.forEach(p => {
    console.log(`${p.module.slug}.${p.action} (ID: ${p.id})`);
  });

  const roles = await prisma.role.findMany({
    include: { 
      rolePermissions: {
        include: {
          permission: {
            include: { module: true }
          }
        }
      }
    }
  });

  console.log('\n--- ROLES ---');
  roles.forEach(r => {
    console.log(`Role: ${r.name}`);
    r.rolePermissions.forEach(rp => {
      console.log(` - ${rp.permission.module.slug}.${rp.permission.action}`);
    });
  });

  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });
  console.log('\n--- USERS ---');
  users.forEach(u => {
    console.log(`${u.email}: ${u.userRoles.map(ur => ur.role.name).join(', ')}`);
  });
}

listAll().catch(console.error).finally(() => prisma.$disconnect());
