var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express5 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/routes/index.ts
import { Router as Router9 } from "express";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/middlewares/checkAuth.ts
import status2 from "http-status";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";

// src/errors/AppError.ts
var AppError = class extends Error {
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/config/index.ts
import status from "http-status";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "FRONTEND_URL",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_NAME"
  ];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME
  };
};
var envVars = loadEnvVariables();
var config_default = envVars;

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// \u2500\u2500\u2500 Enums \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\n// \u2500\u2500\u2500 Core Auth Models \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel User {\n  id                 String     @id @default(cuid())\n  name               String\n  email              String     @unique\n  password           String\n  profilePhoto       String?\n  gender             Gender?\n  contactNumber      String?\n  address            String?\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  isSuperAdmin       Boolean    @default(false)\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n\n  // Relations\n  userRoles       UserRole[]\n  auditLogs       AuditLog[]\n  managedUsers    User[]           @relation("UserManager")\n  managerId       String?\n  manager         User?            @relation("UserManager", fields: [managerId], references: [id])\n  userPermissions UserPermission[]\n\n  assignedLeads   Lead[]\n  assignedTasks   Task[]          @relation("TaskAssignee")\n  createdTasks    Task[]          @relation("TaskCreator")\n  updatedSettings SystemSetting[]\n\n  @@index([managerId])\n  @@map("users")\n}\n\n// \u2500\u2500\u2500 Business Models \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nenum LeadStatus {\n  NEW\n  CONTACTED\n  QUALIFIED\n  LOST\n  WON\n}\n\nmodel Lead {\n  id         String     @id @default(cuid())\n  name       String\n  email      String\n  phone      String?\n  company    String?\n  status     LeadStatus @default(NEW)\n  source     String?\n  assignedTo String?\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n\n  assignee User? @relation(fields: [assignedTo], references: [id], onDelete: SetNull)\n\n  @@map("leads")\n}\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  REVIEW\n  DONE\n}\n\nmodel Task {\n  id          String     @id @default(cuid())\n  title       String\n  description String?\n  status      TaskStatus @default(TODO)\n  dueDate     DateTime?\n  assignedTo  String?\n  createdBy   String // userId of creator\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  assignee User? @relation("TaskAssignee", fields: [assignedTo], references: [id], onDelete: SetNull)\n  creator  User  @relation("TaskCreator", fields: [createdBy], references: [id], onDelete: Cascade)\n\n  @@map("tasks")\n}\n\nmodel SystemSetting {\n  id          String   @id @default(cuid())\n  key         String   @unique\n  value       String\n  description String?\n  updatedBy   String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  updater User? @relation(fields: [updatedBy], references: [id], onDelete: SetNull)\n\n  @@map("system_settings")\n}\n\n// \u2500\u2500\u2500 RBAC Models \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Role {\n  id             String   @id @default(cuid())\n  name           String   @unique\n  description    String?\n  isSystem       Boolean  @default(false) // system roles cannot be deleted (SUPER_ADMIN)\n  isActive       Boolean  @default(true)\n  hierarchyLevel Int      @default(3) // 1=Admin, 2=Manager, 3=Agent, 4=Customer\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  // Relations\n  userRoles       UserRole[]\n  rolePermissions RolePermission[]\n\n  @@map("roles")\n}\n\nmodel SystemModule {\n  id          String   @id @default(cuid())\n  name        String   @unique // e.g. "Users Management"\n  slug        String   @unique // e.g. "users"\n  description String?\n  isActive    Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  // Relations\n  permissions Permission[]\n\n  @@map("system_modules")\n}\n\nmodel Permission {\n  id       String       @id @default(cuid())\n  action   String\n  name     String\n  slug     String       @unique\n  moduleId String\n  module   SystemModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  rolePermissions RolePermission[]\n  userPermissions UserPermission[]\n\n  @@unique([action, moduleId])\n  @@map("permissions")\n}\n\nmodel UserRole {\n  id         String   @id @default(cuid())\n  userId     String\n  roleId     String\n  assignedAt DateTime @default(now())\n  assignedBy String? // userId of the assigner\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, roleId])\n  @@map("user_roles")\n}\n\nmodel RolePermission {\n  id           String @id @default(cuid())\n  roleId       String\n  permissionId String\n\n  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)\n  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@unique([roleId, permissionId])\n  @@index([roleId])\n  @@map("role_permissions")\n}\n\nmodel UserPermission {\n  id           String  @id @default(cuid())\n  userId       String\n  permissionId String\n  granted      Boolean @default(true) // true = granted, false = explicitly revoked\n  grantedBy    String? // userId of the assigner\n\n  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, permissionId])\n  @@index([userId])\n  @@map("user_permissions")\n}\n\n// \u2500\u2500\u2500 Audit Log \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel AuditLog {\n  id         String   @id @default(cuid())\n  userId     String?\n  action     String // e.g. "CREATE_ROLE", "UPDATE_USER", "DELETE_PERMISSION"\n  module     String // e.g. "roles", "users", "permissions"\n  targetId   String? // id of the affected resource\n  targetType String? // model name of affected resource\n  oldData    Json? // snapshot before change\n  newData    Json? // snapshot after change\n  ipAddress  String?\n  userAgent  String?\n  createdAt  DateTime @default(now())\n\n  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([module])\n  @@index([createdAt])\n  @@map("audit_logs")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userRoles","kind":"object","type":"UserRole","relationName":"UserToUserRole"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"managedUsers","kind":"object","type":"User","relationName":"UserManager"},{"name":"managerId","kind":"scalar","type":"String"},{"name":"manager","kind":"object","type":"User","relationName":"UserManager"},{"name":"userPermissions","kind":"object","type":"UserPermission","relationName":"UserToUserPermission"},{"name":"assignedLeads","kind":"object","type":"Lead","relationName":"LeadToUser"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"updatedSettings","kind":"object","type":"SystemSetting","relationName":"SystemSettingToUser"}],"dbName":"users"},"Lead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"company","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"LeadStatus"},{"name":"source","kind":"scalar","type":"String"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assignee","kind":"object","type":"User","relationName":"LeadToUser"}],"dbName":"leads"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"}],"dbName":"tasks"},"SystemSetting":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedBy","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"updater","kind":"object","type":"User","relationName":"SystemSettingToUser"}],"dbName":"system_settings"},"Role":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isSystem","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"hierarchyLevel","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userRoles","kind":"object","type":"UserRole","relationName":"RoleToUserRole"},{"name":"rolePermissions","kind":"object","type":"RolePermission","relationName":"RoleToRolePermission"}],"dbName":"roles"},"SystemModule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"permissions","kind":"object","type":"Permission","relationName":"PermissionToSystemModule"}],"dbName":"system_modules"},"Permission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"moduleId","kind":"scalar","type":"String"},{"name":"module","kind":"object","type":"SystemModule","relationName":"PermissionToSystemModule"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"rolePermissions","kind":"object","type":"RolePermission","relationName":"PermissionToRolePermission"},{"name":"userPermissions","kind":"object","type":"UserPermission","relationName":"PermissionToUserPermission"}],"dbName":"permissions"},"UserRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"roleId","kind":"scalar","type":"String"},{"name":"assignedAt","kind":"scalar","type":"DateTime"},{"name":"assignedBy","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserRole"},{"name":"role","kind":"object","type":"Role","relationName":"RoleToUserRole"}],"dbName":"user_roles"},"RolePermission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roleId","kind":"scalar","type":"String"},{"name":"permissionId","kind":"scalar","type":"String"},{"name":"role","kind":"object","type":"Role","relationName":"RoleToRolePermission"},{"name":"permission","kind":"object","type":"Permission","relationName":"PermissionToRolePermission"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"role_permissions"},"UserPermission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"permissionId","kind":"scalar","type":"String"},{"name":"granted","kind":"scalar","type":"Boolean"},{"name":"grantedBy","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserPermission"},{"name":"permission","kind":"object","type":"Permission","relationName":"PermissionToUserPermission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_permissions"},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"module","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"targetType","kind":"scalar","type":"String"},{"name":"oldData","kind":"scalar","type":"Json"},{"name":"newData","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"}],"dbName":"audit_logs"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","userRoles","role","permissions","_count","module","rolePermissions","permission","userPermissions","auditLogs","managedUsers","manager","assignee","assignedLeads","creator","assignedTasks","createdTasks","updater","updatedSettings","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Lead.findUnique","Lead.findUniqueOrThrow","Lead.findFirst","Lead.findFirstOrThrow","Lead.findMany","Lead.createOne","Lead.createMany","Lead.createManyAndReturn","Lead.updateOne","Lead.updateMany","Lead.updateManyAndReturn","Lead.upsertOne","Lead.deleteOne","Lead.deleteMany","Lead.groupBy","Lead.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","SystemSetting.findUnique","SystemSetting.findUniqueOrThrow","SystemSetting.findFirst","SystemSetting.findFirstOrThrow","SystemSetting.findMany","SystemSetting.createOne","SystemSetting.createMany","SystemSetting.createManyAndReturn","SystemSetting.updateOne","SystemSetting.updateMany","SystemSetting.updateManyAndReturn","SystemSetting.upsertOne","SystemSetting.deleteOne","SystemSetting.deleteMany","SystemSetting.groupBy","SystemSetting.aggregate","Role.findUnique","Role.findUniqueOrThrow","Role.findFirst","Role.findFirstOrThrow","Role.findMany","Role.createOne","Role.createMany","Role.createManyAndReturn","Role.updateOne","Role.updateMany","Role.updateManyAndReturn","Role.upsertOne","Role.deleteOne","Role.deleteMany","_avg","_sum","Role.groupBy","Role.aggregate","SystemModule.findUnique","SystemModule.findUniqueOrThrow","SystemModule.findFirst","SystemModule.findFirstOrThrow","SystemModule.findMany","SystemModule.createOne","SystemModule.createMany","SystemModule.createManyAndReturn","SystemModule.updateOne","SystemModule.updateMany","SystemModule.updateManyAndReturn","SystemModule.upsertOne","SystemModule.deleteOne","SystemModule.deleteMany","SystemModule.groupBy","SystemModule.aggregate","Permission.findUnique","Permission.findUniqueOrThrow","Permission.findFirst","Permission.findFirstOrThrow","Permission.findMany","Permission.createOne","Permission.createMany","Permission.createManyAndReturn","Permission.updateOne","Permission.updateMany","Permission.updateManyAndReturn","Permission.upsertOne","Permission.deleteOne","Permission.deleteMany","Permission.groupBy","Permission.aggregate","UserRole.findUnique","UserRole.findUniqueOrThrow","UserRole.findFirst","UserRole.findFirstOrThrow","UserRole.findMany","UserRole.createOne","UserRole.createMany","UserRole.createManyAndReturn","UserRole.updateOne","UserRole.updateMany","UserRole.updateManyAndReturn","UserRole.upsertOne","UserRole.deleteOne","UserRole.deleteMany","UserRole.groupBy","UserRole.aggregate","RolePermission.findUnique","RolePermission.findUniqueOrThrow","RolePermission.findFirst","RolePermission.findFirstOrThrow","RolePermission.findMany","RolePermission.createOne","RolePermission.createMany","RolePermission.createManyAndReturn","RolePermission.updateOne","RolePermission.updateMany","RolePermission.updateManyAndReturn","RolePermission.upsertOne","RolePermission.deleteOne","RolePermission.deleteMany","RolePermission.groupBy","RolePermission.aggregate","UserPermission.findUnique","UserPermission.findUniqueOrThrow","UserPermission.findFirst","UserPermission.findFirstOrThrow","UserPermission.findMany","UserPermission.createOne","UserPermission.createMany","UserPermission.createManyAndReturn","UserPermission.updateOne","UserPermission.updateMany","UserPermission.updateManyAndReturn","UserPermission.upsertOne","UserPermission.deleteOne","UserPermission.deleteMany","UserPermission.groupBy","UserPermission.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","AND","OR","NOT","id","userId","action","targetId","targetType","oldData","newData","ipAddress","userAgent","createdAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","permissionId","granted","grantedBy","updatedAt","roleId","assignedAt","assignedBy","name","slug","moduleId","description","isActive","every","some","none","isSystem","hierarchyLevel","key","value","updatedBy","title","TaskStatus","status","dueDate","assignedTo","createdBy","email","phone","company","LeadStatus","source","password","profilePhoto","Gender","gender","contactNumber","address","UserStatus","needPasswordChange","isDeleted","deletedAt","isSuperAdmin","managerId","userId_permissionId","action_moduleId","roleId_permissionId","userId_roleId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "3gVfsAEcBAAA3wIAIAsAAIEDACAMAAD_AgAgDQAAgAMAIA4AAPUCACAQAACCAwAgEgAAgwMAIBMAAIMDACAVAACEAwAgzgEAAPwCADDPAQAAHgAQ0AEAAPwCADDRAQEAAAAB2gFAANcCACHvAUAA1wIAIfMBAQDUAgAhggIAAP4CkgIihgIBAAAAAYsCAQDUAgAhjAIBANUCACGOAgAA_QKOAiOPAgEA1QIAIZACAQDVAgAhkgIgANYCACGTAiAA1gIAIZQCQAD4AgAhlQIgANYCACGWAgEA1QIAIQEAAAABACAKAwAA-QIAIAUAAI8DACDOAQAAkQMAMM8BAAADABDQAQAAkQMAMNEBAQDUAgAh0gEBANQCACHwAQEA1AIAIfEBQADXAgAh8gEBANUCACEDAwAAhwUAIAUAAJAFACDyAQAAkgMAIAsDAAD5AgAgBQAAjwMAIM4BAACRAwAwzwEAAAMAENABAACRAwAw0QEBAAAAAdIBAQDUAgAh8AEBANQCACHxAUAA1wIAIfIBAQDVAgAhmgIAAJADACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkFAACPAwAgCgAAiQMAIM4BAACOAwAwzwEAAAgAENABAACOAwAw0QEBANQCACHaAUAA1wIAIewBAQDUAgAh8AEBANQCACECBQAAkAUAIAoAAI4FACAKBQAAjwMAIAoAAIkDACDOAQAAjgMAMM8BAAAIABDQAQAAjgMAMNEBAQAAAAHaAUAA1wIAIewBAQDUAgAh8AEBANQCACGZAgAAjQMAIAMAAAAIACABAAAJADACAAAKACANCAAAjAMAIAkAAOACACALAACBAwAgzgEAAIsDADDPAQAADAAQ0AEAAIsDADDRAQEA1AIAIdMBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAh9AEBANQCACH1AQEA1AIAIQMIAACPBQAgCQAAhAQAIAsAAIoFACAOCAAAjAMAIAkAAOACACALAACBAwAgzgEAAIsDADDPAQAADAAQ0AEAAIsDADDRAQEAAAAB0wEBANQCACHaAUAA1wIAIe8BQADXAgAh8wEBANQCACH0AQEAAAAB9QEBANQCACGYAgAAigMAIAMAAAAMACABAAANADACAAAOACABAAAADAAgAwAAAAgAIAEAAAkAMAIAAAoAIAwDAAD5AgAgCgAAiQMAIM4BAACIAwAwzwEAABIAENABAACIAwAw0QEBANQCACHSAQEA1AIAIdoBQADXAgAh7AEBANQCACHtASAA1gIAIe4BAQDVAgAh7wFAANcCACEDAwAAhwUAIAoAAI4FACDuAQAAkgMAIA0DAAD5AgAgCgAAiQMAIM4BAACIAwAwzwEAABIAENABAACIAwAw0QEBAAAAAdIBAQDUAgAh2gFAANcCACHsAQEA1AIAIe0BIADWAgAh7gEBANUCACHvAUAA1wIAIZcCAACHAwAgAwAAABIAIAEAABMAMAIAABQAIAEAAAAIACABAAAAEgAgAQAAAAMAIAEAAAAIACAPAwAA9QIAIAgBANQCACHOAQAAhQMAMM8BAAAaABDQAQAAhQMAMNEBAQDUAgAh0gEBANUCACHTAQEA1AIAIdQBAQDVAgAh1QEBANUCACHWAQAAhgMAINcBAACGAwAg2AEBANUCACHZAQEA1QIAIdoBQADXAgAhCAMAAIcFACDSAQAAkgMAINQBAACSAwAg1QEAAJIDACDWAQAAkgMAINcBAACSAwAg2AEAAJIDACDZAQAAkgMAIA8DAAD1AgAgCAEA1AIAIc4BAACFAwAwzwEAABoAENABAACFAwAw0QEBAAAAAdIBAQDVAgAh0wEBANQCACHUAQEA1QIAIdUBAQDVAgAh1gEAAIYDACDXAQAAhgMAINgBAQDVAgAh2QEBANUCACHaAUAA1wIAIQMAAAAaACABAAAbADACAAAcACAcBAAA3wIAIAsAAIEDACAMAAD_AgAgDQAAgAMAIA4AAPUCACAQAACCAwAgEgAAgwMAIBMAAIMDACAVAACEAwAgzgEAAPwCADDPAQAAHgAQ0AEAAPwCADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACHzAQEA1AIAIYICAAD-ApICIoYCAQDUAgAhiwIBANQCACGMAgEA1QIAIY4CAAD9Ao4CI48CAQDVAgAhkAIBANUCACGSAiAA1gIAIZMCIADWAgAhlAJAAPgCACGVAiAA1gIAIZYCAQDVAgAhAQAAAB4AIA8EAACDBAAgCwAAigUAIAwAAIgFACANAACJBQAgDgAAhwUAIBAAAIsFACASAACMBQAgEwAAjAUAIBUAAI0FACCMAgAAkgMAII4CAACSAwAgjwIAAJIDACCQAgAAkgMAIJQCAACSAwAglgIAAJIDACADAAAAHgAgAQAAIAAwAgAAAQAgAQAAAB4AIAMAAAASACABAAATADACAAAUACAODwAA9QIAIM4BAAD6AgAwzwEAACQAENABAAD6AgAw0QEBANQCACHaAUAA1wIAIe8BQADXAgAh8wEBANQCACGCAgAA-wKKAiKEAgEA1QIAIYYCAQDUAgAhhwIBANUCACGIAgEA1QIAIYoCAQDVAgAhBQ8AAIcFACCEAgAAkgMAIIcCAACSAwAgiAIAAJIDACCKAgAAkgMAIA4PAAD1AgAgzgEAAPoCADDPAQAAJAAQ0AEAAPoCADDRAQEAAAAB2gFAANcCACHvAUAA1wIAIfMBAQDUAgAhggIAAPsCigIihAIBANUCACGGAgEA1AIAIYcCAQDVAgAhiAIBANUCACGKAgEA1QIAIQMAAAAkACABAAAlADACAAAmACABAAAAHgAgDg8AAPUCACARAAD5AgAgzgEAAPYCADDPAQAAKQAQ0AEAAPYCADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACH2AQEA1QIAIYACAQDUAgAhggIAAPcCggIigwJAAPgCACGEAgEA1QIAIYUCAQDUAgAhBQ8AAIcFACARAACHBQAg9gEAAJIDACCDAgAAkgMAIIQCAACSAwAgDg8AAPUCACARAAD5AgAgzgEAAPYCADDPAQAAKQAQ0AEAAPYCADDRAQEAAAAB2gFAANcCACHvAUAA1wIAIfYBAQDVAgAhgAIBANQCACGCAgAA9wKCAiKDAkAA-AIAIYQCAQDVAgAhhQIBANQCACEDAAAAKQAgAQAAKgAwAgAAKwAgAQAAAB4AIAMAAAApACABAAAqADACAAArACALFAAA9QIAIM4BAAD0AgAwzwEAAC8AENABAAD0AgAw0QEBANQCACHaAUAA1wIAIe8BQADXAgAh9gEBANUCACH9AQEA1AIAIf4BAQDUAgAh_wEBANUCACEDFAAAhwUAIPYBAACSAwAg_wEAAJIDACALFAAA9QIAIM4BAAD0AgAwzwEAAC8AENABAAD0AgAw0QEBAAAAAdoBQADXAgAh7wFAANcCACH2AQEA1QIAIf0BAQAAAAH-AQEA1AIAIf8BAQDVAgAhAwAAAC8AIAEAADAAMAIAADEAIAEAAAAeACABAAAAAwAgAQAAABoAIAEAAAAeACABAAAAEgAgAQAAACQAIAEAAAApACABAAAAKQAgAQAAAC8AIAEAAAABACADAAAAHgAgAQAAIAAwAgAAAQAgAwAAAB4AIAEAACAAMAIAAAEAIAMAAAAeACABAAAgADACAAABACAZBAAA6QQAIAsAAOwEACAMAADqBAAgDQAA6wQAIA4AAIYFACAQAADtBAAgEgAA7gQAIBMAAO8EACAVAADwBAAg0QEBAAAAAdoBQAAAAAHvAUAAAAAB8wEBAAAAAYICAAAAkgIChgIBAAAAAYsCAQAAAAGMAgEAAAABjgIAAACOAgOPAgEAAAABkAIBAAAAAZICIAAAAAGTAiAAAAABlAJAAAAAAZUCIAAAAAGWAgEAAAABARsAAEAAIBDRAQEAAAAB2gFAAAAAAe8BQAAAAAHzAQEAAAABggIAAACSAgKGAgEAAAABiwIBAAAAAYwCAQAAAAGOAgAAAI4CA48CAQAAAAGQAgEAAAABkgIgAAAAAZMCIAAAAAGUAkAAAAABlQIgAAAAAZYCAQAAAAEBGwAAQgAwARsAAEIAMAEAAAAeACAZBAAAngQAIAsAAKIEACAMAACfBAAgDQAAoAQAIA4AAKEEACAQAACjBAAgEgAApAQAIBMAAKUEACAVAACmBAAg0QEBAJYDACHaAUAAmAMAIe8BQACYAwAh8wEBAJYDACGCAgAAnQSSAiKGAgEAlgMAIYsCAQCWAwAhjAIBAJcDACGOAgAAnASOAiOPAgEAlwMAIZACAQCXAwAhkgIgAJ4DACGTAiAAngMAIZQCQACOBAAhlQIgAJ4DACGWAgEAlwMAIQIAAAABACAbAABGACAQ0QEBAJYDACHaAUAAmAMAIe8BQACYAwAh8wEBAJYDACGCAgAAnQSSAiKGAgEAlgMAIYsCAQCWAwAhjAIBAJcDACGOAgAAnASOAiOPAgEAlwMAIZACAQCXAwAhkgIgAJ4DACGTAiAAngMAIZQCQACOBAAhlQIgAJ4DACGWAgEAlwMAIQIAAAAeACAbAABIACACAAAAHgAgGwAASAAgAQAAAB4AIAMAAAABACAiAABAACAjAABGACABAAAAAQAgAQAAAB4AIAkHAACZBAAgKAAAmwQAICkAAJoEACCMAgAAkgMAII4CAACSAwAgjwIAAJIDACCQAgAAkgMAIJQCAACSAwAglgIAAJIDACATzgEAAO0CADDPAQAAUAAQ0AEAAO0CADDRAQEAvgIAIdoBQADBAgAh7wFAAMECACHzAQEAvgIAIYICAADvApICIoYCAQC-AgAhiwIBAL4CACGMAgEAvwIAIY4CAADuAo4CI48CAQC_AgAhkAIBAL8CACGSAiAAzAIAIZMCIADMAgAhlAJAAOQCACGVAiAAzAIAIZYCAQC_AgAhAwAAAB4AIAEAAE8AMCcAAFAAIAMAAAAeACABAAAgADACAAABACABAAAAJgAgAQAAACYAIAMAAAAkACABAAAlADACAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgAwAAACQAIAEAACUAMAIAACYAIAsPAACYBAAg0QEBAAAAAdoBQAAAAAHvAUAAAAAB8wEBAAAAAYICAAAAigIChAIBAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYoCAQAAAAEBGwAAWAAgCtEBAQAAAAHaAUAAAAAB7wFAAAAAAfMBAQAAAAGCAgAAAIoCAoQCAQAAAAGGAgEAAAABhwIBAAAAAYgCAQAAAAGKAgEAAAABARsAAFoAMAEbAABaADABAAAAHgAgCw8AAJcEACDRAQEAlgMAIdoBQACYAwAh7wFAAJgDACHzAQEAlgMAIYICAACWBIoCIoQCAQCXAwAhhgIBAJYDACGHAgEAlwMAIYgCAQCXAwAhigIBAJcDACECAAAAJgAgGwAAXgAgCtEBAQCWAwAh2gFAAJgDACHvAUAAmAMAIfMBAQCWAwAhggIAAJYEigIihAIBAJcDACGGAgEAlgMAIYcCAQCXAwAhiAIBAJcDACGKAgEAlwMAIQIAAAAkACAbAABgACACAAAAJAAgGwAAYAAgAQAAAB4AIAMAAAAmACAiAABYACAjAABeACABAAAAJgAgAQAAACQAIAcHAACTBAAgKAAAlQQAICkAAJQEACCEAgAAkgMAIIcCAACSAwAgiAIAAJIDACCKAgAAkgMAIA3OAQAA6QIAMM8BAABoABDQAQAA6QIAMNEBAQC-AgAh2gFAAMECACHvAUAAwQIAIfMBAQC-AgAhggIAAOoCigIihAIBAL8CACGGAgEAvgIAIYcCAQC_AgAhiAIBAL8CACGKAgEAvwIAIQMAAAAkACABAABnADAnAABoACADAAAAJAAgAQAAJQAwAgAAJgAgAQAAACsAIAEAAAArACADAAAAKQAgAQAAKgAwAgAAKwAgAwAAACkAIAEAACoAMAIAACsAIAMAAAApACABAAAqADACAAArACALDwAAkQQAIBEAAJIEACDRAQEAAAAB2gFAAAAAAe8BQAAAAAH2AQEAAAABgAIBAAAAAYICAAAAggICgwJAAAAAAYQCAQAAAAGFAgEAAAABARsAAHAAIAnRAQEAAAAB2gFAAAAAAe8BQAAAAAH2AQEAAAABgAIBAAAAAYICAAAAggICgwJAAAAAAYQCAQAAAAGFAgEAAAABARsAAHIAMAEbAAByADABAAAAHgAgCw8AAI8EACARAACQBAAg0QEBAJYDACHaAUAAmAMAIe8BQACYAwAh9gEBAJcDACGAAgEAlgMAIYICAACNBIICIoMCQACOBAAhhAIBAJcDACGFAgEAlgMAIQIAAAArACAbAAB2ACAJ0QEBAJYDACHaAUAAmAMAIe8BQACYAwAh9gEBAJcDACGAAgEAlgMAIYICAACNBIICIoMCQACOBAAhhAIBAJcDACGFAgEAlgMAIQIAAAApACAbAAB4ACACAAAAKQAgGwAAeAAgAQAAAB4AIAMAAAArACAiAABwACAjAAB2ACABAAAAKwAgAQAAACkAIAYHAACKBAAgKAAAjAQAICkAAIsEACD2AQAAkgMAIIMCAACSAwAghAIAAJIDACAMzgEAAOICADDPAQAAgAEAENABAADiAgAw0QEBAL4CACHaAUAAwQIAIe8BQADBAgAh9gEBAL8CACGAAgEAvgIAIYICAADjAoICIoMCQADkAgAhhAIBAL8CACGFAgEAvgIAIQMAAAApACABAAB_ADAnAACAAQAgAwAAACkAIAEAACoAMAIAACsAIAEAAAAxACABAAAAMQAgAwAAAC8AIAEAADAAMAIAADEAIAMAAAAvACABAAAwADACAAAxACADAAAALwAgAQAAMAAwAgAAMQAgCBQAAIkEACDRAQEAAAAB2gFAAAAAAe8BQAAAAAH2AQEAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABARsAAIgBACAH0QEBAAAAAdoBQAAAAAHvAUAAAAAB9gEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAQEbAACKAQAwARsAAIoBADABAAAAHgAgCBQAAIgEACDRAQEAlgMAIdoBQACYAwAh7wFAAJgDACH2AQEAlwMAIf0BAQCWAwAh_gEBAJYDACH_AQEAlwMAIQIAAAAxACAbAACOAQAgB9EBAQCWAwAh2gFAAJgDACHvAUAAmAMAIfYBAQCXAwAh_QEBAJYDACH-AQEAlgMAIf8BAQCXAwAhAgAAAC8AIBsAAJABACACAAAALwAgGwAAkAEAIAEAAAAeACADAAAAMQAgIgAAiAEAICMAAI4BACABAAAAMQAgAQAAAC8AIAUHAACFBAAgKAAAhwQAICkAAIYEACD2AQAAkgMAIP8BAACSAwAgCs4BAADhAgAwzwEAAJgBABDQAQAA4QIAMNEBAQC-AgAh2gFAAMECACHvAUAAwQIAIfYBAQC_AgAh_QEBAL4CACH-AQEAvgIAIf8BAQC_AgAhAwAAAC8AIAEAAJcBADAnAACYAQAgAwAAAC8AIAEAADAAMAIAADEAIA0EAADfAgAgCQAA4AIAIM4BAADdAgAwzwEAAJ4BABDQAQAA3QIAMNEBAQAAAAHaAUAA1wIAIe8BQADXAgAh8wEBAAAAAfYBAQDVAgAh9wEgANYCACH7ASAA1gIAIfwBAgDeAgAhAQAAAJsBACABAAAAmwEAIA0EAADfAgAgCQAA4AIAIM4BAADdAgAwzwEAAJ4BABDQAQAA3QIAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAh9gEBANUCACH3ASAA1gIAIfsBIADWAgAh_AECAN4CACEDBAAAgwQAIAkAAIQEACD2AQAAkgMAIAMAAACeAQAgAQAAnwEAMAIAAJsBACADAAAAngEAIAEAAJ8BADACAACbAQAgAwAAAJ4BACABAACfAQAwAgAAmwEAIAoEAACBBAAgCQAAggQAINEBAQAAAAHaAUAAAAAB7wFAAAAAAfMBAQAAAAH2AQEAAAAB9wEgAAAAAfsBIAAAAAH8AQIAAAABARsAAKMBACAI0QEBAAAAAdoBQAAAAAHvAUAAAAAB8wEBAAAAAfYBAQAAAAH3ASAAAAAB-wEgAAAAAfwBAgAAAAEBGwAApQEAMAEbAAClAQAwCgQAAOoDACAJAADrAwAg0QEBAJYDACHaAUAAmAMAIe8BQACYAwAh8wEBAJYDACH2AQEAlwMAIfcBIACeAwAh-wEgAJ4DACH8AQIA6QMAIQIAAACbAQAgGwAAqAEAIAjRAQEAlgMAIdoBQACYAwAh7wFAAJgDACHzAQEAlgMAIfYBAQCXAwAh9wEgAJ4DACH7ASAAngMAIfwBAgDpAwAhAgAAAJ4BACAbAACqAQAgAgAAAJ4BACAbAACqAQAgAwAAAJsBACAiAACjAQAgIwAAqAEAIAEAAACbAQAgAQAAAJ4BACAGBwAA5AMAICgAAOcDACApAADmAwAgagAA5QMAIGsAAOgDACD2AQAAkgMAIAvOAQAA2QIAMM8BAACxAQAQ0AEAANkCADDRAQEAvgIAIdoBQADBAgAh7wFAAMECACHzAQEAvgIAIfYBAQC_AgAh9wEgAMwCACH7ASAAzAIAIfwBAgDaAgAhAwAAAJ4BACABAACwAQAwJwAAsQEAIAMAAACeAQAgAQAAnwEAMAIAAJsBACALBgAA2AIAIM4BAADTAgAwzwEAALcBABDQAQAA0wIAMNEBAQAAAAHaAUAA1wIAIe8BQADXAgAh8wEBAAAAAfQBAQAAAAH2AQEA1QIAIfcBIADWAgAhAQAAALQBACABAAAAtAEAIAsGAADYAgAgzgEAANMCADDPAQAAtwEAENABAADTAgAw0QEBANQCACHaAUAA1wIAIe8BQADXAgAh8wEBANQCACH0AQEA1AIAIfYBAQDVAgAh9wEgANYCACECBgAA4wMAIPYBAACSAwAgAwAAALcBACABAAC4AQAwAgAAtAEAIAMAAAC3AQAgAQAAuAEAMAIAALQBACADAAAAtwEAIAEAALgBADACAAC0AQAgCAYAAOIDACDRAQEAAAAB2gFAAAAAAe8BQAAAAAHzAQEAAAAB9AEBAAAAAfYBAQAAAAH3ASAAAAABARsAALwBACAH0QEBAAAAAdoBQAAAAAHvAUAAAAAB8wEBAAAAAfQBAQAAAAH2AQEAAAAB9wEgAAAAAQEbAAC-AQAwARsAAL4BADAIBgAA1QMAINEBAQCWAwAh2gFAAJgDACHvAUAAmAMAIfMBAQCWAwAh9AEBAJYDACH2AQEAlwMAIfcBIACeAwAhAgAAALQBACAbAADBAQAgB9EBAQCWAwAh2gFAAJgDACHvAUAAmAMAIfMBAQCWAwAh9AEBAJYDACH2AQEAlwMAIfcBIACeAwAhAgAAALcBACAbAADDAQAgAgAAALcBACAbAADDAQAgAwAAALQBACAiAAC8AQAgIwAAwQEAIAEAAAC0AQAgAQAAALcBACAEBwAA0gMAICgAANQDACApAADTAwAg9gEAAJIDACAKzgEAANICADDPAQAAygEAENABAADSAgAw0QEBAL4CACHaAUAAwQIAIe8BQADBAgAh8wEBAL4CACH0AQEAvgIAIfYBAQC_AgAh9wEgAMwCACEDAAAAtwEAIAEAAMkBADAnAADKAQAgAwAAALcBACABAAC4AQAwAgAAtAEAIAEAAAAOACABAAAADgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACADAAAADAAgAQAADQAwAgAADgAgCggAAM8DACAJAADQAwAgCwAA0QMAINEBAQAAAAHTAQEAAAAB2gFAAAAAAe8BQAAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAEBGwAA0gEAIAfRAQEAAAAB0wEBAAAAAdoBQAAAAAHvAUAAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAABARsAANQBADABGwAA1AEAMAoIAAC0AwAgCQAAtQMAIAsAALYDACDRAQEAlgMAIdMBAQCWAwAh2gFAAJgDACHvAUAAmAMAIfMBAQCWAwAh9AEBAJYDACH1AQEAlgMAIQIAAAAOACAbAADXAQAgB9EBAQCWAwAh0wEBAJYDACHaAUAAmAMAIe8BQACYAwAh8wEBAJYDACH0AQEAlgMAIfUBAQCWAwAhAgAAAAwAIBsAANkBACACAAAADAAgGwAA2QEAIAMAAAAOACAiAADSAQAgIwAA1wEAIAEAAAAOACABAAAADAAgAwcAALEDACAoAACzAwAgKQAAsgMAIArOAQAA0QIAMM8BAADgAQAQ0AEAANECADDRAQEAvgIAIdMBAQC-AgAh2gFAAMECACHvAUAAwQIAIfMBAQC-AgAh9AEBAL4CACH1AQEAvgIAIQMAAAAMACABAADfAQAwJwAA4AEAIAMAAAAMACABAAANADACAAAOACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAcDAACvAwAgBQAAsAMAINEBAQAAAAHSAQEAAAAB8AEBAAAAAfEBQAAAAAHyAQEAAAABARsAAOgBACAF0QEBAAAAAdIBAQAAAAHwAQEAAAAB8QFAAAAAAfIBAQAAAAEBGwAA6gEAMAEbAADqAQAwBwMAAK0DACAFAACuAwAg0QEBAJYDACHSAQEAlgMAIfABAQCWAwAh8QFAAJgDACHyAQEAlwMAIQIAAAAFACAbAADtAQAgBdEBAQCWAwAh0gEBAJYDACHwAQEAlgMAIfEBQACYAwAh8gEBAJcDACECAAAAAwAgGwAA7wEAIAIAAAADACAbAADvAQAgAwAAAAUAICIAAOgBACAjAADtAQAgAQAAAAUAIAEAAAADACAEBwAAqgMAICgAAKwDACApAACrAwAg8gEAAJIDACAIzgEAANACADDPAQAA9gEAENABAADQAgAw0QEBAL4CACHSAQEAvgIAIfABAQC-AgAh8QFAAMECACHyAQEAvwIAIQMAAAADACABAAD1AQAwJwAA9gEAIAMAAAADACABAAAEADACAAAFACABAAAACgAgAQAAAAoAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAYFAACoAwAgCgAAqQMAINEBAQAAAAHaAUAAAAAB7AEBAAAAAfABAQAAAAEBGwAA_gEAIATRAQEAAAAB2gFAAAAAAewBAQAAAAHwAQEAAAABARsAAIACADABGwAAgAIAMAYFAACmAwAgCgAApwMAINEBAQCWAwAh2gFAAJgDACHsAQEAlgMAIfABAQCWAwAhAgAAAAoAIBsAAIMCACAE0QEBAJYDACHaAUAAmAMAIewBAQCWAwAh8AEBAJYDACECAAAACAAgGwAAhQIAIAIAAAAIACAbAACFAgAgAwAAAAoAICIAAP4BACAjAACDAgAgAQAAAAoAIAEAAAAIACADBwAAowMAICgAAKUDACApAACkAwAgB84BAADPAgAwzwEAAIwCABDQAQAAzwIAMNEBAQC-AgAh2gFAAMECACHsAQEAvgIAIfABAQC-AgAhAwAAAAgAIAEAAIsCADAnAACMAgAgAwAAAAgAIAEAAAkAMAIAAAoAIAEAAAAUACABAAAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgCQMAAKEDACAKAACiAwAg0QEBAAAAAdIBAQAAAAHaAUAAAAAB7AEBAAAAAe0BIAAAAAHuAQEAAAAB7wFAAAAAAQEbAACUAgAgB9EBAQAAAAHSAQEAAAAB2gFAAAAAAewBAQAAAAHtASAAAAAB7gEBAAAAAe8BQAAAAAEBGwAAlgIAMAEbAACWAgAwCQMAAJ8DACAKAACgAwAg0QEBAJYDACHSAQEAlgMAIdoBQACYAwAh7AEBAJYDACHtASAAngMAIe4BAQCXAwAh7wFAAJgDACECAAAAFAAgGwAAmQIAIAfRAQEAlgMAIdIBAQCWAwAh2gFAAJgDACHsAQEAlgMAIe0BIACeAwAh7gEBAJcDACHvAUAAmAMAIQIAAAASACAbAACbAgAgAgAAABIAIBsAAJsCACADAAAAFAAgIgAAlAIAICMAAJkCACABAAAAFAAgAQAAABIAIAQHAACbAwAgKAAAnQMAICkAAJwDACDuAQAAkgMAIArOAQAAywIAMM8BAACiAgAQ0AEAAMsCADDRAQEAvgIAIdIBAQC-AgAh2gFAAMECACHsAQEAvgIAIe0BIADMAgAh7gEBAL8CACHvAUAAwQIAIQMAAAASACABAAChAgAwJwAAogIAIAMAAAASACABAAATADACAAAUACABAAAAHAAgAQAAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAABoAIAEAABsAMAIAABwAIAwDAACaAwAgCAEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAYAAAAAB1wGAAAAAAdgBAQAAAAHZAQEAAAAB2gFAAAAAAQEbAACqAgAgCwgBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gGAAAAAAdcBgAAAAAHYAQEAAAAB2QEBAAAAAdoBQAAAAAEBGwAArAIAMAEbAACsAgAwAQAAAB4AIAwDAACZAwAgCAEAlgMAIdEBAQCWAwAh0gEBAJcDACHTAQEAlgMAIdQBAQCXAwAh1QEBAJcDACHWAYAAAAAB1wGAAAAAAdgBAQCXAwAh2QEBAJcDACHaAUAAmAMAIQIAAAAcACAbAACwAgAgCwgBAJYDACHRAQEAlgMAIdIBAQCXAwAh0wEBAJYDACHUAQEAlwMAIdUBAQCXAwAh1gGAAAAAAdcBgAAAAAHYAQEAlwMAIdkBAQCXAwAh2gFAAJgDACECAAAAGgAgGwAAsgIAIAIAAAAaACAbAACyAgAgAQAAAB4AIAMAAAAcACAiAACqAgAgIwAAsAIAIAEAAAAcACABAAAAGgAgCgcAAJMDACAoAACVAwAgKQAAlAMAINIBAACSAwAg1AEAAJIDACDVAQAAkgMAINYBAACSAwAg1wEAAJIDACDYAQAAkgMAINkBAACSAwAgDggBAL4CACHOAQAAvQIAMM8BAAC6AgAQ0AEAAL0CADDRAQEAvgIAIdIBAQC_AgAh0wEBAL4CACHUAQEAvwIAIdUBAQC_AgAh1gEAAMACACDXAQAAwAIAINgBAQC_AgAh2QEBAL8CACHaAUAAwQIAIQMAAAAaACABAAC5AgAwJwAAugIAIAMAAAAaACABAAAbADACAAAcACAOCAEAvgIAIc4BAAC9AgAwzwEAALoCABDQAQAAvQIAMNEBAQC-AgAh0gEBAL8CACHTAQEAvgIAIdQBAQC_AgAh1QEBAL8CACHWAQAAwAIAINcBAADAAgAg2AEBAL8CACHZAQEAvwIAIdoBQADBAgAhDgcAAMMCACAoAADKAgAgKQAAygIAINsBAQAAAAHcAQEAAAAE3QEBAAAABN4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAyQIAIekBAQAAAAHqAQEAAAAB6wEBAAAAAQ4HAADFAgAgKAAAyAIAICkAAMgCACDbAQEAAAAB3AEBAAAABd0BAQAAAAXeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAMcCACHpAQEAAAAB6gEBAAAAAesBAQAAAAEPBwAAxQIAICgAAMYCACApAADGAgAg2wGAAAAAAd4BgAAAAAHfAYAAAAAB4AGAAAAAAeEBgAAAAAHiAYAAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gGAAAAAAecBgAAAAAHoAYAAAAABCwcAAMMCACAoAADEAgAgKQAAxAIAINsBQAAAAAHcAUAAAAAE3QFAAAAABN4BQAAAAAHfAUAAAAAB4AFAAAAAAeEBQAAAAAHiAUAAwgIAIQsHAADDAgAgKAAAxAIAICkAAMQCACDbAUAAAAAB3AFAAAAABN0BQAAAAATeAUAAAAAB3wFAAAAAAeABQAAAAAHhAUAAAAAB4gFAAMICACEI2wECAAAAAdwBAgAAAATdAQIAAAAE3gECAAAAAd8BAgAAAAHgAQIAAAAB4QECAAAAAeIBAgDDAgAhCNsBQAAAAAHcAUAAAAAE3QFAAAAABN4BQAAAAAHfAUAAAAAB4AFAAAAAAeEBQAAAAAHiAUAAxAIAIQjbAQIAAAAB3AECAAAABd0BAgAAAAXeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAAAAB4gECAMUCACEM2wGAAAAAAd4BgAAAAAHfAYAAAAAB4AGAAAAAAeEBgAAAAAHiAYAAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gGAAAAAAecBgAAAAAHoAYAAAAABDgcAAMUCACAoAADIAgAgKQAAyAIAINsBAQAAAAHcAQEAAAAF3QEBAAAABd4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAxwIAIekBAQAAAAHqAQEAAAAB6wEBAAAAAQvbAQEAAAAB3AEBAAAABd0BAQAAAAXeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAMgCACHpAQEAAAAB6gEBAAAAAesBAQAAAAEOBwAAwwIAICgAAMoCACApAADKAgAg2wEBAAAAAdwBAQAAAATdAQEAAAAE3gEBAAAAAd8BAQAAAAHgAQEAAAAB4QEBAAAAAeIBAQDJAgAh6QEBAAAAAeoBAQAAAAHrAQEAAAABC9sBAQAAAAHcAQEAAAAE3QEBAAAABN4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAygIAIekBAQAAAAHqAQEAAAAB6wEBAAAAAQrOAQAAywIAMM8BAACiAgAQ0AEAAMsCADDRAQEAvgIAIdIBAQC-AgAh2gFAAMECACHsAQEAvgIAIe0BIADMAgAh7gEBAL8CACHvAUAAwQIAIQUHAADDAgAgKAAAzgIAICkAAM4CACDbASAAAAAB4gEgAM0CACEFBwAAwwIAICgAAM4CACApAADOAgAg2wEgAAAAAeIBIADNAgAhAtsBIAAAAAHiASAAzgIAIQfOAQAAzwIAMM8BAACMAgAQ0AEAAM8CADDRAQEAvgIAIdoBQADBAgAh7AEBAL4CACHwAQEAvgIAIQjOAQAA0AIAMM8BAAD2AQAQ0AEAANACADDRAQEAvgIAIdIBAQC-AgAh8AEBAL4CACHxAUAAwQIAIfIBAQC_AgAhCs4BAADRAgAwzwEAAOABABDQAQAA0QIAMNEBAQC-AgAh0wEBAL4CACHaAUAAwQIAIe8BQADBAgAh8wEBAL4CACH0AQEAvgIAIfUBAQC-AgAhCs4BAADSAgAwzwEAAMoBABDQAQAA0gIAMNEBAQC-AgAh2gFAAMECACHvAUAAwQIAIfMBAQC-AgAh9AEBAL4CACH2AQEAvwIAIfcBIADMAgAhCwYAANgCACDOAQAA0wIAMM8BAAC3AQAQ0AEAANMCADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACHzAQEA1AIAIfQBAQDUAgAh9gEBANUCACH3ASAA1gIAIQvbAQEAAAAB3AEBAAAABN0BAQAAAATeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAMoCACHpAQEAAAAB6gEBAAAAAesBAQAAAAEL2wEBAAAAAdwBAQAAAAXdAQEAAAAF3gEBAAAAAd8BAQAAAAHgAQEAAAAB4QEBAAAAAeIBAQDIAgAh6QEBAAAAAeoBAQAAAAHrAQEAAAABAtsBIAAAAAHiASAAzgIAIQjbAUAAAAAB3AFAAAAABN0BQAAAAATeAUAAAAAB3wFAAAAAAeABQAAAAAHhAUAAAAAB4gFAAMQCACED-AEAAAwAIPkBAAAMACD6AQAADAAgC84BAADZAgAwzwEAALEBABDQAQAA2QIAMNEBAQC-AgAh2gFAAMECACHvAUAAwQIAIfMBAQC-AgAh9gEBAL8CACH3ASAAzAIAIfsBIADMAgAh_AECANoCACENBwAAwwIAICgAAMMCACApAADDAgAgagAA3AIAIGsAAMMCACDbAQIAAAAB3AECAAAABN0BAgAAAATeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAAAAB4gECANsCACENBwAAwwIAICgAAMMCACApAADDAgAgagAA3AIAIGsAAMMCACDbAQIAAAAB3AECAAAABN0BAgAAAATeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAAAAB4gECANsCACEI2wEIAAAAAdwBCAAAAATdAQgAAAAE3gEIAAAAAd8BCAAAAAHgAQgAAAAB4QEIAAAAAeIBCADcAgAhDQQAAN8CACAJAADgAgAgzgEAAN0CADDPAQAAngEAENABAADdAgAw0QEBANQCACHaAUAA1wIAIe8BQADXAgAh8wEBANQCACH2AQEA1QIAIfcBIADWAgAh-wEgANYCACH8AQIA3gIAIQjbAQIAAAAB3AECAAAABN0BAgAAAATeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAAAAB4gECAMMCACED-AEAAAMAIPkBAAADACD6AQAAAwAgA_gBAAAIACD5AQAACAAg-gEAAAgAIArOAQAA4QIAMM8BAACYAQAQ0AEAAOECADDRAQEAvgIAIdoBQADBAgAh7wFAAMECACH2AQEAvwIAIf0BAQC-AgAh_gEBAL4CACH_AQEAvwIAIQzOAQAA4gIAMM8BAACAAQAQ0AEAAOICADDRAQEAvgIAIdoBQADBAgAh7wFAAMECACH2AQEAvwIAIYACAQC-AgAhggIAAOMCggIigwJAAOQCACGEAgEAvwIAIYUCAQC-AgAhBwcAAMMCACAoAADoAgAgKQAA6AIAINsBAAAAggIC3AEAAACCAgjdAQAAAIICCOIBAADnAoICIgsHAADFAgAgKAAA5gIAICkAAOYCACDbAUAAAAAB3AFAAAAABd0BQAAAAAXeAUAAAAAB3wFAAAAAAeABQAAAAAHhAUAAAAAB4gFAAOUCACELBwAAxQIAICgAAOYCACApAADmAgAg2wFAAAAAAdwBQAAAAAXdAUAAAAAF3gFAAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAeIBQADlAgAhCNsBQAAAAAHcAUAAAAAF3QFAAAAABd4BQAAAAAHfAUAAAAAB4AFAAAAAAeEBQAAAAAHiAUAA5gIAIQcHAADDAgAgKAAA6AIAICkAAOgCACDbAQAAAIICAtwBAAAAggII3QEAAACCAgjiAQAA5wKCAiIE2wEAAACCAgLcAQAAAIICCN0BAAAAggII4gEAAOgCggIiDc4BAADpAgAwzwEAAGgAENABAADpAgAw0QEBAL4CACHaAUAAwQIAIe8BQADBAgAh8wEBAL4CACGCAgAA6gKKAiKEAgEAvwIAIYYCAQC-AgAhhwIBAL8CACGIAgEAvwIAIYoCAQC_AgAhBwcAAMMCACAoAADsAgAgKQAA7AIAINsBAAAAigIC3AEAAACKAgjdAQAAAIoCCOIBAADrAooCIgcHAADDAgAgKAAA7AIAICkAAOwCACDbAQAAAIoCAtwBAAAAigII3QEAAACKAgjiAQAA6wKKAiIE2wEAAACKAgLcAQAAAIoCCN0BAAAAigII4gEAAOwCigIiE84BAADtAgAwzwEAAFAAENABAADtAgAw0QEBAL4CACHaAUAAwQIAIe8BQADBAgAh8wEBAL4CACGCAgAA7wKSAiKGAgEAvgIAIYsCAQC-AgAhjAIBAL8CACGOAgAA7gKOAiOPAgEAvwIAIZACAQC_AgAhkgIgAMwCACGTAiAAzAIAIZQCQADkAgAhlQIgAMwCACGWAgEAvwIAIQcHAADFAgAgKAAA8wIAICkAAPMCACDbAQAAAI4CA9wBAAAAjgIJ3QEAAACOAgniAQAA8gKOAiMHBwAAwwIAICgAAPECACApAADxAgAg2wEAAACSAgLcAQAAAJICCN0BAAAAkgII4gEAAPACkgIiBwcAAMMCACAoAADxAgAgKQAA8QIAINsBAAAAkgIC3AEAAACSAgjdAQAAAJICCOIBAADwApICIgTbAQAAAJICAtwBAAAAkgII3QEAAACSAgjiAQAA8QKSAiIHBwAAxQIAICgAAPMCACApAADzAgAg2wEAAACOAgPcAQAAAI4CCd0BAAAAjgIJ4gEAAPICjgIjBNsBAAAAjgID3AEAAACOAgndAQAAAI4CCeIBAADzAo4CIwsUAAD1AgAgzgEAAPQCADDPAQAALwAQ0AEAAPQCADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACH2AQEA1QIAIf0BAQDUAgAh_gEBANQCACH_AQEA1QIAIR4EAADfAgAgCwAAgQMAIAwAAP8CACANAACAAwAgDgAA9QIAIBAAAIIDACASAACDAwAgEwAAgwMAIBUAAIQDACDOAQAA_AIAMM8BAAAeABDQAQAA_AIAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAhggIAAP4CkgIihgIBANQCACGLAgEA1AIAIYwCAQDVAgAhjgIAAP0CjgIjjwIBANUCACGQAgEA1QIAIZICIADWAgAhkwIgANYCACGUAkAA-AIAIZUCIADWAgAhlgIBANUCACGbAgAAHgAgnAIAAB4AIA4PAAD1AgAgEQAA-QIAIM4BAAD2AgAwzwEAACkAENABAAD2AgAw0QEBANQCACHaAUAA1wIAIe8BQADXAgAh9gEBANUCACGAAgEA1AIAIYICAAD3AoICIoMCQAD4AgAhhAIBANUCACGFAgEA1AIAIQTbAQAAAIICAtwBAAAAggII3QEAAACCAgjiAQAA6AKCAiII2wFAAAAAAdwBQAAAAAXdAUAAAAAF3gFAAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAeIBQADmAgAhHgQAAN8CACALAACBAwAgDAAA_wIAIA0AAIADACAOAAD1AgAgEAAAggMAIBIAAIMDACATAACDAwAgFQAAhAMAIM4BAAD8AgAwzwEAAB4AENABAAD8AgAw0QEBANQCACHaAUAA1wIAIe8BQADXAgAh8wEBANQCACGCAgAA_gKSAiKGAgEA1AIAIYsCAQDUAgAhjAIBANUCACGOAgAA_QKOAiOPAgEA1QIAIZACAQDVAgAhkgIgANYCACGTAiAA1gIAIZQCQAD4AgAhlQIgANYCACGWAgEA1QIAIZsCAAAeACCcAgAAHgAgDg8AAPUCACDOAQAA-gIAMM8BAAAkABDQAQAA-gIAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAhggIAAPsCigIihAIBANUCACGGAgEA1AIAIYcCAQDVAgAhiAIBANUCACGKAgEA1QIAIQTbAQAAAIoCAtwBAAAAigII3QEAAACKAgjiAQAA7AKKAiIcBAAA3wIAIAsAAIEDACAMAAD_AgAgDQAAgAMAIA4AAPUCACAQAACCAwAgEgAAgwMAIBMAAIMDACAVAACEAwAgzgEAAPwCADDPAQAAHgAQ0AEAAPwCADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACHzAQEA1AIAIYICAAD-ApICIoYCAQDUAgAhiwIBANQCACGMAgEA1QIAIY4CAAD9Ao4CI48CAQDVAgAhkAIBANUCACGSAiAA1gIAIZMCIADWAgAhlAJAAPgCACGVAiAA1gIAIZYCAQDVAgAhBNsBAAAAjgID3AEAAACOAgndAQAAAI4CCeIBAADzAo4CIwTbAQAAAJICAtwBAAAAkgII3QEAAACSAgjiAQAA8QKSAiID-AEAABoAIPkBAAAaACD6AQAAGgAgA_gBAAAeACD5AQAAHgAg-gEAAB4AIAP4AQAAEgAg-QEAABIAIPoBAAASACAD-AEAACQAIPkBAAAkACD6AQAAJAAgA_gBAAApACD5AQAAKQAg-gEAACkAIAP4AQAALwAg-QEAAC8AIPoBAAAvACAPAwAA9QIAIAgBANQCACHOAQAAhQMAMM8BAAAaABDQAQAAhQMAMNEBAQDUAgAh0gEBANUCACHTAQEA1AIAIdQBAQDVAgAh1QEBANUCACHWAQAAhgMAINcBAACGAwAg2AEBANUCACHZAQEA1QIAIdoBQADXAgAhDNsBgAAAAAHeAYAAAAAB3wGAAAAAAeABgAAAAAHhAYAAAAAB4gGAAAAAAeMBAQAAAAHkAQEAAAAB5QEBAAAAAeYBgAAAAAHnAYAAAAAB6AGAAAAAAQLSAQEAAAAB7AEBAAAAAQwDAAD5AgAgCgAAiQMAIM4BAACIAwAwzwEAABIAENABAACIAwAw0QEBANQCACHSAQEA1AIAIdoBQADXAgAh7AEBANQCACHtASAA1gIAIe4BAQDVAgAh7wFAANcCACEPCAAAjAMAIAkAAOACACALAACBAwAgzgEAAIsDADDPAQAADAAQ0AEAAIsDADDRAQEA1AIAIdMBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAh9AEBANQCACH1AQEA1AIAIZsCAAAMACCcAgAADAAgAtMBAQAAAAH1AQEAAAABDQgAAIwDACAJAADgAgAgCwAAgQMAIM4BAACLAwAwzwEAAAwAENABAACLAwAw0QEBANQCACHTAQEA1AIAIdoBQADXAgAh7wFAANcCACHzAQEA1AIAIfQBAQDUAgAh9QEBANQCACENBgAA2AIAIM4BAADTAgAwzwEAALcBABDQAQAA0wIAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAh9AEBANQCACH2AQEA1QIAIfcBIADWAgAhmwIAALcBACCcAgAAtwEAIALsAQEAAAAB8AEBAAAAAQkFAACPAwAgCgAAiQMAIM4BAACOAwAwzwEAAAgAENABAACOAwAw0QEBANQCACHaAUAA1wIAIewBAQDUAgAh8AEBANQCACEPBAAA3wIAIAkAAOACACDOAQAA3QIAMM8BAACeAQAQ0AEAAN0CADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACHzAQEA1AIAIfYBAQDVAgAh9wEgANYCACH7ASAA1gIAIfwBAgDeAgAhmwIAAJ4BACCcAgAAngEAIALSAQEAAAAB8AEBAAAAAQoDAAD5AgAgBQAAjwMAIM4BAACRAwAwzwEAAAMAENABAACRAwAw0QEBANQCACHSAQEA1AIAIfABAQDUAgAh8QFAANcCACHyAQEA1QIAIQAAAAABoAIBAAAAAQGgAgEAAAABAaACQAAAAAEHIgAA2gUAICMAAN0FACCdAgAA2wUAIJ4CAADcBQAgoQIAAB4AIKICAAAeACCjAgAAAQAgAyIAANoFACCdAgAA2wUAIKMCAAABACAAAAABoAIgAAAAAQUiAADSBQAgIwAA2AUAIJ0CAADTBQAgngIAANcFACCjAgAAAQAgBSIAANAFACAjAADVBQAgnQIAANEFACCeAgAA1AUAIKMCAAAOACADIgAA0gUAIJ0CAADTBQAgowIAAAEAIAMiAADQBQAgnQIAANEFACCjAgAADgAgAAAABSIAAMgFACAjAADOBQAgnQIAAMkFACCeAgAAzQUAIKMCAACbAQAgBSIAAMYFACAjAADLBQAgnQIAAMcFACCeAgAAygUAIKMCAAAOACADIgAAyAUAIJ0CAADJBQAgowIAAJsBACADIgAAxgUAIJ0CAADHBQAgowIAAA4AIAAAAAUiAAC-BQAgIwAAxAUAIJ0CAAC_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-QMAMKECAAD5AwAwogIAAPkDADCjAgAA-QMAMKQCAAD7AwAwpQIAAPwDADALIgAA7AMAMCMAAPADADCdAgAA7QMAMJ4CAADuAwAwnwIAAO8DACCgAgAAxwMAMKECAADHAwAwogIAAMcDADCjAgAAxwMAMKQCAADxAwAwpQIAAMoDADAECgAAqQMAINEBAQAAAAHaAUAAAAAB7AEBAAAAAQIAAAAKACAiAAD0AwAgAwAAAAoAICIAAPQDACAjAADzAwAgARsAALMFADACAAAACgAgGwAA8wMAIAIAAADLAwAgGwAA8gMAIAPRAQEAlgMAIdoBQACYAwAh7AEBAJYDACEECgAApwMAINEBAQCWAwAh2gFAAJgDACHsAQEAlgMAIQQKAACpAwAg0QEBAAAAAdoBQAAAAAHsAQEAAAABBQMAAK8DACDRAQEAAAAB0gEBAAAAAfEBQAAAAAHyAQEAAAABAgAAAAUAICIAAIAEACADAAAABQAgIgAAgAQAICMAAP8DACABGwAAsgUAMAsDAAD5AgAgBQAAjwMAIM4BAACRAwAwzwEAAAMAENABAACRAwAw0QEBAAAAAdIBAQDUAgAh8AEBANQCACHxAUAA1wIAIfIBAQDVAgAhmgIAAJADACACAAAABQAgGwAA_wMAIAIAAAD9AwAgGwAA_gMAIAjOAQAA_AMAMM8BAAD9AwAQ0AEAAPwDADDRAQEA1AIAIdIBAQDUAgAh8AEBANQCACHxAUAA1wIAIfIBAQDVAgAhCM4BAAD8AwAwzwEAAP0DABDQAQAA_AMAMNEBAQDUAgAh0gEBANQCACHwAQEA1AIAIfEBQADXAgAh8gEBANUCACEE0QEBAJYDACHSAQEAlgMAIfEBQACYAwAh8gEBAJcDACEFAwAArQMAINEBAQCWAwAh0gEBAJYDACHxAUAAmAMAIfIBAQCXAwAhBQMAAK8DACDRAQEAAAAB0gEBAAAAAfEBQAAAAAHyAQEAAAABBCIAAPUDADCdAgAA9gMAMJ8CAAD4AwAgowIAAPkDADAEIgAA7AMAMJ0CAADtAwAwnwIAAO8DACCjAgAAxwMAMAAAAAAAByIAAK0FACAjAACwBQAgnQIAAK4FACCeAgAArwUAIKECAAAeACCiAgAAHgAgowIAAAEAIAMiAACtBQAgnQIAAK4FACCjAgAAAQAgAAAAAaACAAAAggICAaACQAAAAAEHIgAApQUAICMAAKsFACCdAgAApgUAIJ4CAACqBQAgoQIAAB4AIKICAAAeACCjAgAAAQAgBSIAAKMFACAjAACoBQAgnQIAAKQFACCeAgAApwUAIKMCAAABACADIgAApQUAIJ0CAACmBQAgowIAAAEAIAMiAACjBQAgnQIAAKQFACCjAgAAAQAgAAAAAaACAAAAigICByIAAJ4FACAjAAChBQAgnQIAAJ8FACCeAgAAoAUAIKECAAAeACCiAgAAHgAgowIAAAEAIAMiAACeBQAgnQIAAJ8FACCjAgAAAQAgAAAAAaACAAAAjgIDAaACAAAAkgICCyIAAPYEADAjAACCBQAwnQIAAPcEADCeAgAAgQUAMJ8CAAD4BAAgoAIAAPkDADChAgAA-QMAMKICAAD5AwAwowIAAPkDADCkAgAAgwUAMKUCAAD8AwAwCyIAAPEEADAjAAD7BAAwnQIAAPIEADCeAgAA-gQAMJ8CAADzBAAgoAIAAPQEADChAgAA9AQAMKICAAD0BAAwowIAAPQEADCkAgAA_AQAMKUCAAD9BAAwCyIAAN0EADAjAADiBAAwnQIAAN4EADCeAgAA3wQAMJ8CAADgBAAgoAIAAOEEADChAgAA4QQAMKICAADhBAAwowIAAOEEADCkAgAA4wQAMKUCAADkBAAwByIAAJEFACAjAACcBQAgnQIAAJIFACCeAgAAmwUAIKECAAAeACCiAgAAHgAgowIAAAEAIAsiAADUBAAwIwAA2AQAMJ0CAADVBAAwngIAANYEADCfAgAA1wQAIKACAAC7AwAwoQIAALsDADCiAgAAuwMAMKMCAAC7AwAwpAIAANkEADClAgAAvgMAMAsiAADIBAAwIwAAzQQAMJ0CAADJBAAwngIAAMoEADCfAgAAywQAIKACAADMBAAwoQIAAMwEADCiAgAAzAQAMKMCAADMBAAwpAIAAM4EADClAgAAzwQAMAsiAAC_BAAwIwAAwwQAMJ0CAADABAAwngIAAMEEADCfAgAAwgQAIKACAAC3BAAwoQIAALcEADCiAgAAtwQAMKMCAAC3BAAwpAIAAMQEADClAgAAugQAMAsiAACzBAAwIwAAuAQAMJ0CAAC0BAAwngIAALUEADCfAgAAtgQAIKACAAC3BAAwoQIAALcEADCiAgAAtwQAMKMCAAC3BAAwpAIAALkEADClAgAAugQAMAsiAACnBAAwIwAArAQAMJ0CAACoBAAwngIAAKkEADCfAgAAqgQAIKACAACrBAAwoQIAAKsEADCiAgAAqwQAMKMCAACrBAAwpAIAAK0EADClAgAArgQAMAbRAQEAAAAB2gFAAAAAAe8BQAAAAAH2AQEAAAAB_QEBAAAAAf4BAQAAAAECAAAAMQAgIgAAsgQAIAMAAAAxACAiAACyBAAgIwAAsQQAIAEbAACaBQAwCxQAAPUCACDOAQAA9AIAMM8BAAAvABDQAQAA9AIAMNEBAQAAAAHaAUAA1wIAIe8BQADXAgAh9gEBANUCACH9AQEAAAAB_gEBANQCACH_AQEA1QIAIQIAAAAxACAbAACxBAAgAgAAAK8EACAbAACwBAAgCs4BAACuBAAwzwEAAK8EABDQAQAArgQAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfYBAQDVAgAh_QEBANQCACH-AQEA1AIAIf8BAQDVAgAhCs4BAACuBAAwzwEAAK8EABDQAQAArgQAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfYBAQDVAgAh_QEBANQCACH-AQEA1AIAIf8BAQDVAgAhBtEBAQCWAwAh2gFAAJgDACHvAUAAmAMAIfYBAQCXAwAh_QEBAJYDACH-AQEAlgMAIQbRAQEAlgMAIdoBQACYAwAh7wFAAJgDACH2AQEAlwMAIf0BAQCWAwAh_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_AwAgGwAA2gQAIAbRAQEAlgMAIdoBQACYAwAh7AEBAJYDACHtASAAngMAIe4BAQCXAwAh7wFAAJgDACEHCgAAoAMAINEBAQCWAwAh2gFAAJgDACHsAQEAlgMAIe0BIACeAwAh7gEBAJcDACHvAUAAmAMAIQcKAACiAwAg0QEBAAAAAdoBQAAAAAHsAQEAAAAB7QEgAAAAAe4BAQAAAAHvAUAAAAABFwQAAOkEACALAADsBAAgDAAA6gQAIA0AAOsEACAQAADtBAAgEgAA7gQAIBMAAO8EACAVAADwBAAg0QEBAAAAAdoBQAAAAAHvAUAAAAAB8wEBAAAAAYICAAAAkgIChgIBAAAAAYsCAQAAAAGMAgEAAAABjgIAAACOAgOPAgEAAAABkAIBAAAAAZICIAAAAAGTAiAAAAABlAJAAAAAAZUCIAAAAAECAAAAAQAgIgAA6AQAIAMAAAABACAiAADoBAAgIwAA5wQAIAEbAACVBQAwHAQAAN8CACALAACBAwAgDAAA_wIAIA0AAIADACAOAAD1AgAgEAAAggMAIBIAAIMDACATAACDAwAgFQAAhAMAIM4BAAD8AgAwzwEAAB4AENABAAD8AgAw0QEBAAAAAdoBQADXAgAh7wFAANcCACHzAQEA1AIAIYICAAD-ApICIoYCAQAAAAGLAgEA1AIAIYwCAQDVAgAhjgIAAP0CjgIjjwIBANUCACGQAgEA1QIAIZICIADWAgAhkwIgANYCACGUAkAA-AIAIZUCIADWAgAhlgIBANUCACECAAAAAQAgGwAA5wQAIAIAAADlBAAgGwAA5gQAIBPOAQAA5AQAMM8BAADlBAAQ0AEAAOQEADDRAQEA1AIAIdoBQADXAgAh7wFAANcCACHzAQEA1AIAIYICAAD-ApICIoYCAQDUAgAhiwIBANQCACGMAgEA1QIAIY4CAAD9Ao4CI48CAQDVAgAhkAIBANUCACGSAiAA1gIAIZMCIADWAgAhlAJAAPgCACGVAiAA1gIAIZYCAQDVAgAhE84BAADkBAAwzwEAAOUEABDQAQAA5AQAMNEBAQDUAgAh2gFAANcCACHvAUAA1wIAIfMBAQDUAgAhggIAAP4CkgIihgIBANQCACGLAgEA1AIAIYwCAQDVAgAhjgIAAP0CjgIjjwIBANUCACGQAgEA1QIAIZICIADWAgAhkwIgANYCACGUAkAA-AIAIZUCIADWAgAhlgIBANUCACEP0QEBAJYDACHaAUAAmAMAIe8BQACYAwAh8wEBAJYDACGCAgAAnQSSAiKGAgEAlgMAIYsCAQCWAwAhjAIBAJcDACGOAgAAnASOAiOPAgEAlwMAIZACAQCXAwAhkgIgAJ4DACGTAiAAngMAIZQCQACOBAAhlQIgAJ4DACEXBAAAngQAIAsAAKIEACAMAACfBAAgDQAAoAQAIBAAAKMEACASAACkBAAgEwAApQQAIBUAAKYEACDRAQEAlgMAIdoBQACYAwAh7wFAAJgDACHzAQEAlgMAIYICAACdBJICIoYCAQCWAwAhiwIBAJYDACGMAgEAlwMAIY4CAACcBI4CI48CAQCXAwAhkAIBAJcDACGSAiAAngMAIZMCIACeAwAhlAJAAI4EACGVAiAAngMAIRcEAADpBAAgCwAA7AQAIAwAAOoEACANAADrBAAgEAAA7QQAIBIAAO4EACATAADvBAAgFQAA8AQAINEBAQAAAAHaAUAAAAAB7wFAAAAAAfMBAQAAAAGCAgAAAJICAoYCAQAAAAGLAgEAAAABjAIBAAAAAY4CAAAAjgIDjwIBAAAAAZACAQAAAAGSAiAAAAABkwIgAAAAAZQCQAAAAAGVAiAAAAABBCIAAPYEADCdAgAA9wQAMJ8CAAD4BAAgowIAAPkDADAEIgAA8QQAMJ0CAADyBAAwnwIAAPMEACCjAgAA9AQAMAQiAADdBAAwnQIAAN4EADCfAgAA4AQAIKMCAADhBAAwBCIAANQEADCdAgAA1QQAMJ8CAADXBAAgowIAALsDADAEIgAAyAQAMJ0CAADJBAAwnwIAAMsEACCjAgAAzAQAMAQiAAC_BAAwnQIAAMAEADCfAgAAwgQAIKMCAAC3BAAwBCIAALMEADCdAgAAtAQAMJ8CAAC2BAAgowIAALcEADAEIgAApwQAMJ0CAACoBAAwnwIAAKoEACCjAgAAqwQAMAoIAQAAAAHRAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gGAAAAAAdcBgAAAAAHYAQEAAAAB2QEBAAAAAdoBQAAAAAECAAAAHAAgIgAA9QQAIAEbAACUBQAwDwMAAPUCACAIAQDUAgAhzgEAAIUDADDPAQAAGgAQ0AEAAIUDADDRAQEAAAAB0gEBANUCACHTAQEA1AIAIdQBAQDVAgAh1QEBANUCACHWAQAAhgMAINcBAACGAwAg2AEBANUCACHZAQEA1QIAIdoBQADXAgAhCggBAAAAAdEBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAYAAAAAB1wGAAAAAAdgBAQAAAAHZAQEAAAAB2gFAAAAAAQUFAACwAwAg0QEBAAAAAfABAQAAAAHxAUAAAAAB8gEBAAAAAQIAAAAFACAiAAD5BAAgARsAAJMFADAFBQAAsAMAINEBAQAAAAHwAQEAAAAB8QFAAAAAAfIBAQAAAAEDAAAAHAAgIgAA9QQAICMAAIAFACACAAAAHAAgGwAAgAUAIAIAAAD-BAAgGwAA_wQAIA4IAQDUAgAhzgEAAP0EADDPAQAA_gQAENABAAD9BAAw0QEBANQCACHSAQEA1QIAIdMBAQDUAgAh1AEBANUCACHVAQEA1QIAIdYBAACGAwAg1wEAAIYDACDYAQEA1QIAIdkBAQDVAgAh2gFAANcCACEOCAEA1AIAIc4BAAD9BAAwzwEAAP4EABDQAQAA_QQAMNEBAQDUAgAh0gEBANUCACHTAQEA1AIAIdQBAQDVAgAh1QEBANUCACHWAQAAhgMAINcBAACGAwAg2AEBANUCACHZAQEA1QIAIdoBQADXAgAhCggBAJYDACHRAQEAlgMAIdMBAQCWAwAh1AEBAJcDACHVAQEAlwMAIdYBgAAAAAHXAYAAAAAB2AEBAJcDACHZAQEAlwMAIdoBQACYAwAhCggBAJYDACHRAQEAlgMAIdMBAQCWAwAh1AEBAJcDACHVAQEAlwMAIdYBgAAAAAHXAYAAAAAB2AEBAJcDACHZAQEAlwMAIdoBQACYAwAhAwAAAAUAICIAAPkEACAjAACFBQAgAgAAAAUAIBsAAIUFACACAAAA_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-wEgAJ4DACH8AQIA6QMAIQMAAAAeACAiAAC-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-ARo_ARxBAR1DEB5EER9HASBJECFKEiRMASVNASZOECpREytSFyxTDC1UDC5VDC9WDDBXDDFZDDJbEDNcGDRfDDVhEDZiGTdkDDhlDDlmEDppGjtqHjxrDT1sDT5tDT9uDUBvDUFxDUJzEEN0H0R3DUV5EEZ6IEd8DUh9DUl-EEqBASFLggElTIMBDk2EAQ5OhQEOT4YBDlCHAQ5RiQEOUosBEFOMASZUjwEOVZEBEFaSASdXlAEOWJUBDlmWARBamQEoW5oBLFycAQNdnQEDXqABA1-hAQNgogEDYaQBA2KmARBjpwEtZKkBA2WrARBmrAEuZ60BA2iuAQNprwEQbLIBL22zATVutQEGb7YBBnC5AQZxugEGcrsBBnO9AQZ0vwEQdcABNnbCAQZ3xAEQeMUBN3nGAQZ6xwEGe8gBEHzLATh9zAE8fs0BBX_OAQWAAc8BBYEB0AEFggHRAQWDAdMBBYQB1QEQhQHWAT2GAdgBBYcB2gEQiAHbAT6JAdwBBYoB3QEFiwHeARCMAeEBP40B4gFDjgHjAQKPAeQBApAB5QECkQHmAQKSAecBApMB6QEClAHrARCVAewBRJYB7gEClwHwARCYAfEBRZkB8gECmgHzAQKbAfQBEJwB9wFGnQH4AUqeAfkBBJ8B-gEEoAH7AQShAfwBBKIB_QEEowH_AQSkAYECEKUBggJLpgGEAgSnAYYCEKgBhwJMqQGIAgSqAYkCBKsBigIQrAGNAk2tAY4CUa4BjwIIrwGQAgiwAZECCLEBkgIIsgGTAgizAZUCCLQBlwIQtQGYAlK2AZoCCLcBnAIQuAGdAlO5AZ4CCLoBnwIIuwGgAhC8AaMCVL0BpAJYvgGlAgu_AaYCC8ABpwILwQGoAgvCAakCC8MBqwILxAGtAhDFAa4CWcYBsQILxwGzAhDIAbQCWskBtgILygG3AgvLAbgCEMwBuwJbzQG8Al8"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  LeadScalarFieldEnum: () => LeadScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PermissionScalarFieldEnum: () => PermissionScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  RolePermissionScalarFieldEnum: () => RolePermissionScalarFieldEnum,
  RoleScalarFieldEnum: () => RoleScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SystemModuleScalarFieldEnum: () => SystemModuleScalarFieldEnum,
  SystemSettingScalarFieldEnum: () => SystemSettingScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserPermissionScalarFieldEnum: () => UserPermissionScalarFieldEnum,
  UserRoleScalarFieldEnum: () => UserRoleScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Lead: "Lead",
  Task: "Task",
  SystemSetting: "SystemSetting",
  Role: "Role",
  SystemModule: "SystemModule",
  Permission: "Permission",
  UserRole: "UserRole",
  RolePermission: "RolePermission",
  UserPermission: "UserPermission",
  AuditLog: "AuditLog"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  profilePhoto: "profilePhoto",
  gender: "gender",
  contactNumber: "contactNumber",
  address: "address",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  isSuperAdmin: "isSuperAdmin",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  managerId: "managerId"
};
var LeadScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  phone: "phone",
  company: "company",
  status: "status",
  source: "source",
  assignedTo: "assignedTo",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  status: "status",
  dueDate: "dueDate",
  assignedTo: "assignedTo",
  createdBy: "createdBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SystemSettingScalarFieldEnum = {
  id: "id",
  key: "key",
  value: "value",
  description: "description",
  updatedBy: "updatedBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RoleScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  isSystem: "isSystem",
  isActive: "isActive",
  hierarchyLevel: "hierarchyLevel",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SystemModuleScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PermissionScalarFieldEnum = {
  id: "id",
  action: "action",
  name: "name",
  slug: "slug",
  moduleId: "moduleId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserRoleScalarFieldEnum = {
  id: "id",
  userId: "userId",
  roleId: "roleId",
  assignedAt: "assignedAt",
  assignedBy: "assignedBy"
};
var RolePermissionScalarFieldEnum = {
  id: "id",
  roleId: "roleId",
  permissionId: "permissionId",
  createdAt: "createdAt"
};
var UserPermissionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  permissionId: "permissionId",
  granted: "granted",
  grantedBy: "grantedBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AuditLogScalarFieldEnum = {
  id: "id",
  userId: "userId",
  action: "action",
  module: "module",
  targetId: "targetId",
  targetType: "targetType",
  oldData: "oldData",
  newData: "newData",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, options) => {
  const token = jwt.sign(payload, secret, options);
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: error.message, error };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/middlewares/checkAuth.ts
var checkAuth = (options = {}) => async (req, res, next) => {
  try {
    const accessToken = CookieUtils.getCookie(req, "accessToken") || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : void 0);
    if (!accessToken) {
      throw new AppError_default(status2.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, config_default.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success || !verifiedToken.data) {
      throw new AppError_default(status2.UNAUTHORIZED, "Unauthorized access! Invalid or expired access token.");
    }
    const { userId } = verifiedToken.data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: {
                      include: { module: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!user) {
      throw new AppError_default(status2.UNAUTHORIZED, "Unauthorized access! User not found.");
    }
    if (user.status === "BLOCKED") {
      throw new AppError_default(status2.UNAUTHORIZED, "Unauthorized access! User is blocked.");
    }
    if (user.isDeleted || user.status === "DELETED") {
      throw new AppError_default(status2.UNAUTHORIZED, "Unauthorized access! User account is deleted.");
    }
    const userRoleNames = user.userRoles.map((ur) => ur.role.name);
    req.user = {
      id: user.id,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      roles: userRoleNames,
      status: user.status
    };
    if (user.isSuperAdmin) {
      return next();
    }
    if (options.requireSuperAdmin) {
      throw new AppError_default(status2.FORBIDDEN, "Forbidden! Super admin access required.");
    }
    if (options.roles && options.roles.length > 0) {
      const hasRole = userRoleNames.some((roleName) => options.roles.includes(roleName));
      if (!hasRole) {
        throw new AppError_default(
          status2.FORBIDDEN,
          `Forbidden! Required role(s): ${options.roles.join(", ")}.`
        );
      }
    }
    if (options.permissions && options.permissions.length > 0) {
      const rolePermissionsMap = /* @__PURE__ */ new Map();
      user.userRoles.forEach((ur) => {
        ur.role.rolePermissions.forEach((rp) => {
          if (rp.permission?.module?.slug) {
            const key = `${rp.permission.module.slug}.${rp.permission.action.toUpperCase()}`;
            rolePermissionsMap.set(key, true);
          }
        });
      });
      const userOverrides = await prisma.userPermission.findMany({
        where: { userId: user.id },
        include: { permission: { include: { module: true } } }
      });
      userOverrides.forEach((override) => {
        if (override.permission?.module?.slug) {
          const key = `${override.permission.module.slug}.${override.permission.action.toUpperCase()}`;
          if (override.granted) {
            rolePermissionsMap.set(key, true);
          } else {
            rolePermissionsMap.delete(key);
          }
        }
      });
      const isAllowed = options.permissionMode === "ANY" ? options.permissions.some((p) => rolePermissionsMap.has(`${p.module}.${p.action.toUpperCase()}`)) : options.permissions.every((p) => rolePermissionsMap.has(`${p.module}.${p.action.toUpperCase()}`));
      console.log(`[DEBUG] Permission Check:`);
      console.log(` - User: ${user.email}`);
      console.log(` - Required: ${JSON.stringify(options.permissions)} (Mode: ${options.permissionMode || "ALL"})`);
      console.log(` - Effective Keys: ${Array.from(rolePermissionsMap.keys()).join(", ")}`);
      console.log(` - Result: ${isAllowed}`);
      if (!isAllowed) {
        throw new AppError_default(status2.FORBIDDEN, "Forbidden! Insufficient permissions.");
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      return next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/modules/auth/auth.controller.ts
import status4 from "http-status";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(payload, config_default.ACCESS_TOKEN_SECRET, {
    expiresIn: config_default.ACCESS_TOKEN_EXPIRES_IN
  });
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken3 = jwtUtils.createToken(payload, config_default.REFRESH_TOKEN_SECRET, {
    expiresIn: config_default.REFRESH_TOKEN_EXPIRES_IN
  });
  return refreshToken3;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: config_default.NODE_ENV === "production",
    sameSite: config_default.NODE_ENV === "production" ? "none" : "lax",
    // Lax is default but explicit is better
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: config_default.NODE_ENV === "production",
    sameSite: config_default.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 7
    // 7 days
  });
};
var clearAuthCookies = (res) => {
  CookieUtils.clearCookie(res, "accessToken", { path: "/" });
  CookieUtils.clearCookie(res, "refreshToken", { path: "/" });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies
};

// src/utils/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import status3 from "http-status";
var getResolvedPermissions = async (userId) => {
  const userWithRoles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: { include: { module: true } }
                }
              }
            }
          }
        }
      }
    }
  });
  if (!userWithRoles) return [];
  const effectivePermissions = /* @__PURE__ */ new Map();
  userWithRoles.userRoles.forEach((ur) => {
    ur.role.rolePermissions.forEach((rp) => {
      const p = rp.permission;
      const key = `${p.module.slug}.${p.action.toUpperCase()}`;
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug
      });
    });
  });
  const userOverrides = await prisma.userPermission.findMany({
    where: { userId },
    include: {
      permission: { include: { module: true } }
    }
  });
  userOverrides.forEach((override) => {
    const p = override.permission;
    const key = `${p.module.slug}.${p.action.toUpperCase()}`;
    if (override.granted) {
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug
      });
    } else {
      effectivePermissions.delete(key);
    }
  });
  return Array.from(effectivePermissions.values());
};
var register = async (payload) => {
  const { name, email, password } = payload;
  const registrationSetting = await prisma.systemSetting.findUnique({
    where: { key: "allow_registration" }
  });
  if (registrationSetting?.value === "false") {
    throw new AppError_default(status3.FORBIDDEN, "Public registration is currently disabled.");
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError_default(status3.CONFLICT, "User with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { name, email, password: hashedPassword }
    });
    const userRole = await tx.role.findUnique({ where: { name: "User" } });
    if (userRole) {
      await tx.userRole.create({
        data: { userId: newUser.id, roleId: userRole.id }
      });
    }
    return newUser;
  });
  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken3 = tokenUtils.getRefreshToken(tokenPayload);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken: refreshToken3 };
};
var login = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError_default(status3.NOT_FOUND, "No user found with this email.");
  }
  if (user.isDeleted || user.status === "DELETED") {
    throw new AppError_default(status3.NOT_FOUND, "User account is deleted.");
  }
  if (user.status === "BLOCKED") {
    throw new AppError_default(status3.FORBIDDEN, "User account is blocked. Contact support.");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError_default(status3.UNAUTHORIZED, "Incorrect password.");
  }
  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken3 = tokenUtils.getRefreshToken(tokenPayload);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken: refreshToken3 };
};
var getMe = async (requestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      gender: true,
      contactNumber: true,
      address: true,
      status: true,
      isSuperAdmin: true,
      needPasswordChange: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: { include: { module: true } }
                }
              }
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw new AppError_default(status3.NOT_FOUND, "User not found.");
  }
  const permissions = await getResolvedPermissions(user.id);
  return { ...user, permissions };
};
var refreshToken = async (token) => {
  const verifiedToken = jwtUtils.verifyToken(token, config_default.REFRESH_TOKEN_SECRET);
  if (!verifiedToken.success || !verifiedToken.data) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid or expired refresh token.");
  }
  const data = verifiedToken.data;
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user || user.isDeleted || user.status !== "ACTIVE") {
    throw new AppError_default(status3.UNAUTHORIZED, "User is not active.");
  }
  const tokenPayload = { userId: user.id, email: user.email };
  const newAccessToken = tokenUtils.getAccessToken(tokenPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(tokenPayload);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
var changePassword = async (requestUser, payload) => {
  const user = await prisma.user.findUnique({ where: { id: requestUser.id } });
  if (!user) {
    throw new AppError_default(status3.NOT_FOUND, "User not found.");
  }
  const isPasswordMatch = await bcrypt.compare(payload.currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new AppError_default(status3.UNAUTHORIZED, "Current password is incorrect.");
  }
  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedNewPassword,
      needPasswordChange: false
    }
  });
  return { message: "Password changed successfully." };
};
var logout = async () => {
  return { message: "Logged out successfully." };
};
var AuthService = {
  register,
  login,
  getMe,
  refreshToken,
  changePassword,
  logout
};

// src/modules/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  sendResponse(res, {
    httpStatusCode: status4.CREATED,
    success: true,
    message: "User registered successfully.",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});
var login2 = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Login successful.",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const result = await AuthService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "User profile retrieved successfully.",
    data: result
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const token = CookieUtils.getCookie(req, "refreshToken") || req.body.refreshToken;
  const result = await AuthService.refreshToken(token);
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Token refreshed successfully.",
    data: { accessToken: result.accessToken }
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.user, req.body);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Password changed successfully.",
    data: result
  });
});
var logout2 = catchAsync(async (req, res) => {
  tokenUtils.clearAuthCookies(res);
  const result = await AuthService.logout();
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var AuthController = {
  register: register2,
  login: login2,
  getMe: getMe2,
  refreshToken: refreshToken2,
  changePassword: changePassword2,
  logout: logout2
};

// src/modules/auth/auth.validation.ts
import z from "zod";
var registerZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
var loginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
var changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
});
var forgotPasswordZodSchema = z.object({
  email: z.string().email("Invalid email address")
});
var resetPasswordZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
});

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(registerZodSchema), AuthController.register);
router.post("/login", validateRequest(loginZodSchema), AuthController.login);
router.get("/me", checkAuth(), AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/change-password", checkAuth(), validateRequest(changePasswordZodSchema), AuthController.changePassword);
router.post("/logout", checkAuth(), AuthController.logout);
var AuthRoutes = router;

// src/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/modules/user/user.controller.ts
import status6 from "http-status";

// src/modules/user/user.service.ts
import bcrypt2 from "bcrypt";
import status5 from "http-status";

// src/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.page = 1;
    this.limit = 10;
    this.skip = 0;
    this.sortBy = "createdAt";
    this.sortOrder = "desc";
    this.query = { where: {}, include: {}, orderBy: {}, skip: 0, take: 10 };
    this.countQuery = { where: {} };
  }
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map((field) => {
        if (field.includes(".")) {
          const parts = field.split(".");
          if (parts.length === 2) {
            const [relation, nestedField] = parts;
            const stringFilter2 = {
              contains: searchTerm,
              mode: "insensitive"
            };
            return { [relation]: { [nestedField]: stringFilter2 } };
          } else if (parts.length === 3) {
            const [relation, nestedRelation, nestedField] = parts;
            const stringFilter2 = {
              contains: searchTerm,
              mode: "insensitive"
            };
            return {
              [relation]: {
                some: { [nestedRelation]: { [nestedField]: stringFilter2 } }
              }
            };
          }
        }
        const stringFilter = {
          contains: searchTerm,
          mode: "insensitive"
        };
        return { [field]: stringFilter };
      });
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") return;
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) return;
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = { some: {} };
            countQueryWhere[relation] = { some: {} };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) queryRelation.some = {};
          if (!countRelation.some) countRelation.some = {};
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) querySome[nestedRelation] = {};
          if (!countSome[nestedRelation]) countSome[nestedRelation] = {};
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) return;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(value);
        countQueryWhere[key] = this.parseRangeFilter(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = { [relation]: { [nestedField]: sortOrder } };
      } else {
        this.query.orderBy = { [sortBy]: sortOrder };
      }
    } else {
      this.query.orderBy = { [sortBy]: sortOrder };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray.forEach((field) => {
        if (this.selectFields) this.selectFields[field] = true;
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) return this;
    this.query.include = {
      ...this.query.include,
      ...relation
    };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(
      this.query.where,
      condition
    );
    this.countQuery.where = this.deepMerge(
      this.countQuery.where,
      condition
    );
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: { page: this.page, limit: this.limit, total, totalPages }
    };
  }
  async count() {
    return await this.model.count(this.countQuery);
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(
            result[key],
            source[key]
          );
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (typeof value === "string" && !isNaN(Number(value)) && value !== "") return Number(value);
    if (Array.isArray(value)) return { in: value.map((item) => this.parseFilterValue(item)) };
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          rangeQuery[operator] = Array.isArray(operatorValue) ? operatorValue : [parsedValue];
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/modules/user/user.service.ts
var userSelect = {
  id: true,
  name: true,
  email: true,
  profilePhoto: true,
  gender: true,
  contactNumber: true,
  address: true,
  status: true,
  isSuperAdmin: true,
  needPasswordChange: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true
};
var createUser = async (payload) => {
  const { roleId, ...userData } = payload;
  const existing = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existing) {
    throw new AppError_default(status5.CONFLICT, "User with this email already exists.");
  }
  const hashedPassword = await bcrypt2.hash(userData.password, 12);
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { ...userData, password: hashedPassword },
      select: userSelect
    });
    const targetRoleId = roleId || (await tx.role.findUnique({ where: { name: "User" } }))?.id;
    if (targetRoleId) {
      await tx.userRole.create({
        data: { userId: newUser.id, roleId: targetRoleId }
      });
    }
    return newUser;
  });
  return user;
};
var getAllUsers = async (query) => {
  const result = await new QueryBuilder(
    prisma.user,
    query,
    {
      searchableFields: ["name", "email", "contactNumber"],
      filterableFields: ["status", "gender", "isSuperAdmin"]
    }
  ).search().filter().where({ isDeleted: false }).sort().paginate().include({
    userRoles: {
      include: {
        role: true
      }
    }
  }).execute();
  result.data = result.data.map((user) => ({
    ...user,
    roleId: user.userRoles?.[0]?.roleId || null,
    role: user.userRoles?.[0]?.role || null
  }));
  return result;
};
var getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      ...userSelect,
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: { include: { module: true } } }
              }
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found.");
  }
  return {
    ...user,
    roleId: user.userRoles?.[0]?.roleId || null,
    role: user.userRoles?.[0]?.role || null
  };
};
var updateUser = async (id, payload, requestUser) => {
  if (!requestUser.isSuperAdmin && requestUser.id !== id) {
    throw new AppError_default(status5.FORBIDDEN, "You can only update your own profile.");
  }
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found.");
  }
  const { roleId, ...userData } = payload;
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id },
      data: userData,
      select: userSelect
    });
    if (roleId) {
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.create({
        data: {
          userId: id,
          roleId
        }
      });
    }
    return updatedUser;
  });
  return result;
};
var updateUserStatus = async (id, payload) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found.");
  }
  if (user.isSuperAdmin) {
    throw new AppError_default(status5.FORBIDDEN, "Cannot change the status of a super admin.");
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { status: payload.status },
    select: userSelect
  });
  return updated;
};
var softDeleteUser = async (id) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found.");
  }
  if (user.isSuperAdmin) {
    throw new AppError_default(status5.FORBIDDEN, "Cannot delete a super admin.");
  }
  const deleted = await prisma.user.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date(), status: "DELETED" },
    select: userSelect
  });
  return deleted;
};
var assignRolesToUser = async (id, payload) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found.");
  }
  const roles = await prisma.role.findMany({ where: { id: { in: payload.roleIds } } });
  if (roles.length !== payload.roleIds.length) {
    throw new AppError_default(status5.NOT_FOUND, "One or more roles not found.");
  }
  await prisma.$transaction(
    payload.roleIds.map(
      (roleId) => prisma.userRole.upsert({
        where: { userId_roleId: { userId: id, roleId } },
        update: {},
        create: { userId: id, roleId }
      })
    )
  );
  return getUserById(id);
};
var removeRolesFromUser = async (id, payload) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found.");
  }
  await prisma.userRole.deleteMany({
    where: { userId: id, roleId: { in: payload.roleIds } }
  });
  return getUserById(id);
};
var getMinimalUsers = async () => {
  return await prisma.user.findMany({
    where: { isDeleted: false, status: "ACTIVE" },
    select: {
      id: true,
      name: true
    },
    orderBy: { name: "asc" }
  });
};
var UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  softDeleteUser,
  assignRolesToUser,
  removeRolesFromUser,
  getMinimalUsers
};

// src/modules/auditLog/auditLog.service.ts
var getAllAuditLogs = async (query) => {
  const result = await new QueryBuilder(
    prisma.auditLog,
    query,
    {
      searchableFields: ["action", "module", "targetType"],
      filterableFields: ["userId", "module", "action", "targetType"]
    }
  ).search().filter().sort().paginate().include({ user: { select: { id: true, name: true, email: true } } }).execute();
  return result;
};
var getAuditLogById = async (id) => {
  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });
  return log;
};
var createAuditLog = async (data) => {
  return prisma.auditLog.create({ data });
};
var AuditLogService = {
  getAllAuditLogs,
  getAuditLogById,
  createAuditLog
};

// src/modules/user/user.controller.ts
var createUser2 = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "USER_CREATED",
    module: "users",
    targetId: result.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "User created successfully.",
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Users retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User retrieved successfully.",
    data: result
  });
});
var updateUser2 = catchAsync(async (req, res) => {
  const result = await UserService.updateUser(req.params.id, req.body, req.user);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "USER_UPDATED",
    module: "users",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User updated successfully.",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const result = await UserService.updateUserStatus(req.params.id, req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "USER_STATUS_UPDATED",
    module: "users",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User status updated successfully.",
    data: result
  });
});
var softDeleteUser2 = catchAsync(async (req, res) => {
  const result = await UserService.softDeleteUser(req.params.id);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "USER_DELETED",
    module: "users",
    targetId: req.params.id,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "User deleted successfully.",
    data: result
  });
});
var assignRolesToUser2 = catchAsync(async (req, res) => {
  const result = await UserService.assignRolesToUser(req.params.id, req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "ROLES_ASSIGNED_TO_USER",
    module: "users",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Roles assigned to user successfully.",
    data: result
  });
});
var removeRolesFromUser2 = catchAsync(async (req, res) => {
  const result = await UserService.removeRolesFromUser(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Roles removed from user successfully.",
    data: result
  });
});
var getMinimalUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.getMinimalUsers();
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Minimal user list retrieved successfully.",
    data: result
  });
});
var UserController = {
  createUser: createUser2,
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  updateUserStatus: updateUserStatus2,
  softDeleteUser: softDeleteUser2,
  assignRolesToUser: assignRolesToUser2,
  removeRolesFromUser: removeRolesFromUser2,
  getMinimalUsers: getMinimalUsers2
};

// src/modules/user/user.validation.ts
import z2 from "zod";
var createUserZodSchema = z2.object({
  name: z2.string().min(2),
  email: z2.string().email(),
  password: z2.string().min(8),
  gender: z2.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  contactNumber: z2.string().optional(),
  address: z2.string().optional()
});
var updateUserZodSchema = z2.object({
  name: z2.string().min(2).optional(),
  gender: z2.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  contactNumber: z2.string().optional(),
  address: z2.string().optional(),
  profilePhoto: z2.string().url().optional(),
  status: z2.enum(["ACTIVE", "BLOCKED"]).optional(),
  roleId: z2.string().optional()
});
var updateUserStatusZodSchema = z2.object({
  status: z2.enum(["ACTIVE", "BLOCKED"])
});
var assignRolesZodSchema = z2.object({
  roleIds: z2.array(z2.string()).min(1, "At least one role ID is required")
});

// src/modules/user/user.route.ts
var router2 = Router2();
router2.post(
  "/",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router2.get(
  "/",
  checkAuth({ permissions: [{ module: "users", action: "READ" }] }),
  UserController.getAllUsers
);
router2.get(
  "/minimal",
  checkAuth(),
  // Any authenticated user can see names for assignment
  UserController.getMinimalUsers
);
router2.get(
  "/:id",
  checkAuth(),
  UserController.getUserById
);
router2.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);
router2.patch(
  "/:id/status",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updateUserStatusZodSchema),
  UserController.updateUserStatus
);
router2.delete(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  UserController.softDeleteUser
);
router2.post(
  "/:id/roles",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignRolesZodSchema),
  UserController.assignRolesToUser
);
router2.delete(
  "/:id/roles",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignRolesZodSchema),
  UserController.removeRolesFromUser
);
var UserRoutes = router2;

// src/modules/role/role.route.ts
import { Router as Router3 } from "express";

// src/modules/role/role.controller.ts
import status8 from "http-status";

// src/modules/role/role.service.ts
import status7 from "http-status";
var roleInclude = {
  rolePermissions: {
    include: {
      permission: {
        include: { module: true }
      }
    }
  },
  _count: { select: { userRoles: true } }
};
var transformRole = (role) => {
  if (!role) return null;
  const { rolePermissions, ...rest } = role;
  return {
    ...rest,
    permissions: (rolePermissions || []).filter((rp) => rp && rp.permission).map((rp) => ({
      ...rp.permission,
      id: rp.permission.id
    }))
  };
};
var createRole = async (payload) => {
  const existingRole = await prisma.role.findUnique({ where: { name: payload.name } });
  if (existingRole) {
    throw new AppError_default(status7.CONFLICT, `Role with name "${payload.name}" already exists.`);
  }
  const role = await prisma.role.create({
    data: payload,
    include: roleInclude
  });
  return transformRole(role);
};
var getAllRoles = async (query) => {
  const result = await new QueryBuilder(
    prisma.role,
    query,
    {
      searchableFields: ["name", "description"],
      filterableFields: ["isActive"]
    }
  ).search().filter().sort().paginate().include(roleInclude).execute();
  result.data = result.data.map(transformRole);
  return result;
};
var getRoleById = async (id) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: roleInclude
  });
  if (!role) {
    throw new AppError_default(status7.NOT_FOUND, "Role not found.");
  }
  return transformRole(role);
};
var updateRole = async (id, payload) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError_default(status7.NOT_FOUND, "Role not found.");
  }
  if (role.isSystem && (payload.name || payload.isActive === false)) {
    throw new AppError_default(status7.FORBIDDEN, "System roles cannot be modified.");
  }
  if (payload.name) {
    const duplicate = await prisma.role.findFirst({
      where: { name: payload.name, id: { not: id } }
    });
    if (duplicate) {
      throw new AppError_default(status7.CONFLICT, `Role with name "${payload.name}" already exists.`);
    }
  }
  const updated = await prisma.role.update({
    where: { id },
    data: payload,
    include: roleInclude
  });
  return transformRole(updated);
};
var deleteRole = async (id) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError_default(status7.NOT_FOUND, "Role not found.");
  }
  if (role.isSystem) {
    throw new AppError_default(status7.FORBIDDEN, "System roles cannot be deleted.");
  }
  await prisma.role.delete({ where: { id } });
  return { message: "Role deleted successfully." };
};
var assignPermissionsToRole = async (id, payload) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError_default(status7.NOT_FOUND, "Role not found.");
  }
  const permissions = await prisma.permission.findMany({
    where: { id: { in: payload.permissionIds } }
  });
  if (permissions.length !== payload.permissionIds.length) {
    throw new AppError_default(status7.NOT_FOUND, "One or more permissions not found.");
  }
  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: id } });
    if (payload.permissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: payload.permissionIds.map((permissionId) => ({
          roleId: id,
          permissionId
        }))
      });
    }
  });
  const updatedRole = await prisma.role.findUnique({ where: { id }, include: roleInclude });
  return transformRole(updatedRole);
};
var removePermissionsFromRole = async (id, payload) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError_default(status7.NOT_FOUND, "Role not found.");
  }
  await prisma.rolePermission.deleteMany({
    where: { roleId: id, permissionId: { in: payload.permissionIds } }
  });
  const updatedRole = await prisma.role.findUnique({ where: { id }, include: roleInclude });
  return transformRole(updatedRole);
};
var RoleService = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  removePermissionsFromRole
};

// src/modules/role/role.controller.ts
var createRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.createRole(req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "ROLE_CREATED",
    module: "roles",
    targetId: result.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Role created successfully.",
    data: result
  });
});
var getAllRoles2 = catchAsync(async (req, res) => {
  const result = await RoleService.getAllRoles(req.query);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Roles retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getRoleById2 = catchAsync(async (req, res) => {
  const result = await RoleService.getRoleById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Role retrieved successfully.",
    data: result
  });
});
var updateRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.updateRole(req.params.id, req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "ROLE_UPDATED",
    module: "roles",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Role updated successfully.",
    data: result
  });
});
var deleteRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.deleteRole(req.params.id);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "ROLE_DELETED",
    module: "roles",
    targetId: req.params.id,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var assignPermissionsToRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.assignPermissionsToRole(req.params.id, req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "PERMISSIONS_ASSIGNED_TO_ROLE",
    module: "roles",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Permissions assigned to role successfully.",
    data: result
  });
});
var removePermissionsFromRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.removePermissionsFromRole(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Permissions removed from role successfully.",
    data: result
  });
});
var RoleController = {
  createRole: createRole2,
  getAllRoles: getAllRoles2,
  getRoleById: getRoleById2,
  updateRole: updateRole2,
  deleteRole: deleteRole2,
  assignPermissionsToRole: assignPermissionsToRole2,
  removePermissionsFromRole: removePermissionsFromRole2
};

// src/modules/role/role.validation.ts
import z3 from "zod";
var createRoleZodSchema = z3.object({
  name: z3.string().min(2, "Role name must be at least 2 characters").max(50, "Role name must be at most 50 characters"),
  description: z3.string().optional()
});
var updateRoleZodSchema = z3.object({
  name: z3.string().min(2).max(50).optional(),
  description: z3.string().optional(),
  isActive: z3.boolean().optional()
});
var assignPermissionsZodSchema = z3.object({
  permissionIds: z3.array(z3.string())
});

// src/modules/role/role.route.ts
var router3 = Router3();
router3.post(
  "/",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createRoleZodSchema),
  RoleController.createRole
);
router3.get(
  "/",
  checkAuth({ permissions: [{ module: "roles", action: "READ" }] }),
  RoleController.getAllRoles
);
router3.get(
  "/:id",
  checkAuth({ permissions: [{ module: "roles", action: "READ" }] }),
  RoleController.getRoleById
);
router3.patch(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updateRoleZodSchema),
  RoleController.updateRole
);
router3.delete(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  RoleController.deleteRole
);
router3.post(
  "/:id/permissions",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignPermissionsZodSchema),
  RoleController.assignPermissionsToRole
);
router3.delete(
  "/:id/permissions",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignPermissionsZodSchema),
  RoleController.removePermissionsFromRole
);
var RoleRoutes = router3;

// src/modules/permission/permission.route.ts
import { Router as Router4 } from "express";

// src/modules/permission/permission.controller.ts
import status10 from "http-status";

// src/modules/permission/permission.service.ts
import status9 from "http-status";
var permissionInclude = {
  module: true
};
var createPermission = async (payload) => {
  const module = await prisma.systemModule.findUnique({ where: { id: payload.moduleId } });
  if (!module) {
    throw new AppError_default(status9.NOT_FOUND, "System module not found.");
  }
  const existing = await prisma.permission.findUnique({
    where: { action_moduleId: { action: payload.action, moduleId: payload.moduleId } }
  });
  if (existing) {
    throw new AppError_default(
      status9.CONFLICT,
      `Permission "${payload.action}" for module "${module.name}" already exists.`
    );
  }
  const permission = await prisma.permission.create({
    data: payload,
    include: permissionInclude
  });
  return permission;
};
var getAllPermissions = async (query) => {
  const result = await new QueryBuilder(
    prisma.permission,
    query,
    {
      filterableFields: ["action", "moduleId", "name", "slug"]
    }
  ).filter().sort().paginate().include(permissionInclude).execute();
  return result;
};
var getPermissionById = async (id) => {
  const permission = await prisma.permission.findUnique({
    where: { id },
    include: permissionInclude
  });
  if (!permission) {
    throw new AppError_default(status9.NOT_FOUND, "Permission not found.");
  }
  return permission;
};
var updatePermission = async (id, payload) => {
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) {
    throw new AppError_default(status9.NOT_FOUND, "Permission not found.");
  }
  if (payload.moduleId) {
    const module = await prisma.systemModule.findUnique({ where: { id: payload.moduleId } });
    if (!module) {
      throw new AppError_default(status9.NOT_FOUND, "System module not found.");
    }
  }
  const updated = await prisma.permission.update({
    where: { id },
    data: payload,
    include: permissionInclude
  });
  return updated;
};
var deletePermission = async (id) => {
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) {
    throw new AppError_default(status9.NOT_FOUND, "Permission not found.");
  }
  await prisma.permission.delete({ where: { id } });
  return { message: "Permission deleted successfully." };
};
var PermissionService = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission
};

// src/modules/permission/permission.controller.ts
var createPermission2 = catchAsync(async (req, res) => {
  const result = await PermissionService.createPermission(req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.userId,
    action: "PERMISSION_CREATED",
    module: "permissions",
    targetId: result.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status10.CREATED,
    success: true,
    message: "Permission created successfully.",
    data: result
  });
});
var getAllPermissions2 = catchAsync(async (req, res) => {
  const result = await PermissionService.getAllPermissions(req.query);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Permissions retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getPermissionById2 = catchAsync(async (req, res) => {
  const result = await PermissionService.getPermissionById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Permission retrieved successfully.",
    data: result
  });
});
var updatePermission2 = catchAsync(async (req, res) => {
  const result = await PermissionService.updatePermission(req.params.id, req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.userId,
    action: "PERMISSION_UPDATED",
    module: "permissions",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Permission updated successfully.",
    data: result
  });
});
var deletePermission2 = catchAsync(async (req, res) => {
  const result = await PermissionService.deletePermission(req.params.id);
  await AuditLogService.createAuditLog({
    userId: req.user.userId,
    action: "PERMISSION_DELETED",
    module: "permissions",
    targetId: req.params.id,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var PermissionController = {
  createPermission: createPermission2,
  getAllPermissions: getAllPermissions2,
  getPermissionById: getPermissionById2,
  updatePermission: updatePermission2,
  deletePermission: deletePermission2
};

// src/modules/permission/permission.validation.ts
import z4 from "zod";
var createPermissionZodSchema = z4.object({
  action: z4.string().min(1, "Action is required"),
  name: z4.string().min(1, "Name is required"),
  slug: z4.string().min(1, "Slug is required"),
  moduleId: z4.string().min(1, "Module ID is required")
});
var updatePermissionZodSchema = z4.object({
  action: z4.string().optional(),
  name: z4.string().optional(),
  slug: z4.string().optional(),
  moduleId: z4.string().optional()
});

// src/modules/permission/permission.route.ts
var router4 = Router4();
router4.post(
  "/",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createPermissionZodSchema),
  PermissionController.createPermission
);
router4.get(
  "/",
  checkAuth({ permissions: [{ module: "permissions", action: "READ" }] }),
  PermissionController.getAllPermissions
);
router4.get(
  "/:id",
  checkAuth({ permissions: [{ module: "permissions", action: "READ" }] }),
  PermissionController.getPermissionById
);
router4.patch(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updatePermissionZodSchema),
  PermissionController.updatePermission
);
router4.delete(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  PermissionController.deletePermission
);
var PermissionRoutes = router4;

// src/modules/systemModule/systemModule.route.ts
import { Router as Router5 } from "express";

// src/modules/systemModule/systemModule.controller.ts
import status12 from "http-status";

// src/modules/systemModule/systemModule.service.ts
import status11 from "http-status";
var createSystemModule = async (payload) => {
  const existingName = await prisma.systemModule.findUnique({ where: { name: payload.name } });
  if (existingName) {
    throw new AppError_default(status11.CONFLICT, `Module with name "${payload.name}" already exists.`);
  }
  const existingSlug = await prisma.systemModule.findUnique({ where: { slug: payload.slug } });
  if (existingSlug) {
    throw new AppError_default(status11.CONFLICT, `Module with slug "${payload.slug}" already exists.`);
  }
  const module = await prisma.systemModule.create({
    data: payload,
    include: { permissions: true }
  });
  return module;
};
var getAllSystemModules = async (query) => {
  const result = await new QueryBuilder(
    prisma.systemModule,
    query,
    { searchableFields: ["name", "description"], filterableFields: ["isActive"] }
  ).search().filter().sort().paginate().include({ permissions: { include: { module: true } } }).execute();
  return result;
};
var getSystemModuleById = async (id) => {
  const module = await prisma.systemModule.findUnique({
    where: { id },
    include: { permissions: true }
  });
  if (!module) {
    throw new AppError_default(status11.NOT_FOUND, "System module not found.");
  }
  return module;
};
var updateSystemModule = async (id, payload) => {
  const module = await prisma.systemModule.findUnique({ where: { id } });
  if (!module) {
    throw new AppError_default(status11.NOT_FOUND, "System module not found.");
  }
  if (payload.name && payload.name !== module.name) {
    const duplicate = await prisma.systemModule.findFirst({
      where: { name: payload.name, id: { not: id } }
    });
    if (duplicate) {
      throw new AppError_default(status11.CONFLICT, `Module with name "${payload.name}" already exists.`);
    }
  }
  if (payload.slug && payload.slug !== module.slug) {
    const duplicate = await prisma.systemModule.findFirst({
      where: { slug: payload.slug, id: { not: id } }
    });
    if (duplicate) {
      throw new AppError_default(status11.CONFLICT, `Module with slug "${payload.slug}" already exists.`);
    }
  }
  const updated = await prisma.systemModule.update({
    where: { id },
    data: payload,
    include: { permissions: true }
  });
  return updated;
};
var deleteSystemModule = async (id) => {
  const module = await prisma.systemModule.findUnique({ where: { id } });
  if (!module) {
    throw new AppError_default(status11.NOT_FOUND, "System module not found.");
  }
  await prisma.systemModule.delete({ where: { id } });
  return { message: "System module deleted successfully." };
};
var SystemModuleService = {
  createSystemModule,
  getAllSystemModules,
  getSystemModuleById,
  updateSystemModule,
  deleteSystemModule
};

// src/modules/systemModule/systemModule.controller.ts
var createSystemModule2 = catchAsync(async (req, res) => {
  const result = await SystemModuleService.createSystemModule(req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "MODULE_CREATED",
    module: "modules",
    targetId: result.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "System module created successfully.",
    data: result
  });
});
var getAllSystemModules2 = catchAsync(async (req, res) => {
  const result = await SystemModuleService.getAllSystemModules(req.query);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "System modules retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getSystemModuleById2 = catchAsync(async (req, res) => {
  const result = await SystemModuleService.getSystemModuleById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "System module retrieved successfully.",
    data: result
  });
});
var updateSystemModule2 = catchAsync(async (req, res) => {
  const result = await SystemModuleService.updateSystemModule(req.params.id, req.body);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "MODULE_UPDATED",
    module: "modules",
    targetId: req.params.id,
    newData: req.body,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "System module updated successfully.",
    data: result
  });
});
var deleteSystemModule2 = catchAsync(async (req, res) => {
  const result = await SystemModuleService.deleteSystemModule(req.params.id);
  await AuditLogService.createAuditLog({
    userId: req.user.id,
    action: "MODULE_DELETED",
    module: "modules",
    targetId: req.params.id,
    ipAddress: req.ip
  });
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var SystemModuleController = {
  createSystemModule: createSystemModule2,
  getAllSystemModules: getAllSystemModules2,
  getSystemModuleById: getSystemModuleById2,
  updateSystemModule: updateSystemModule2,
  deleteSystemModule: deleteSystemModule2
};

// src/modules/systemModule/systemModule.validation.ts
import z5 from "zod";
var createSystemModuleZodSchema = z5.object({
  name: z5.string().min(2, "Module name must be at least 2 characters").max(50, "Module name must be at most 50 characters"),
  slug: z5.string().min(2).max(50).toLowerCase(),
  description: z5.string().optional()
});
var updateSystemModuleZodSchema = z5.object({
  name: z5.string().min(2).max(50).optional(),
  slug: z5.string().min(2).max(50).toLowerCase().optional(),
  description: z5.string().optional(),
  isActive: z5.boolean().optional()
});

// src/modules/systemModule/systemModule.route.ts
var router5 = Router5();
router5.post(
  "/",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createSystemModuleZodSchema),
  SystemModuleController.createSystemModule
);
router5.get(
  "/",
  checkAuth({ permissions: [{ module: "modules", action: "READ" }] }),
  SystemModuleController.getAllSystemModules
);
router5.get(
  "/:id",
  checkAuth({ permissions: [{ module: "modules", action: "READ" }] }),
  SystemModuleController.getSystemModuleById
);
router5.patch(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updateSystemModuleZodSchema),
  SystemModuleController.updateSystemModule
);
router5.delete(
  "/:id",
  checkAuth({ requireSuperAdmin: true }),
  SystemModuleController.deleteSystemModule
);
var SystemModuleRoutes = router5;

// src/modules/auditLog/auditLog.route.ts
import { Router as Router6 } from "express";

// src/modules/auditLog/auditLog.controller.ts
import status13 from "http-status";
var getAllAuditLogs2 = catchAsync(async (req, res) => {
  const result = await AuditLogService.getAllAuditLogs(req.query);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Audit logs retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getAuditLogById2 = catchAsync(async (req, res) => {
  const result = await AuditLogService.getAuditLogById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Audit log retrieved successfully.",
    data: result
  });
});
var AuditLogController = {
  getAllAuditLogs: getAllAuditLogs2,
  getAuditLogById: getAuditLogById2
};

// src/modules/auditLog/auditLog.route.ts
var router6 = Router6();
router6.get(
  "/",
  checkAuth({
    permissions: [
      { module: "audit-logs", action: "READ" },
      { module: "dashboard", action: "READ" }
    ],
    permissionMode: "ANY"
  }),
  AuditLogController.getAllAuditLogs
);
router6.get(
  "/:id",
  checkAuth({ permissions: [{ module: "audit-logs", action: "READ" }] }),
  AuditLogController.getAuditLogById
);
var AuditLogRoutes = router6;

// src/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/modules/admin/admin.controller.ts
import status14 from "http-status";

// src/modules/admin/admin.service.ts
var getDashboardStats = async () => {
  const [userCount, roleCount, moduleCount, recentLogs] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.role.count({ where: { isActive: true } }),
    prisma.systemModule.count({ where: { isActive: true } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  ]);
  const usersByStatus = await prisma.user.groupBy({
    by: ["status"],
    _count: true
  });
  return {
    overview: {
      users: userCount,
      roles: roleCount,
      modules: moduleCount
    },
    usersByStatus,
    recentActivity: recentLogs
  };
};
var AdminService = {
  getDashboardStats
};

// src/modules/admin/admin.controller.ts
var getDashboardStats2 = catchAsync(async (req, res) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully.",
    data: result
  });
});
var AdminController = {
  getDashboardStats: getDashboardStats2
};

// src/modules/admin/admin.route.ts
var router7 = Router7();
router7.get(
  "/dashboard-stats",
  checkAuth({ requireSuperAdmin: true }),
  AdminController.getDashboardStats
);
var AdminRoutes = router7;

// src/modules/permission/userPermission.route.ts
import { Router as Router8 } from "express";

// src/modules/permission/userPermission.controller.ts
import status16 from "http-status";

// src/modules/permission/userPermission.service.ts
import status15 from "http-status";
var getEffectivePermissions = async (userId) => {
  const userWithRoles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: { include: { module: true } }
                }
              }
            }
          }
        }
      }
    }
  });
  if (!userWithRoles) return [];
  const effectivePermissions = /* @__PURE__ */ new Map();
  userWithRoles.userRoles.forEach((ur) => {
    ur.role.rolePermissions.forEach((rp) => {
      const p = rp.permission;
      const key = `${p.module.slug}.${p.action}`;
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug
      });
    });
  });
  const userOverrides = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: { include: { module: true } } }
  });
  userOverrides.forEach((override) => {
    const p = override.permission;
    const key = `${p.module.slug}.${p.action}`;
    if (override.granted) {
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug
      });
    } else {
      effectivePermissions.delete(key);
    }
  });
  return Array.from(effectivePermissions.values());
};
var grantPermission = async (granterId, targetUserId, permissionId) => {
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AppError_default(status15.NOT_FOUND, "Target user not found.");
  }
  const permission = await prisma.permission.findUnique({
    where: { id: permissionId },
    include: { module: true }
  });
  if (!permission) {
    throw new AppError_default(status15.NOT_FOUND, "Permission not found.");
  }
  const granter = await prisma.user.findUnique({ where: { id: granterId } });
  if (!granter?.isSuperAdmin) {
    const granterPermissions = await getEffectivePermissions(granterId);
    const granterKey = `${permission.module.name}.${permission.action}`;
    const hasPermission = granterPermissions.some(
      (p) => `${p.moduleName}.${p.action}` === granterKey
    );
    if (!hasPermission) {
      throw new AppError_default(
        status15.FORBIDDEN,
        "You cannot grant a permission you do not have yourself."
      );
    }
  }
  const userPermission = await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId: targetUserId, permissionId } },
    update: { granted: true, grantedBy: granterId },
    create: { userId: targetUserId, permissionId, granted: true, grantedBy: granterId }
  });
  return userPermission;
};
var revokePermission = async (granterId, targetUserId, permissionId) => {
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AppError_default(status15.NOT_FOUND, "Target user not found.");
  }
  const permission = await prisma.permission.findUnique({
    where: { id: permissionId },
    include: { module: true }
  });
  if (!permission) {
    throw new AppError_default(status15.NOT_FOUND, "Permission not found.");
  }
  const granter = await prisma.user.findUnique({ where: { id: granterId } });
  if (!granter?.isSuperAdmin) {
    const granterPermissions = await getEffectivePermissions(granterId);
    const granterKey = `${permission.module.name}.${permission.action}`;
    const hasPermission = granterPermissions.some(
      (p) => `${p.moduleName}.${p.action}` === granterKey
    );
    if (!hasPermission) {
      throw new AppError_default(
        status15.FORBIDDEN,
        "You cannot revoke a permission you do not have yourself."
      );
    }
  }
  const userPermission = await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId: targetUserId, permissionId } },
    update: { granted: false, grantedBy: granterId },
    create: { userId: targetUserId, permissionId, granted: false, grantedBy: granterId }
  });
  return userPermission;
};
var getUserPermissions = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(status15.NOT_FOUND, "User not found.");
  }
  const userPermissions = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: { include: { module: true } } }
  });
  return userPermissions;
};
var UserPermissionService = {
  getEffectivePermissions,
  grantPermission,
  revokePermission,
  getUserPermissions
};

// src/modules/permission/userPermission.controller.ts
var grantPermission2 = catchAsync(async (req, res) => {
  const granterId = req.user.id;
  const targetUserId = req.params.userId;
  const { permissionId } = req.body;
  const result = await UserPermissionService.grantPermission(granterId, targetUserId, permissionId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Permission granted successfully.",
    data: result
  });
});
var revokePermission2 = catchAsync(async (req, res) => {
  const granterId = req.user.id;
  const targetUserId = req.params.userId;
  const { permissionId } = req.body;
  const result = await UserPermissionService.revokePermission(granterId, targetUserId, permissionId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Permission revoked successfully.",
    data: result
  });
});
var getUserPermissions2 = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserPermissionService.getUserPermissions(userId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "User permissions fetched successfully.",
    data: result
  });
});
var getEffectivePermissions2 = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserPermissionService.getEffectivePermissions(userId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Effective permissions fetched successfully.",
    data: result
  });
});
var UserPermissionController = {
  grantPermission: grantPermission2,
  revokePermission: revokePermission2,
  getUserPermissions: getUserPermissions2,
  getEffectivePermissions: getEffectivePermissions2
};

// src/modules/permission/userPermission.route.ts
var router8 = Router8();
router8.get(
  "/:userId",
  checkAuth({ permissions: [{ module: "users", action: "READ" }] }),
  UserPermissionController.getUserPermissions
);
router8.get(
  "/:userId/effective",
  checkAuth({ permissions: [{ module: "users", action: "READ" }] }),
  UserPermissionController.getEffectivePermissions
);
router8.post(
  "/:userId/grant",
  checkAuth({ permissions: [{ module: "users", action: "MANAGE" }] }),
  UserPermissionController.grantPermission
);
router8.post(
  "/:userId/revoke",
  checkAuth({ permissions: [{ module: "users", action: "MANAGE" }] }),
  UserPermissionController.revokePermission
);
var UserPermissionRoutes = router8;

// src/modules/lead/lead.route.ts
import express from "express";

// src/modules/lead/lead.controller.ts
import status18 from "http-status";

// src/modules/lead/lead.service.ts
import status17 from "http-status";
var createLead = async (payload) => {
  const result = await prisma.lead.create({
    data: payload
  });
  return result;
};
var getAllLeads = async (query) => {
  const result = await new QueryBuilder(
    prisma.lead,
    query,
    {
      searchableFields: ["name", "email", "company", "phone"],
      filterableFields: ["status", "source"]
    }
  ).search().filter().sort().paginate().include({ assignee: { select: { id: true, name: true, email: true } } }).execute();
  result.data = result.data.map((lead) => ({
    ...lead,
    assignedToUser: lead.assignee || null
  }));
  return result;
};
var getLeadById = async (id) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { assignee: { select: { id: true, name: true, email: true } } }
  });
  if (!lead) {
    throw new AppError_default(status17.NOT_FOUND, "Lead not found.");
  }
  return {
    ...lead,
    assignedToUser: lead.assignee || null
  };
};
var updateLead = async (id, payload) => {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new AppError_default(status17.NOT_FOUND, "Lead not found.");
  }
  const updated = await prisma.lead.update({
    where: { id },
    data: payload
  });
  return updated;
};
var deleteLead = async (id) => {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new AppError_default(status17.NOT_FOUND, "Lead not found.");
  }
  const deleted = await prisma.lead.delete({
    where: { id }
  });
  return deleted;
};
var LeadService = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
};

// src/modules/lead/lead.controller.ts
var createLead2 = catchAsync(async (req, res) => {
  const result = await LeadService.createLead(req.body);
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: "Lead created successfully.",
    data: result
  });
});
var getAllLeads2 = catchAsync(async (req, res) => {
  const result = await LeadService.getAllLeads(req.query);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Leads retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getLeadById2 = catchAsync(async (req, res) => {
  const result = await LeadService.getLeadById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Lead retrieved successfully.",
    data: result
  });
});
var updateLead2 = catchAsync(async (req, res) => {
  const result = await LeadService.updateLead(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Lead updated successfully.",
    data: result
  });
});
var deleteLead2 = catchAsync(async (req, res) => {
  const result = await LeadService.deleteLead(req.params.id);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Lead deleted successfully.",
    data: result
  });
});
var LeadController = {
  createLead: createLead2,
  getAllLeads: getAllLeads2,
  getLeadById: getLeadById2,
  updateLead: updateLead2,
  deleteLead: deleteLead2
};

// src/modules/lead/lead.validation.ts
import { z as z6 } from "zod";
var createLeadSchema = z6.object({
  name: z6.string({ message: "Name is required" }),
  email: z6.string({ message: "Email is required" }).email(),
  phone: z6.string().optional(),
  company: z6.string().optional(),
  status: z6.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST", "WON"]).optional(),
  source: z6.string().optional(),
  assignedTo: z6.preprocess((val) => val === "" ? null : val, z6.string().cuid().optional().nullable())
});
var updateLeadSchema = z6.object({
  name: z6.string().optional(),
  email: z6.string().email().optional(),
  phone: z6.string().optional(),
  company: z6.string().optional(),
  status: z6.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST", "WON"]).optional(),
  source: z6.string().optional(),
  assignedTo: z6.preprocess((val) => val === "" ? null : val, z6.string().cuid().optional().nullable())
});
var LeadValidation = {
  createLeadSchema,
  updateLeadSchema
};

// src/modules/lead/lead.route.ts
var router9 = express.Router();
router9.post(
  "/",
  checkAuth({ permissions: [{ module: "leads", action: "WRITE" }] }),
  validateRequest(LeadValidation.createLeadSchema),
  LeadController.createLead
);
router9.get(
  "/",
  checkAuth({ permissions: [{ module: "leads", action: "READ" }] }),
  LeadController.getAllLeads
);
router9.get(
  "/:id",
  checkAuth({ permissions: [{ module: "leads", action: "READ" }] }),
  LeadController.getLeadById
);
router9.patch(
  "/:id",
  checkAuth({ permissions: [{ module: "leads", action: "UPDATE" }] }),
  validateRequest(LeadValidation.updateLeadSchema),
  LeadController.updateLead
);
router9.delete(
  "/:id",
  checkAuth({ permissions: [{ module: "leads", action: "DELETE" }] }),
  LeadController.deleteLead
);
var LeadRoutes = router9;

// src/modules/task/task.route.ts
import express2 from "express";

// src/modules/task/task.controller.ts
import status20 from "http-status";

// src/modules/task/task.service.ts
import status19 from "http-status";
var createTask = async (payload, user) => {
  const result = await prisma.task.create({
    data: {
      ...payload,
      createdBy: user.id
    }
  });
  return result;
};
var getAllTasks = async (query) => {
  const result = await new QueryBuilder(
    prisma.task,
    query,
    {
      searchableFields: ["title", "description"],
      filterableFields: ["status"]
    }
  ).search().filter().sort().paginate().include({ assignee: { select: { id: true, name: true, email: true } } }).execute();
  result.data = result.data.map((task) => ({
    ...task,
    assignedToUser: task.assignee || null
  }));
  return result;
};
var getTaskById = async (id) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { assignee: { select: { id: true, name: true, email: true } }, creator: { select: { id: true, name: true, email: true } } }
  });
  if (!task) {
    throw new AppError_default(status19.NOT_FOUND, "Task not found.");
  }
  return {
    ...task,
    assignedToUser: task.assignee || null
  };
};
var updateTask = async (id, payload) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError_default(status19.NOT_FOUND, "Task not found.");
  }
  const updated = await prisma.task.update({
    where: { id },
    data: payload
  });
  return updated;
};
var deleteTask = async (id) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError_default(status19.NOT_FOUND, "Task not found.");
  }
  const deleted = await prisma.task.delete({
    where: { id }
  });
  return deleted;
};
var TaskService = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};

// src/modules/task/task.controller.ts
var createTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(req.body, req.user);
  sendResponse(res, {
    httpStatusCode: status20.CREATED,
    success: true,
    message: "Task created successfully.",
    data: result
  });
});
var getAllTasks2 = catchAsync(async (req, res) => {
  const result = await TaskService.getAllTasks(req.query);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Tasks retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getTaskById2 = catchAsync(async (req, res) => {
  const result = await TaskService.getTaskById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Task retrieved successfully.",
    data: result
  });
});
var updateTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.updateTask(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Task updated successfully.",
    data: result
  });
});
var deleteTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.deleteTask(req.params.id);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Task deleted successfully.",
    data: result
  });
});
var TaskController = {
  createTask: createTask2,
  getAllTasks: getAllTasks2,
  getTaskById: getTaskById2,
  updateTask: updateTask2,
  deleteTask: deleteTask2
};

// src/modules/task/task.validation.ts
import { z as z7 } from "zod";
var createTaskSchema = z7.object({
  title: z7.string({ message: "Title is required" }),
  description: z7.string().optional(),
  status: z7.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  dueDate: z7.preprocess((val) => val === "" ? null : val ? new Date(val) : val, z7.date().optional().nullable()),
  assignedTo: z7.preprocess((val) => val === "" ? null : val, z7.string().cuid().optional().nullable())
});
var updateTaskSchema = z7.object({
  title: z7.string().optional(),
  description: z7.string().optional(),
  status: z7.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  dueDate: z7.preprocess((val) => val === "" ? null : val ? new Date(val) : val, z7.date().optional().nullable()),
  assignedTo: z7.preprocess((val) => val === "" ? null : val, z7.string().cuid().optional().nullable())
});
var TaskValidation = {
  createTaskSchema,
  updateTaskSchema
};

// src/modules/task/task.route.ts
var router10 = express2.Router();
router10.post(
  "/",
  checkAuth({ permissions: [{ module: "tasks", action: "WRITE" }] }),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask
);
router10.get(
  "/",
  checkAuth({ permissions: [{ module: "tasks", action: "READ" }] }),
  TaskController.getAllTasks
);
router10.get(
  "/:id",
  checkAuth({ permissions: [{ module: "tasks", action: "READ" }] }),
  TaskController.getTaskById
);
router10.patch(
  "/:id",
  checkAuth({ permissions: [{ module: "tasks", action: "UPDATE" }] }),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask
);
router10.delete(
  "/:id",
  checkAuth({ permissions: [{ module: "tasks", action: "DELETE" }] }),
  TaskController.deleteTask
);
var TaskRoutes = router10;

// src/modules/setting/setting.route.ts
import express3 from "express";

// src/modules/setting/setting.controller.ts
import status22 from "http-status";

// src/modules/setting/setting.service.ts
import status21 from "http-status";
var createSetting = async (payload, user) => {
  const existing = await prisma.systemSetting.findUnique({ where: { key: payload.key } });
  if (existing) {
    throw new AppError_default(status21.CONFLICT, "System setting with this key already exists.");
  }
  const result = await prisma.systemSetting.create({
    data: {
      ...payload,
      updatedBy: user.id
    }
  });
  return result;
};
var getAllSettings = async (query) => {
  const result = await new QueryBuilder(
    prisma.systemSetting,
    query,
    {
      searchableFields: ["key", "value", "description"],
      filterableFields: []
    }
  ).search().filter().sort().paginate().execute();
  return result;
};
var getSettingByKey = async (key) => {
  const setting = await prisma.systemSetting.findUnique({
    where: { key },
    include: { updater: { select: { id: true, name: true, email: true } } }
  });
  if (!setting) {
    throw new AppError_default(status21.NOT_FOUND, "System setting not found.");
  }
  return setting;
};
var updateSetting = async (idOrKey, payload, user) => {
  const setting = await prisma.systemSetting.findFirst({
    where: {
      OR: [{ key: idOrKey }, { id: idOrKey }]
    }
  });
  if (!setting) {
    throw new AppError_default(status21.NOT_FOUND, "System setting not found.");
  }
  const updated = await prisma.systemSetting.update({
    where: { id: setting.id },
    data: {
      ...payload,
      updatedBy: user.id
    }
  });
  return updated;
};
var deleteSetting = async (idOrKey) => {
  const setting = await prisma.systemSetting.findFirst({
    where: {
      OR: [{ key: idOrKey }, { id: idOrKey }]
    }
  });
  if (!setting) {
    throw new AppError_default(status21.NOT_FOUND, "System setting not found.");
  }
  const deleted = await prisma.systemSetting.delete({
    where: { id: setting.id }
  });
  return deleted;
};
var getPublicSettings = async () => {
  const publicKeys = ["site_name", "allow_registration", "maintenance_mode"];
  const settings = await prisma.systemSetting.findMany({
    where: { key: { in: publicKeys } }
  });
  const result = {};
  settings.forEach((s) => {
    result[s.key] = s.value;
  });
  return result;
};
var SystemSettingService = {
  createSetting,
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  getPublicSettings
};

// src/modules/setting/setting.controller.ts
var createSetting2 = catchAsync(async (req, res) => {
  const result = await SystemSettingService.createSetting(req.body, req.user);
  sendResponse(res, {
    httpStatusCode: status22.CREATED,
    success: true,
    message: "System setting created successfully.",
    data: result
  });
});
var getAllSettings2 = catchAsync(async (req, res) => {
  const result = await SystemSettingService.getAllSettings(req.query);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "System settings retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var getSettingByKey2 = catchAsync(async (req, res) => {
  const result = await SystemSettingService.getSettingByKey(req.params.key);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "System setting retrieved successfully.",
    data: result
  });
});
var updateSetting2 = catchAsync(async (req, res) => {
  const result = await SystemSettingService.updateSetting(req.params.key, req.body, req.user);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "System setting updated successfully.",
    data: result
  });
});
var deleteSetting2 = catchAsync(async (req, res) => {
  const result = await SystemSettingService.deleteSetting(req.params.key);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "System setting deleted successfully.",
    data: result
  });
});
var getPublicSettings2 = catchAsync(async (req, res) => {
  const result = await SystemSettingService.getPublicSettings();
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Public settings retrieved successfully.",
    data: result
  });
});
var SystemSettingController = {
  createSetting: createSetting2,
  getAllSettings: getAllSettings2,
  getSettingByKey: getSettingByKey2,
  updateSetting: updateSetting2,
  deleteSetting: deleteSetting2,
  getPublicSettings: getPublicSettings2
};

// src/modules/setting/setting.validation.ts
import { z as z8 } from "zod";
var createSystemSettingSchema = z8.object({
  key: z8.string({ message: "Key is required" }),
  value: z8.string({ message: "Value is required" }),
  description: z8.string().optional()
});
var updateSystemSettingSchema = z8.object({
  value: z8.string().optional(),
  description: z8.string().optional()
});
var SystemSettingValidation = {
  createSystemSettingSchema,
  updateSystemSettingSchema
};

// src/modules/setting/setting.route.ts
var router11 = express3.Router();
router11.get("/public", SystemSettingController.getPublicSettings);
router11.post(
  "/",
  checkAuth({ requireSuperAdmin: true }),
  // Only super admins can create settings
  validateRequest(SystemSettingValidation.createSystemSettingSchema),
  SystemSettingController.createSetting
);
router11.get(
  "/",
  checkAuth({ permissions: [{ module: "settings", action: "READ" }] }),
  SystemSettingController.getAllSettings
);
router11.get(
  "/:key",
  checkAuth({ permissions: [{ module: "settings", action: "READ" }] }),
  SystemSettingController.getSettingByKey
);
router11.patch(
  "/:key",
  checkAuth({ permissions: [{ module: "settings", action: "UPDATE" }] }),
  validateRequest(SystemSettingValidation.updateSystemSettingSchema),
  SystemSettingController.updateSetting
);
router11.delete(
  "/:key",
  checkAuth({ requireSuperAdmin: true }),
  // Only super admins can delete settings
  SystemSettingController.deleteSetting
);
var SystemSettingRoutes = router11;

// src/modules/report/report.route.ts
import express4 from "express";

// src/modules/report/report.controller.ts
import status23 from "http-status";

// src/modules/report/report.service.ts
var getDashboardStats3 = async (userId, isSuperAdmin) => {
  const [
    totalUsers,
    totalLeads,
    totalTasks,
    activeRoles,
    completedTasks,
    contactedLeads
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.lead.count({
      where: !isSuperAdmin && userId ? { assignedTo: userId } : {}
    }),
    prisma.task.count({
      where: !isSuperAdmin && userId ? { assignedTo: userId } : {}
    }),
    prisma.role.count({ where: { isActive: true } }),
    prisma.task.count({ where: { assignedTo: userId, status: "DONE" } }),
    prisma.lead.count({ where: { assignedTo: userId, status: "CONTACTED" } })
  ]);
  return {
    totalUsers: isSuperAdmin ? totalUsers : void 0,
    totalLeads,
    totalTasks,
    activeRoles: isSuperAdmin ? activeRoles : void 0,
    completedTasks,
    contactedLeads
  };
};
var ReportService = {
  getDashboardStats: getDashboardStats3
};

// src/modules/report/report.controller.ts
var getDashboardStats4 = catchAsync(async (req, res) => {
  const { id, isSuperAdmin } = req.user;
  const result = await ReportService.getDashboardStats(id, isSuperAdmin);
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Dashboard stats retrieved successfully.",
    data: result
  });
});
var ReportController = {
  getDashboardStats: getDashboardStats4
};

// src/modules/report/report.route.ts
var router12 = express4.Router();
router12.get(
  "/dashboard-stats",
  checkAuth({
    permissions: [
      { module: "reports", action: "READ" },
      { module: "dashboard", action: "READ" }
    ],
    permissionMode: "ANY"
  }),
  ReportController.getDashboardStats
);
var ReportRoutes = router12;

// src/routes/index.ts
var router13 = Router9();
var moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/users",
    route: UserRoutes
  },
  {
    path: "/roles",
    route: RoleRoutes
  },
  {
    path: "/permissions",
    route: PermissionRoutes
  },
  {
    path: "/modules",
    route: SystemModuleRoutes
  },
  {
    path: "/audit-logs",
    route: AuditLogRoutes
  },
  {
    path: "/admin",
    route: AdminRoutes
  },
  {
    path: "/user-permissions",
    route: UserPermissionRoutes
  },
  {
    path: "/leads",
    route: LeadRoutes
  },
  {
    path: "/tasks",
    route: TaskRoutes
  },
  {
    path: "/settings",
    route: SystemSettingRoutes
  },
  {
    path: "/reports",
    route: ReportRoutes
  }
];
moduleRoutes.forEach((route) => router13.use(route.path, route.route));
var routes_default = router13;

// src/middlewares/globalErrorHandler.ts
import status26 from "http-status";
import z9 from "zod";

// src/errors/handlePrismaErrors.ts
import status24 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") return status24.CONFLICT;
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode))
    return status24.NOT_FOUND;
  if (["P1000", "P6002"].includes(errorCode)) return status24.UNAUTHORIZED;
  if (["P1010", "P6010"].includes(errorCode)) return status24.FORBIDDEN;
  if (errorCode === "P6003") return status24.PAYMENT_REQUIRED;
  if (["P1008", "P2004", "P6004"].includes(errorCode))
    return status24.GATEWAY_TIMEOUT;
  if (errorCode === "P5011") return status24.TOO_MANY_REQUESTS;
  if (errorCode === "P6009") return 413;
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode))
    return status24.SERVICE_UNAVAILABLE;
  if (errorCode.startsWith("P2")) return status24.BAD_REQUEST;
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4"))
    return status24.INTERNAL_SERVER_ERROR;
  return status24.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) parts.push(`Field(s): ${String(meta.target)}`);
  if (meta.field_name) parts.push(`Field: ${String(meta.field_name)}`);
  if (meta.column_name) parts.push(`Column: ${String(meta.column_name)}`);
  if (meta.table) parts.push(`Table: ${String(meta.table)}`);
  if (meta.model_name) parts.push(`Model: ${String(meta.model_name)}`);
  if (meta.relation_name) parts.push(`Relation: ${String(meta.relation_name)}`);
  if (meta.constraint) parts.push(`Constraint: ${String(meta.constraint)}`);
  if (meta.database_error) parts.push(`Database Error: ${String(meta.database_error)}`);
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({ path: "cause", message: String(error.meta.cause) });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  return {
    success: false,
    statusCode: status24.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources: [{ path: "Unknown Prisma Error", message: mainMessage }]
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  return {
    success: false,
    statusCode: status24.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources: [{ path: fieldName, message: mainMessage }]
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status24.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources: [{ path: error.errorCode || "Initialization Error", message: mainMessage }]
  };
};
var handlerPrismaClientRustPanicError = () => {
  return {
    success: false,
    statusCode: status24.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources: [
      {
        path: "Rust Engine Crashed",
        message: "The database engine encountered a fatal error and crashed. Please check the Prisma logs for more details."
      }
    ]
  };
};

// src/errors/handleZodError.ts
import status25 from "http-status";
var handleZodError = (err) => {
  const statusCode = status25.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (config_default.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status26.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z9.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    statusCode = status26.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: config_default.NODE_ENV === "development" ? err : void 0,
    stack: config_default.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/middlewares/notFound.ts
import status27 from "http-status";
var notFound = (req, res, next) => {
  res.status(status27.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errorSources: [
      {
        path: req.originalUrl,
        message: `Route not found`
      }
    ]
  });
};

// src/app.ts
import morgan from "morgan";
import rateLimit2 from "express-rate-limit";

// src/middlewares/maintenanceMode.ts
import status28 from "http-status";
var checkMaintenanceMode = async (req, res, Next) => {
  if (req.originalUrl === "/api/v1/settings/public" || req.path === "/public") {
    return Next();
  }
  const maintenanceSetting = await prisma.systemSetting.findUnique({
    where: { key: "maintenance_mode" }
  });
  if (maintenanceSetting?.value === "true") {
    if (req.user?.isSuperAdmin) {
      return Next();
    }
    throw new AppError_default(
      status28.SERVICE_UNAVAILABLE,
      "System is under maintenance. Please try again later."
    );
  }
  Next();
};

// src/middlewares/apiRateLimiter.ts
import rateLimit from "express-rate-limit";
var cachedRateLimit = null;
var lastFetched = 0;
var CACHE_TTL = 5 * 60 * 1e3;
var getDynamicRateLimit = async () => {
  const now = Date.now();
  if (cachedRateLimit !== null && now - lastFetched < CACHE_TTL) {
    return cachedRateLimit;
  }
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "api_rate_limit" }
    });
    if (setting?.value) {
      cachedRateLimit = parseInt(setting.value, 10) || 1e3;
    } else {
      cachedRateLimit = 1e3;
    }
    lastFetched = now;
    return cachedRateLimit;
  } catch (error) {
    console.error("Failed to fetch api_rate_limit from DB:", error);
    return cachedRateLimit || 1e3;
  }
};
var apiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  limit: async () => {
    return await getDynamicRateLimit();
  },
  message: {
    success: false,
    message: "Too many requests, please try again after an hour"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Key by IP or User ID if available
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

// src/app.ts
var app = express5();
app.use(
  cors({
    origin: [config_default.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);
app.use(express5.json());
app.use(express5.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
var authLimiter = rateLimit2({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // Increased for development
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/v1/auth", authLimiter);
app.use(checkMaintenanceMode);
app.use("/api/v1", apiRateLimiter);
app.use("/api/v1", routes_default);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Dynamic RBAC Platform API"
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
