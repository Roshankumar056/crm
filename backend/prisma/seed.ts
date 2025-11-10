import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@crm.local" },
    update: {},
    create: {
      email: "admin@crm.local",
      name: "CRM Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });
  console.log("Seed complete: Admin user created -> admin@crm.local / Admin@123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
