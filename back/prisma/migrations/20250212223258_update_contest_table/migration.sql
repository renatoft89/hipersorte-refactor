/*
  Warnings:

  - You are about to drop the column `number` on the `contests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentContest]` on the table `contests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentContest` to the `contests` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `contests_number_key` ON `contests`;

-- AlterTable
ALTER TABLE `contests` DROP COLUMN `number`,
    ADD COLUMN `currentContest` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `contests_currentContest_key` ON `contests`(`currentContest`);
