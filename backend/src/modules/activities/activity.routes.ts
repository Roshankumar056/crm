import { Router } from "express";
import { prisma } from "../../db/prisma";
import { authenticate } from "../../middlewares/auth";
import { ActivityType } from "@prisma/client";
import { io } from "../../server";
import { sendMail } from "../../utils/mailer";

const router = Router();
router.use(authenticate);

router.post("/", async (req, res) => {
  const { leadId, type, note } = req.body as { leadId: string; type: ActivityType; note?: string };
  const activity = await prisma.activity.create({
    data: { leadId, type, note, userId: req.user!.sub }
  });
  res.status(201).json({ activity });

  // Real-time: notify lead owner
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (lead?.ownerId) io.to(`user:${lead.ownerId}`).emit("activity:new", { activity, leadId });

  // Email: notify owner
  if (lead?.ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: lead.ownerId } });
    if (owner?.email) {
      sendMail(
        owner.email,
        "📝 New Lead Activity",
        `<p>New activity on <b>${lead.name}</b>: <b>${type}</b>${note ? ` — ${note}` : ""}</p>`
      );
    }
  }
});

router.get("/lead/:leadId", async (req, res) => {
  const { leadId } = req.params;
  const items = await prisma.activity.findMany({
    where: { leadId },
    orderBy: { at: "desc" },
    include: { user: { select: { id: true, name: true } } }
  });
  res.json({ activities: items });
});

export default router;
