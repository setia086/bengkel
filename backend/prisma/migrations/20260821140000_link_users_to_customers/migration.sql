ALTER TABLE "Pelanggan" ADD COLUMN "userId" INTEGER;
ALTER TABLE "Pelanggan" ALTER COLUMN "telepon" DROP NOT NULL;

CREATE UNIQUE INDEX "Pelanggan_userId_key" ON "Pelanggan"("userId");

ALTER TABLE "Pelanggan"
ADD CONSTRAINT "Pelanggan_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';