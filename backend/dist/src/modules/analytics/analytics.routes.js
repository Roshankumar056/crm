import { Router } from "express";
import { prisma } from "../../db/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { Role } from "@prisma/client";
const router = Router();
router.use(authenticate, authorize(Role.ADMIN, Role.MANAGER));
router.get("/summary", async (_req, res) => {
    const [totalLeads, byStatus, byOwner] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
        prisma.lead.groupBy({ by: ["ownerId"], _count: { ownerId: true } }),
    ]);
    res.json({
        totalLeads,
        byStatus: byStatus.map(s => ({ status: s.status, count: s._count.status })),
        byOwner: await Promise.all(byOwner.map(async (o) => {
            const user = o.ownerId ? await prisma.user.findUnique({ where: { id: o.ownerId }, select: { id: true, name: true } }) : null;
            return { owner: user, count: o._count.ownerId };
        }))
    });
});
export default router;
