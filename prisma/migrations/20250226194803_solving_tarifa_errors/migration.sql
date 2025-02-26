/*
  Warnings:

  - You are about to drop the column `createdBy` on the `DeliveryZone` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `DeliveryZone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeliveryZone" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";
