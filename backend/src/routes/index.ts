import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { RoleRoutes } from '../modules/role/role.route';
import { PermissionRoutes } from '../modules/permission/permission.route';
import { SystemModuleRoutes } from '../modules/systemModule/systemModule.route';
import { AuditLogRoutes } from '../modules/auditLog/auditLog.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { UserPermissionRoutes } from '../modules/permission/userPermission.route';
import { LeadRoutes } from '../modules/lead/lead.route';
import { TaskRoutes } from '../modules/task/task.route';
import { SystemSettingRoutes } from '../modules/setting/setting.route';
import { ReportRoutes } from '../modules/report/report.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/roles',
    route: RoleRoutes,
  },
  {
    path: '/permissions',
    route: PermissionRoutes,
  },
  {
    path: '/modules',
    route: SystemModuleRoutes,
  },
  {
    path: '/audit-logs',
    route: AuditLogRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/user-permissions',
    route: UserPermissionRoutes,
  },
  {
    path: '/leads',
    route: LeadRoutes,
  },
  {
    path: '/tasks',
    route: TaskRoutes,
  },
  {
    path: '/settings',
    route: SystemSettingRoutes,
  },
  {
    path: '/reports',
    route: ReportRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
