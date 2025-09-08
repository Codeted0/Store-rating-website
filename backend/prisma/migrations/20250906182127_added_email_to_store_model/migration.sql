/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Store" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Store_email_key" ON "public"."Store"("email");
