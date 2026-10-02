import prisma from "../config/prisma.js";

export async function getDashboard() {
  const [
    totalPelanggan,
    totalKendaraan,
    totalMekanik,
    totalKategoriSparepart,
    totalSparepart,
    totalServis,
    totalPembayaran,

    pendapatan,

    servisMenunggu,
    servisProses,
    servisSelesai,

    stokMenipis,

    servisTerbaru,

    pembayaranTerbaru,
  ] = await Promise.all([
    prisma.pelanggan.count(),

    prisma.kendaraan.count(),

    prisma.mekanik.count(),

    prisma.kategoriSparepart.count(),

    prisma.sparepart.count(),

    prisma.servis.count(),

    prisma.pembayaran.count(),

    prisma.pembayaran.aggregate({
      _sum: {
        total: true,
      },
    }),

    prisma.servis.count({
      where: {
        status: "Menunggu",
      },
    }),

    prisma.servis.count({
      where: {
        status: "Proses",
      },
    }),

    prisma.servis.count({
      where: {
        status: "Selesai",
      },
    }),

    prisma.sparepart.findMany({
      where: {
        stok: {
          lte: 5,
        },
      },
      orderBy: {
        stok: "asc",
      },
      take: 5,
    }),

    prisma.servis.findMany({
      include: {
        kendaraan: {
          include: {
            pelanggan: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.pembayaran.findMany({
      include: {
        servis: true,
      },
      orderBy: {
        tanggalBayar: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    statistik: {
      totalPelanggan,
      totalKendaraan,
      totalMekanik,
      totalKategoriSparepart,
      totalSparepart,
      totalServis,
      totalPembayaran,
      pendapatan: Number(pendapatan._sum.total ?? 0),
    },

    servis: {
      menunggu: servisMenunggu,
      proses: servisProses,
      selesai: servisSelesai,
    },

    stokMenipis,

    servisTerbaru,

    pembayaranTerbaru,
  };
}

export async function getUserDashboard(userId) {
  const account = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, nama: true, email: true, role: true },
  });
  const pelanggan = await prisma.pelanggan.findUnique({
    where: { userId: Number(userId) },
    include: { kendaraan: true },
  });

  if (!pelanggan) {
    return { user: account, kendaraan: [], servis: [], pembayaran: [] };
  }

  const kendaraanIds = pelanggan.kendaraan.map((item) => item.id);
  const servis = await prisma.servis.findMany({
    where: { kendaraanId: { in: kendaraanIds } },
    include: { kendaraan: true },
    orderBy: { createdAt: "desc" },
  });
  const servisIds = servis.map((item) => item.id);
  const pembayaran = await prisma.pembayaran.findMany({
    where: { servisId: { in: servisIds } },
    include: { servis: { include: { kendaraan: true } } },
    orderBy: { tanggalBayar: "desc" },
  });

  return {
    user: account ?? { id: pelanggan.userId, nama: pelanggan.nama },
    kendaraan: pelanggan.kendaraan,
    servis,
    pembayaran,
  };
}