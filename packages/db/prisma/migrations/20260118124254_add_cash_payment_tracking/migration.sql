-- AlterEnum
ALTER TYPE "ClientServiceStatus" ADD VALUE 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "ClientService" ADD COLUMN     "currentMonthCashConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "currentMonthCashConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "currentMonthPaidInCash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oneOffCashConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oneOffCashConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "oneOffCashConfirmedBy" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "maintenanceCashConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maintenanceCashConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "maintenancePaidInCash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "monthlyMaintenanceFee" INTEGER,
ADD COLUMN     "nextMaintenanceDue" TIMESTAMP(3),
ADD COLUMN     "priceCashConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceCashConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "priceCashConfirmedBy" TEXT,
ADD COLUMN     "pricePaidInCash" BOOLEAN NOT NULL DEFAULT false;
