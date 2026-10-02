import prisma from "../config/prisma.js";

export async function getAllKategoriSparepart() {
  return await prisma.kategoriSparepart.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function getKategoriSparepartById(id) {
  return await prisma.kategoriSparepart.findUnique({
    where: { id },
  });
}

export async function createKategoriSparepart(data) {
  return await prisma.kategoriSparepart.create({
    data,
  });
}

export async function updateKategoriSparepart(id, data) {
  return await prisma.kategoriSparepart.update({
    where: { id },
    data,
  });
}

export async function deleteKategoriSparepart(id) {
  return await prisma.kategoriSparepart.delete({
    where: { id },
  });
}
