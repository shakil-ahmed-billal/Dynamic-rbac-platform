import { prisma } from "../../lib/prisma";

const getDashboardStats = async (userId?: string, isSuperAdmin?: boolean) => {
  const [
    totalUsers,
    totalLeads,
    totalTasks,
    activeRoles,
    completedTasks,
    contactedLeads,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.lead.count({
      where: !isSuperAdmin && userId ? { assignedTo: userId } : {},
    }),
    prisma.task.count({
      where: !isSuperAdmin && userId ? { assignedTo: userId } : {},
    }),
    prisma.role.count({ where: { isActive: true } }),
    prisma.task.count({ where: { assignedTo: userId, status: "DONE" } }),
    prisma.lead.count({ where: { assignedTo: userId, status: "CONTACTED" } }),
  ]);

  return {
    totalUsers: isSuperAdmin ? totalUsers : undefined,
    totalLeads,
    totalTasks,
    activeRoles: isSuperAdmin ? activeRoles : undefined,
    completedTasks,
    contactedLeads,
  };
};

export const ReportService = {
  getDashboardStats,
};
