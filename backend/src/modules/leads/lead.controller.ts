import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { createLead, updateLead, assignOwner } from "./lead.service";
import { io } from "../../server";
import { sendMail } from "../../utils/mailer";
import { Role } from "@prisma/client";

export async function listLeads(_req: Request, res: Response) {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { id: true, name: true, email: true } } }
  });
  res.json({ leads });
}

export async function getLead(req: Request, res: Response) {
  const { id } = req.params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { owner: true, activities: { orderBy: { at: "desc" } }, statusHistory: { orderBy: { changedAt: "desc" } } }
  });
  if (!lead) return res.status(404).json({ error: { message: "Lead not found" } });
  res.json({ lead });
}

export async function createLeadHandler(req: Request, res: Response) {
  const userId = req.user!.sub;
  const lead = await createLead(req.body, userId);
  res.status(201).json({ lead });

  // Real-time: broadcast to managers
  io.emit("lead:new", { lead });

  // Email: notify managers
  const managers = await prisma.user.findMany({ where: { role: "MANAGER" as Role } });
  for (const m of managers) {
    if (m.email) {
      sendMail(
        m.email,
        "🆕 New Lead Created",
        `<h3>${lead.name}</h3><p>Value: ${lead.value ?? "-"}</p><p>Source: ${lead.source ?? "-"}</p>`
      );
    }
  }
}

export async function updateLeadHandler(req: Request, res: Response) {
  const userId = req.user!.sub;
  const { id } = req.params;
  const lead = await updateLead(id, req.body, userId);
  res.json({ lead });

  // Real-time: notify owner
  if (lead.ownerId) io.to(`user:${lead.ownerId}`).emit("lead:updated", { lead });

  // Email: notify owner
  if (lead.ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: lead.ownerId } });
    if (owner?.email) {
      sendMail(
        owner.email,
        "🔄 Lead Updated",
        `<p>Your lead <b>${lead.name}</b> is now <b>${lead.status}</b>.</p>`
      );
    }
  }
}

export async function assignOwnerHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { ownerId } = req.body as { ownerId: string };
  const userId = req.user!.sub;
  const lead = await assignOwner(id, ownerId, userId);
  res.json({ lead });

  // Real-time: notify the assigned sales user
  io.to(`user:${ownerId}`).emit("lead:assigned", { lead });

  // Email: notify the assigned sales user
  const user = await prisma.user.findUnique({ where: { id: ownerId } });
  if (user?.email) {
    sendMail(
      user.email,
      " Lead Assigned",
      `<p>You have been assigned a new lead: <b>${lead.name}</b>.</p>`
    );
  }
}

export async function deleteLead(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.lead.delete({ where: { id } });
  res.status(204).send();
}
