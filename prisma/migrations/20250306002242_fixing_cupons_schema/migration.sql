/*
  Warnings:

  - You are about to drop the column `clientId` on the `Cupones` table. All the data in the column will be lost.
  - You are about to drop the column `usedAt` on the `Cupones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cupones" DROP CONSTRAINT "Cupones_clientId_fkey";

-- AlterTable
ALTER TABLE "Cupones" DROP COLUMN "clientId",
DROP COLUMN "usedAt",
ADD COLUMN     "maxUses" INTEGER,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CuponUse" (
    "id" TEXT NOT NULL,
    "cuponId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CuponUse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CuponUse" ADD CONSTRAINT "CuponUse_cuponId_fkey" FOREIGN KEY ("cuponId") REFERENCES "Cupones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuponUse" ADD CONSTRAINT "CuponUse_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
