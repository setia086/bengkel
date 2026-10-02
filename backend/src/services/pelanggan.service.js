import prisma from "../config/prisma.js";


export async function getAllPelanggan(query) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";

  const sort = query.sort || "id";
  const order = query.order === "desc" ? "desc" : "asc";

  const where = {
    OR: [
      {
        nama: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        telepon: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        alamat: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  const [data, total] = await Promise.all([
    prisma.pelanggan.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
    }),

    prisma.pelanggan.count({
      where,
    }),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPelangganById(id) {
  return await prisma.pelanggan.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      kendaraan: true,
    },
  });
}

export async function createPelanggan(data) {
  return await prisma.pelanggan.create({
    data,
  });
}

export async function updatePelanggan(id, data) {
  return await prisma.pelanggan.update({
    where: {
      id: Number(id),
    },
    data,
  });
}

export async function deletePelanggan(id) {
  return await prisma.pelanggan.delete({
    where: {
      id: Number(id),
    },
  });
}