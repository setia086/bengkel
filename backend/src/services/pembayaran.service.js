import prisma from "../config/prisma.js";

export async function getAllPembayaran() {
  return await prisma.pembayaran.findMany({
    include: {
      servis: {
        include: {
          kendaraan: {
            include: {
              pelanggan: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getPembayaranById(id) {
  return await prisma.pembayaran.findUnique({
    where: { id },
    include: {
      servis: {
        include: {
          kendaraan: {
            include: {
              pelanggan: true,
            },
          },
        },
      },
    },
  });
}

export async function createPembayaran(data) {
  const servis = await prisma.servis.findUnique({
    where: {
      id: data.servisId,
    },
  });

  if (!servis) {
    throw new Error("Data servis tidak ditemukan");
  }

  if (servis.status.toLowerCase() !== "selesai") {
    throw new Error("Pembayaran hanya dapat dibuat setelah servis selesai");
  }

  const total = Number(servis.totalBiaya);
  const dibayar = Number(data.dibayar);

  if (total <= 0) {
    throw new Error("Total servis belum ditetapkan atau masih Rp0");
  }

  const kembalian = dibayar > total ? dibayar - total : 0;

  const status = dibayar >= total ? "Lunas" : "Belum Lunas";

  return await prisma.pembayaran.create({
    data: {
      servisId: data.servisId,
      metode: data.metode,
      total,
      dibayar,
      kembalian,
      status,
    },
  });
}

export async function updatePembayaran(id, data) {
  const pembayaran = await prisma.pembayaran.findUnique({
    where: { id },
    include: {
      servis: true,
    },
  });

  if (!pembayaran) {
    throw new Error("Data pembayaran tidak ditemukan");
  }

  const total = Number(pembayaran.total);
  const dibayar = Number(data.dibayar);

  const kembalian = dibayar > total ? dibayar - total : 0;

  const status = dibayar >= total ? "Lunas" : "Belum Lunas";

  return await prisma.pembayaran.update({
    where: { id },
    data: {
      metode: data.metode,
      dibayar,
      kembalian,
      status,
    },
  });
}

export async function deletePembayaran(id) {
  return await prisma.pembayaran.delete({
    where: { id },
  });
}

export async function createUserPembayaran(userId, data) {
  const servis = await prisma.servis.findFirst({
    where: {
      id: data.servisId,
      kendaraan: { pelanggan: { userId: Number(userId) } },
    },
  });

  if (!servis) throw new Error("Servis tidak ditemukan untuk akun ini");
  if (servis.status.toLowerCase() !== "selesai") {
    throw new Error("Pembayaran hanya tersedia setelah servis dinyatakan selesai oleh admin");
  }

  const existing = await prisma.pembayaran.findUnique({ where: { servisId: servis.id } });
  if (existing) throw new Error("Servis ini sudah memiliki pembayaran");

  const total = Number(servis.totalBiaya);
  const dibayar = Number(data.dibayar);

  if (dibayar < total) throw new Error("Jumlah pembayaran kurang dari total servis");

  return prisma.pembayaran.create({
    data: {
      servisId: servis.id,
      metode: data.metode,
      total,
      dibayar,
      kembalian: dibayar - total,
      status: "Lunas",
    },
    include: { servis: { include: { kendaraan: true } } },
  });
}