import prisma from "../config/prisma.js";
import { updateTotalBiaya } from "./servis.service.js";

export async function getAllDetailServis() {
  return await prisma.detailServis.findMany({
    include: {
      servis: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getDetailServisById(id) {
  return await prisma.detailServis.findUnique({
    where: {
      id,
    },
    include: {
      servis: true,
    },
  });
}

export async function createDetailServis(data) {
  const detail = await prisma.detailServis.create({
    data,
  });

  await updateTotalBiaya(data.servisId);

  return detail;
}

export async function updateDetailServis(id, data) {
  const detail = await prisma.detailServis.update({
    where: {
      id,
    },
    data,
  });

  await updateTotalBiaya(detail.servisId);

  return detail;
}

export async function deleteDetailServis(id) {
  const detail = await prisma.detailServis.findUnique({
    where: {
      id,
    },
  });

  if (!detail) {
    throw new Error("Detail Servis tidak ditemukan");
  }

  await prisma.detailServis.delete({
    where: {
      id,
    },
  });

  await updateTotalBiaya(detail.servisId);

  return {
    message: "Detail Servis berhasil dihapus",
  };
}