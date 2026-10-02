import prisma from "../config/prisma.js";

export async function getAllDetailSparepart() {
  return await prisma.detailSparepart.findMany({
    include: {
      servis: true,
      sparepart: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getDetailSparepartById(id) {
  return await prisma.detailSparepart.findUnique({
    where: { id },
    include: {
      servis: true,
      sparepart: true,
    },
  });
}

export async function createDetailSparepart(data) {
  return await prisma.detailSparepart.create({
    data,
  });
}

export async function updateDetailSparepart(id, data) {
  return await prisma.detailSparepart.update({
    where: { id },
    data,
  });
}

export async function deleteDetailSparepart(id) {
  return await prisma.detailSparepart.delete({
    where: { id },
  });
}