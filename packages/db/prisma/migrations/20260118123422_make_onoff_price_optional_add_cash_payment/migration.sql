-- AlterTable
ALTER TABLE "ClientService" ADD COLUMN     "oneOffPaidInCash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ServiceDefinition" ALTER COLUMN "oneOffPrice" DROP NOT NULL,
ALTER COLUMN "oneOffPrice" DROP DEFAULT;
