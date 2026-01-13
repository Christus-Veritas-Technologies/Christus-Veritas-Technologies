-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'QUOTED', 'ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "organizationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "stockCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "oneOffPrice" INTEGER NOT NULL DEFAULT 0,
    "recurringPrice" INTEGER NOT NULL DEFAULT 0,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "timeline" TEXT,
    "budget" INTEGER,
    "quotedPrice" INTEGER,
    "quotedTimeline" TEXT,
    "quotedAt" TIMESTAMP(3),
    "quotedById" TEXT,
    "quoteNotes" TEXT,
    "userAcceptedAt" TIMESTAMP(3),
    "userDeclinedAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "deliverables" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMessage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");

-- CreateIndex
CREATE INDEX "MarketplaceService_isActive_idx" ON "MarketplaceService"("isActive");

-- CreateIndex
CREATE INDEX "MarketplaceService_category_idx" ON "MarketplaceService"("category");

-- CreateIndex
CREATE INDEX "MarketplaceService_isFeatured_idx" ON "MarketplaceService"("isFeatured");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectMessage_projectId_idx" ON "ProjectMessage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectMessage_createdAt_idx" ON "ProjectMessage"("createdAt");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_quotedById_fkey" FOREIGN KEY ("quotedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMessage" ADD CONSTRAINT "ProjectMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMessage" ADD CONSTRAINT "ProjectMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
