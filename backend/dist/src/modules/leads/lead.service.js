import { prisma } from "../../db/prisma";
import { ActivityType } from "@prisma/client";
export async function createLead(data, userId) {
    const lead = await prisma.lead.create({ data });
    await prisma.activity.create({
        data: { type: ActivityType.NOTE, note: "Lead created", leadId: lead.id, userId }
    });
    return lead;
}
export async function updateLead(id, data, userId) {
    const prev = await prisma.lead.findUnique({ where: { id } });
    const lead = await prisma.lead.update({ where: { id }, data });
    if (prev?.status !== lead.status) {
        await prisma.leadHistory.create({
            data: { from: prev?.status ?? null, to: lead.status, leadId: id, userId }
        });
        await prisma.activity.create({
            data: { type: ActivityType.STATUS_CHANGE, note: `Status: ${prev?.status} -> ${lead.status}`, leadId: id, userId }
        });
    }
    return lead;
}
export async function assignOwner(id, ownerId, byUser) {
    const lead = await prisma.lead.update({ where: { id }, data: { ownerId } });
    await prisma.activity.create({
        data: { type: ActivityType.NOTE, note: `Owner assigned to ${ownerId}`, leadId: id, userId: byUser }
    });
    return lead;
}
