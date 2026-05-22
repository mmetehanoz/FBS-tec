import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const username = process.env.ADMIN_USERNAME ?? "admin";
const password = process.env.ADMIN_PASSWORD ?? "Fbs1997*";

const passwordHash = await bcrypt.hash(password, 12);

await prisma.adminUser.upsert({
  where: {
    username,
  },
  create: {
    username,
    passwordHash,
    name: "FBS Admin",
  },
  update: {
    passwordHash,
    isActive: true,
  },
});

await prisma.$disconnect();

console.log(`Admin user ready: ${username}`);
