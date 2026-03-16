import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  // 1. Create Super Admin User
  const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      name: superAdminName,
      password: hashedPassword,
      isSuperAdmin: true,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // 2. Create Core Modules
  const modules = ['users', 'roles', 'permissions', 'modules', 'audit-logs'];
  const createdModules = await Promise.all(
    modules.map((name) =>
      prisma.systemModule.upsert({
        where: { name },
        update: {},
        create: { name, description: `Core ${name} management module` },
      }),
    ),
  );
  console.log('✅ Core modules created');

  // 3. Create Basic Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'System Administrator' },
  });
  
  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User', description: 'Regular System User' },
  });
  console.log('✅ Basic roles created');

  // 4. Create Permissions for each module
  const actions = ['READ', 'WRITE', 'UPDATE', 'DELETE', 'MANAGE'];
  
  for (const module of createdModules) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: {
          action_moduleId: {
            action: action as any,
            moduleId: module.id,
          },
        },
        update: {},
        create: {
          action: action as any,
          moduleId: module.id,
        },
      });

      // Assign MANAGE and READ permissions to Admin for all modules
      if (action === 'MANAGE' || action === 'READ') {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: adminRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }
  console.log('✅ Permissions created and assigned to Admin role');

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
