import prisma from "../config/prisma.js";

export async function getProfile(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}