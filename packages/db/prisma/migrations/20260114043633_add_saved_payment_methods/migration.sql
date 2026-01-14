-- CreateEnum
CREATE TYPE "SavedPaymentMethodType" AS ENUM ('CARD', 'MOBILE_MONEY');

-- CreateTable
CREATE TABLE "SavedPaymentMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SavedPaymentMethodType" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "cardLast4" TEXT,
    "cardBrand" TEXT,
    "cardExpMonth" INTEGER,
    "cardExpYear" INTEGER,
    "cardHolderName" TEXT,
    "mobileNumber" TEXT,
    "mobileProvider" TEXT,
    "nickname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedPaymentMethod_userId_idx" ON "SavedPaymentMethod"("userId");

-- CreateIndex
CREATE INDEX "SavedPaymentMethod_type_idx" ON "SavedPaymentMethod"("type");

-- AddForeignKey
ALTER TABLE "SavedPaymentMethod" ADD CONSTRAINT "SavedPaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
