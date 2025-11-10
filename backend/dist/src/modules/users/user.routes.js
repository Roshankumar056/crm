import { Router } from "express";
import { prisma } from "../../db/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { Role } from "@prisma/client";
const router = Router();
router.use(authenticate, authorize(Role.ADMIN, Role.MANAGER));
router.get("/", async (_req, res) => {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
    res.json({ users });
});
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body;
    const user = await prisma.user.update({ where: { id }, data: { name, role } });
    res.json({ user });
});
export default router;
