import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Membuat admin...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@bengkel.com",
    },
    update: {},
    create: {
      nama: "Administrator",
      email: "admin@bengkel.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Admin berhasil dibuat");
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });