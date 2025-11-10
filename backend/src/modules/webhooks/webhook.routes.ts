import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/inbound", (req, res) => {
  res.status(202).json({ received: true, at: new Date().toISOString(), body: req.body });
});

router.get("/targets", authenticate, authorize(Role.ADMIN), (_req, res) => {
  res.json({ targets: [] });
});

export default router;
