import { prisma } from '../../lib/prisma';

const getDashboardStats = async () => {
  const [userCount, roleCount, moduleCount, recentLogs] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.role.count({ where: { isActive: true } }),
    prisma.systemModule.count({ where: { isActive: true } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
  ]);

  const usersByStatus = await prisma.user.groupBy({
    by: ['status'],
    _count: true,
  });

  return {
    overview: {
      users: userCount,
      roles: roleCount,
      modules: moduleCount,
    },
    usersByStatus,
    recentActivity: recentLogs,
  };
};

export const AdminService = {
  getDashboardStats,
};
