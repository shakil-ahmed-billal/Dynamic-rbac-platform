/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `system_modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `system_modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "system_modules" ADD COLUMN     "slug" TEXT;

-- Update existing data
UPDATE "system_modules" SET "slug" = LOWER(REPLACE("name", ' ', '-')) WHERE "slug" IS NULL;

-- Make it NOT NULL
ALTER TABLE "system_modules" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "system_modules_slug_key" ON "system_modules"("slug");
