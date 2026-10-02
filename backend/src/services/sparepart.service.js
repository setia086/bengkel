import prisma from "../config/prisma.js";

export async function getAllSparepart() {
  return await prisma.sparepart.findMany({
    include: {
      kategori: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getSparepartById(id) {
  return await prisma.sparepart.findUnique({
    where: {
      id,
    },
    include: {
      kategori: true,
    },
  });
}

export async function createSparepart(data) {
  return await prisma.sparepart.create({
    data,
  });
}

export async function updateSparepart(id, data) {
  return await prisma.sparepart.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteSparepart(id) {
  return await prisma.sparepart.delete({
    where: {
      id,
    },
  });
}