import prisma from "../config/prisma.js";

export async function getAllMekanik() {
  return await prisma.mekanik.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function getMekanikById(id) {
  return await prisma.mekanik.findUnique({
    where: { id },
  });
}

export async function createMekanik(data) {
  return await prisma.mekanik.create({
    data,
  });
}

export async function updateMekanik(id, data) {
  return await prisma.mekanik.update({
    where: { id },
    data,
  });
}

export async function deleteMekanik(id) {
  return await prisma.mekanik.delete({
    where: { id },
  });
}