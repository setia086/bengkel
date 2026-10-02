import prisma from "../config/prisma.js";

export async function getAllServis() {
  return await prisma.servis.findMany({
    include: {
      kendaraan: {
        include: {
          pelanggan: true,
        },
      },
      mekanik: true,
      detailServis: true,
      detailSparepart: {
        include: {
          sparepart: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getServisById(id) {
  return await prisma.servis.findUnique({
    where: {
      id,
    },
    include: {
      kendaraan: {
        include: {
          pelanggan: true,
        },
      },
      mekanik: true,
      detailServis: true,
      detailSparepart: {
        include: {
          sparepart: true,
        },
      },
    },
  });
}

export async function createServis(data) {
  return await prisma.servis.create({
    data,
  });
}

export async function updateServis(id, data) {
  const { totalBiaya, ...servisData } = data;

  return await prisma.servis.update({
    where: {
      id,
    },
    data: servisData,
  });
}

export async function deleteServis(id) {
  return await prisma.servis.delete({
    where: {
      id,
    },
  });
}

export async function updateTotalBiaya(servisId) {
  const detailServis = await prisma.detailServis.findMany({
    where: { servisId },
  });

  const detailSparepart = await prisma.detailSparepart.findMany({
    where: { servisId },
  });

  const totalJasa = detailServis.reduce(
    (total, item) => total + Number(item.biaya),
    0
  );

  const totalSparepart = detailSparepart.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );

  const totalBiaya = totalJasa + totalSparepart;

  return await prisma.servis.update({
    where: {
      id: servisId,
    },
    data: {
      totalBiaya,
    },
  });
}