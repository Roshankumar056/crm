import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import leadRoutes from "../modules/leads/lead.routes";
import activityRoutes from "../modules/activities/activity.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import webhookRoutes from "../modules/webhooks/webhook.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);
router.use("/activities", activityRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
