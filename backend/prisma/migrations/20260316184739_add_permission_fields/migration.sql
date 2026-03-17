/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `action` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PermissionAction";

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_moduleId_key" ON "permissions"("action", "moduleId");
