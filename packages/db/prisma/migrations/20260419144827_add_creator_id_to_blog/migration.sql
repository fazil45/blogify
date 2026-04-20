/*
  Warnings:

  - You are about to drop the column `createrId` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_createrId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "createrId",
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
