import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function clearDatabase() {
  console.log("🧹 Clearing existing data...");
  // Delete in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.task.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.systemModule.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database cleared.");
}

async function createUser(
  email: string,
  name: string,
  password: string,
  roleId?: string,
  isSuperAdmin = false,
) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      isSuperAdmin,
      status: "ACTIVE",
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
  console.log("🌱 Starting comprehensive seeding...\n");

  await clearDatabase();

  // 1. SYSTEM MODULES
  const moduleData = [
    {
      name: "Dashboard",
      slug: "dashboard",
      description: "Overview and analytics",
    },
    { name: "Users", slug: "users", description: "User management" },
    { name: "Roles", slug: "roles", description: "Role and policy management" },
    {
      name: "Permissions",
      slug: "permissions",
      description: "Access control definitions",
    },
    {
      name: "System Modules",
      slug: "system_modules",
      description: "Platform component management",
    },
    { name: "Leads", slug: "leads", description: "Sales pipeline and CRM" },
    { name: "Tasks", slug: "tasks", description: "Project and action items" },
    {
      name: "Reports",
      slug: "reports",
      description: "Data intelligence and exports",
    },
    {
      name: "Audit Logs",
      slug: "audit_logs",
      description: "Security and activity tracking",
    },
    {
      name: "Settings",
      slug: "settings",
      description: "Global configurations",
    },
    {
      name: "Customer Portal",
      slug: "portal",
      description: "External user interface",
    },
  ];

  const createdModules: Record<string, any> = {};
  for (const mod of moduleData) {
    const m = await prisma.systemModule.create({
      data: mod,
    });
    createdModules[mod.slug] = m;
  }
  console.log("✅ Modules created.");

  // 2. PERMISSIONS
  const actions = ["READ", "WRITE", "UPDATE", "DELETE", "MANAGE"] as const;
  const allPermissions: Record<string, Record<string, any>> = {};

  for (const slug of Object.keys(createdModules)) {
    allPermissions[slug] = {};
    for (const action of actions) {
      const modName = moduleData.find((m) => m.slug === slug)?.name;
      const name = `${action.charAt(0) + action.slice(1).toLowerCase()} ${modName}`;
      const permSlug = `${slug.toUpperCase()}_${action}`;

      const perm = await prisma.permission.create({
        data: {
          action: action,
          name,
          slug: permSlug,
          moduleId: createdModules[slug].id,
        },
      });
      allPermissions[slug][action] = perm;
    }
  }
  console.log("✅ Permissions created.");

  // 3. ROLES
  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      description: "Full access to all platform resources",
      isSystem: true,
      hierarchyLevel: 1,
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: "Manager",
      description: "Can manage users, leads and tasks",
      isSystem: false,
      hierarchyLevel: 2,
    },
  });

  const agentRole = await prisma.role.create({
    data: {
      name: "Agent",
      description: "Can view and handle assigned leads/tasks",
      isSystem: false,
      hierarchyLevel: 3,
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "User",
      description: "Basic access to dashboard and portal",
      isSystem: true,
      hierarchyLevel: 4,
    },
  });

  console.log("✅ Roles created.");

  // 4. ASSIGN PERMISSIONS
  const assignAll = async (roleId: string, slug: string) => {
    for (const action of actions) {
      await prisma.rolePermission.create({
        data: { roleId, permissionId: allPermissions[slug][action].id },
      });
    }
  };

  const assignRead = async (roleId: string, slug: string) => {
    await prisma.rolePermission.create({
      data: { roleId, permissionId: allPermissions[slug]["READ"].id },
    });
  };

  // Admin -> everything
  for (const slug of Object.keys(createdModules)) {
    await assignAll(adminRole.id, slug);
  }

  // Manager -> everything except permissions/modules
  for (const slug of [
    "dashboard",
    "users",
    "roles",
    "leads",
    "tasks",
    "reports",
    "audit_logs",
    "settings",
    "portal",
  ]) {
    await assignAll(managerRole.id, slug);
  }

  // Agent -> dashboard, leads, tasks (READ/WRITE/UPDATE), portal
  for (const slug of ["dashboard", "portal"])
    await assignRead(agentRole.id, slug);
  for (const slug of ["leads", "tasks"]) {
    await prisma.rolePermission.create({
      data: {
        roleId: agentRole.id,
        permissionId: allPermissions[slug]["READ"].id,
      },
    });
    await prisma.rolePermission.create({
      data: {
        roleId: agentRole.id,
        permissionId: allPermissions[slug]["WRITE"].id,
      },
    });
    await prisma.rolePermission.create({
      data: {
        roleId: agentRole.id,
        permissionId: allPermissions[slug]["UPDATE"].id,
      },
    });
  }

  // User -> dashboard, portal, leads, tasks (READ ONLY)
  await assignRead(userRole.id, "dashboard");
  await assignRead(userRole.id, "portal");
  await assignRead(userRole.id, "leads");
  await assignRead(userRole.id, "tasks");

  console.log("✅ Permissions assigned.");

  // 5. USERS
  const superAdmin = await createUser(
    "superadmin@rbac.com",
    "Super Administrator",
    "Admin@123",
    undefined,
    true,
  );
  const admin = await createUser(
    "admin@rbac.com",
    "System Admin",
    "Admin@123",
    adminRole.id,
  );
  const manager = await createUser(
    "manager@rbac.com",
    "Saleh Manager",
    "Manager@123",
    managerRole.id,
  );
  const agent = await createUser(
    "agent@rbac.com",
    "Akash Agent",
    "Agent@123",
    agentRole.id,
  );
  const user = await createUser(
    "user@rbac.com",
    "Umme User",
    "User@123",
    userRole.id,
  );

  console.log("✅ Users created.");

  // 6. LEADS
  const leadStatuses = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "LOST",
    "WON",
  ] as const;
  for (let i = 1; i <= 10; i++) {
    await prisma.lead.create({
      data: {
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        phone: `+123456789${i}`,
        company: `Company ${Math.ceil(i / 2)}`,
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        source: i % 2 === 0 ? "Website" : "External Referral",
        assignedTo:
          i % 3 === 0 ? manager.id : i % 3 === 1 ? agent.id : admin.id,
      },
    });
  }
  console.log("✅ Leads created.");

  // 7. TASKS
  const taskStatuses = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const;
  for (let i = 1; i <= 15; i++) {
    await prisma.task.create({
      data: {
        title: `Task #${i}: ${i % 2 === 0 ? "Follow up with lead" : "Prepare report"}`,
        description: `Description for task ${i}. High priority item.`,
        status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)],
        dueDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        assignedTo: i % 2 === 0 ? agent.id : manager.id,
        createdBy: admin.id,
      },
    });
  }
  console.log("✅ Tasks created.");

  // 8. SETTINGS
  const settings = [
    {
      key: "site_name",
      value: "Dynamic RBAC Platform",
      description: "Public name of the site",
    },
    {
      key: "maintenance_mode",
      value: "false",
      description: "Enable/Disable maintenance",
    },
    {
      key: "allow_registration",
      value: "true",
      description: "Enable public user registration",
    },
    {
      key: "api_rate_limit",
      value: "1000",
      description: "Requests per hour per user",
    },
  ];
  for (const s of settings) {
    await prisma.systemSetting.create({
      data: { ...s, updatedBy: admin.id },
    });
  }
  console.log("✅ Settings created.");

  // 9. AUDIT LOGS
  const logActions = [
    { action: "LOGIN", mod: "auth" },
    { action: "CREATE_USER", mod: "users" },
    { action: "UPDATE_ROLE", mod: "roles" },
    { action: "CREATE_LEAD", mod: "leads" },
    { action: "UPDATE_TASK", mod: "tasks" },
  ];
  for (let i = 0; i < 20; i++) {
    const act = logActions[Math.floor(Math.random() * logActions.length)];
    await prisma.auditLog.create({
      data: {
        userId: [admin.id, manager.id, agent.id][Math.floor(Math.random() * 3)],
        action: act.action,
        module: act.mod,
        targetType: act.mod,
        ipAddress: `192.168.1.${100 + i}`,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ),
      },
    });
  }
  console.log("✅ Audit logs created.");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✨ Seeding complete! All modules are ready.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  🔑 Super Admin : superadmin@rbac.com -> Admin@123`);
  console.log("  🔑 Admin       : admin@rbac.com      -> Admin@123");
  console.log("  🔑 Manager     : manager@rbac.com    -> Manager@123");
  console.log("  🔑 Agent       : agent@rbac.com      -> Agent@123");
  console.log("  🔑 User        : user@rbac.com       -> User@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
