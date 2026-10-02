import prisma from "../config/prisma.js";

export async function getAllKendaraan() {
  return prisma.kendaraan.findMany({
    include: {
      pelanggan: {
        select: {
          id: true,
          nama: true,
          telepon: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function getKendaraanById(id) {
  return prisma.kendaraan.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      pelanggan: true,
    },
  });
}

export async function createKendaraan(data) {
  return prisma.kendaraan.create({
    data,
  });
}

export async function updateKendaraan(id, data) {
  return prisma.kendaraan.update({
    where: {
      id: Number(id),
    },
    data,
  });
}

export async function deleteKendaraan(id) {
  return prisma.kendaraan.delete({
    where: {
      id: Number(id),
    },
  });
}
