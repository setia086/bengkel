-- CreateTable
CREATE TABLE "Pelanggan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "alamat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kendaraan" (
    "id" SERIAL NOT NULL,
    "pelangganId" INTEGER NOT NULL,
    "platNomor" TEXT NOT NULL,
    "merk" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "tahun" INTEGER,
    "warna" TEXT,
    "nomorRangka" TEXT,
    "nomorMesin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kendaraan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mekanik" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "telepon" TEXT,
    "spesialis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mekanik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriSparepart" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KategoriSparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sparepart" (
    "id" SERIAL NOT NULL,
    "kategoriId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "merk" TEXT,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "harga" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servis" (
    "id" SERIAL NOT NULL,
    "kodeServis" TEXT NOT NULL,
    "kendaraanId" INTEGER NOT NULL,
    "mekanikId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keluhan" TEXT,
    "kilometer" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "totalBiaya" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailServis" (
    "id" SERIAL NOT NULL,
    "servisId" INTEGER NOT NULL,
    "namaPekerjaan" TEXT NOT NULL,
    "biaya" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "DetailServis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailSparepart" (
    "id" SERIAL NOT NULL,
    "servisId" INTEGER NOT NULL,
    "sparepartId" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "DetailSparepart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" SERIAL NOT NULL,
    "servisId" INTEGER NOT NULL,
    "metode" TEXT NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "dibayar" DECIMAL(12,2) NOT NULL,
    "kembalian" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Lunas',
    "tanggalBayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_telepon_key" ON "Pelanggan"("telepon");

-- CreateIndex
CREATE UNIQUE INDEX "Kendaraan_platNomor_key" ON "Kendaraan"("platNomor");

-- CreateIndex
CREATE UNIQUE INDEX "Mekanik_telepon_key" ON "Mekanik"("telepon");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriSparepart_nama_key" ON "KategoriSparepart"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Servis_kodeServis_key" ON "Servis"("kodeServis");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_servisId_key" ON "Pembayaran"("servisId");

-- AddForeignKey
ALTER TABLE "Kendaraan" ADD CONSTRAINT "Kendaraan_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sparepart" ADD CONSTRAINT "Sparepart_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriSparepart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servis" ADD CONSTRAINT "Servis_kendaraanId_fkey" FOREIGN KEY ("kendaraanId") REFERENCES "Kendaraan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servis" ADD CONSTRAINT "Servis_mekanikId_fkey" FOREIGN KEY ("mekanikId") REFERENCES "Mekanik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailServis" ADD CONSTRAINT "DetailServis_servisId_fkey" FOREIGN KEY ("servisId") REFERENCES "Servis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSparepart" ADD CONSTRAINT "DetailSparepart_servisId_fkey" FOREIGN KEY ("servisId") REFERENCES "Servis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSparepart" ADD CONSTRAINT "DetailSparepart_sparepartId_fkey" FOREIGN KEY ("sparepartId") REFERENCES "Sparepart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_servisId_fkey" FOREIGN KEY ("servisId") REFERENCES "Servis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
