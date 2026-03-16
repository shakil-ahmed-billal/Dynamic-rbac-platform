import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function createUser(
  email: string,
  name: string,
  password: string,
  roleId?: string,
  isSuperAdmin = false,
) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: hashed,
      isSuperAdmin,
      status: 'ACTIVE',
      ...(roleId
        ? {
            userRoles: {
              create: { roleId },
            },
          }
        : {}),
    },
  });
  return user;
}

async function main() {
  console.log('🌱 Seeding database with comprehensive test data...\n');

  // ───────────────────────────────────────────────
  // 1. SYSTEM MODULES
  // ───────────────────────────────────────────────
  const moduleNames = [
    { name: 'users',       description: 'User account management' },
    { name: 'roles',       description: 'Role management' },
    { name: 'permissions', description: 'Permission management' },
    { name: 'modules',     description: 'System module management' },
    { name: 'audit-logs',  description: 'Audit trail and activity logs' },
    { name: 'dashboard',   description: 'Dashboard and analytics overview' },
  ];

  const createdModules: Record<string, any> = {};
  for (const mod of moduleNames) {
    const m = await prisma.systemModule.upsert({
      where: { name: mod.name },
      update: {},
      create: { name: mod.name, description: mod.description },
    });
    createdModules[mod.name] = m;
  }
  console.log('✅ System modules created:', moduleNames.map((m) => m.name).join(', '));

  // ───────────────────────────────────────────────
  // 2. PERMISSIONS
  // ───────────────────────────────────────────────
  const actions = ['READ', 'WRITE', 'UPDATE', 'DELETE', 'MANAGE'] as const;
  const allPermissions: Record<string, Record<string, any>> = {};

  for (const modName of Object.keys(createdModules)) {
    allPermissions[modName] = {};
    for (const action of actions) {
      const perm = await prisma.permission.upsert({
        where: {
          action_moduleId: {
            action: action as any,
            moduleId: createdModules[modName].id,
          },
        },
        update: {},
        create: {
          action: action as any,
          moduleId: createdModules[modName].id,
        },
      });
      allPermissions[modName][action] = perm;
    }
  }
  console.log('✅ Created 30 permissions across all modules');

  // ───────────────────────────────────────────────
  // 3. ROLES
  // ───────────────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Full access to all platform resources', isSystem: true },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: { name: 'Editor', description: 'Can read and update users and content', isSystem: false },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'Viewer' },
    update: {},
    create: { name: 'Viewer', description: 'Read-only access to all resources', isSystem: false },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'Moderator' },
    update: {},
    create: { name: 'Moderator', description: 'Can manage users and view audit logs', isSystem: false },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User', description: 'Basic registered user with minimal access', isSystem: true },
  });

  console.log('✅ Roles created: Admin, Editor, Viewer, Moderator, User');

  // ───────────────────────────────────────────────
  // 4. ASSIGN PERMISSIONS TO ROLES
  // ───────────────────────────────────────────────
  const assignPerm = async (roleId: string, permId: string) => {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId: permId } },
      update: {},
      create: { roleId, permissionId: permId },
    });
  };

  // Admin → ALL permissions on ALL modules
  for (const modName of Object.keys(allPermissions)) {
    for (const action of actions) {
      await assignPerm(adminRole.id, allPermissions[modName][action].id);
    }
  }

  // Editor → READ/WRITE/UPDATE on users + read dashboard/roles/permissions
  for (const perm of [
    allPermissions['users']['READ'],
    allPermissions['users']['WRITE'],
    allPermissions['users']['UPDATE'],
    allPermissions['dashboard']['READ'],
    allPermissions['roles']['READ'],
    allPermissions['permissions']['READ'],
  ]) {
    await assignPerm(editorRole.id, perm.id);
  }

  // Viewer → READ on everything
  for (const modName of Object.keys(allPermissions)) {
    await assignPerm(viewerRole.id, allPermissions[modName]['READ'].id);
  }

  // Moderator → READ+MANAGE users, READ audit-logs+dashboard
  for (const perm of [
    allPermissions['users']['READ'],
    allPermissions['users']['MANAGE'],
    allPermissions['audit-logs']['READ'],
    allPermissions['dashboard']['READ'],
  ]) {
    await assignPerm(moderatorRole.id, perm.id);
  }

  // User → READ dashboard only
  await assignPerm(userRole.id, allPermissions['dashboard']['READ'].id);

  console.log('✅ Permissions assigned to all roles');

  // ───────────────────────────────────────────────
  // 5. USERS
  // ───────────────────────────────────────────────
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@rbac.com';
  const superAdminPwd   = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';

  await createUser(superAdminEmail, 'Super Admin', superAdminPwd, undefined, true);
  console.log(`✅ Super Admin : ${superAdminEmail} → ${superAdminPwd}`);

  await createUser('admin@rbac.com', 'Admin User', 'Admin@123', adminRole.id);
  console.log('✅ Admin       : admin@rbac.com → Admin@123');

  await createUser('editor@rbac.com', 'Alice Editor', 'Editor@123', editorRole.id);
  console.log('✅ Editor      : editor@rbac.com → Editor@123');

  await createUser('viewer@rbac.com', 'Bob Viewer', 'Viewer@123', viewerRole.id);
  console.log('✅ Viewer      : viewer@rbac.com → Viewer@123');

  await createUser('moderator@rbac.com', 'Carol Moderator', 'Mod@12345', moderatorRole.id);
  console.log('✅ Moderator   : moderator@rbac.com → Mod@12345');

  const regularUsers = [
    { name: 'John Smith',   email: 'john.smith@rbac.com' },
    { name: 'Emma Wilson',  email: 'emma.wilson@rbac.com' },
    { name: 'Liam Johnson', email: 'liam.johnson@rbac.com' },
    { name: 'Olivia Brown', email: 'olivia.brown@rbac.com' },
    { name: 'Noah Davis',   email: 'noah.davis@rbac.com' },
  ];
  for (const u of regularUsers) {
    await createUser(u.email, u.name, 'User@12345', userRole.id);
  }
  console.log('✅ 5 regular users created → User@12345');

  // ───────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Seeding complete! Test accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  🔑 Super Admin : ${superAdminEmail} → ${superAdminPwd}`);
  console.log('  🔑 Admin       : admin@rbac.com         → Admin@123');
  console.log('  🔑 Editor      : editor@rbac.com        → Editor@123');
  console.log('  🔑 Viewer      : viewer@rbac.com        → Viewer@123');
  console.log('  🔑 Moderator   : moderator@rbac.com     → Mod@12345');
  console.log('  🔑 Users       : john.smith@rbac.com    → User@12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
