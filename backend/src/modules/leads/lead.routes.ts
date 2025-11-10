import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { listLeads, getLead, createLeadHandler, updateLeadHandler, assignOwnerHandler, deleteLead } from "./lead.controller";

const router = Router();

router.use(authenticate);

router.get("/", listLeads);
router.get("/:id", getLead);
router.post("/", authorize(Role.ADMIN, Role.MANAGER, Role.SALES), createLeadHandler);
router.patch("/:id", authorize(Role.ADMIN, Role.MANAGER, Role.SALES), updateLeadHandler);
router.post("/:id/assign", authorize(Role.ADMIN, Role.MANAGER), assignOwnerHandler);
router.delete("/:id", authorize(Role.ADMIN, Role.MANAGER), deleteLead);

export default router;
