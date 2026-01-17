-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" INTEGER NOT NULL,
    "paymentId" TEXT,
    "reference" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_paymentId_idx" ON "Order"("paymentId");

-- CreateIndex
CREATE INDEX "Order_reference_idx" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
