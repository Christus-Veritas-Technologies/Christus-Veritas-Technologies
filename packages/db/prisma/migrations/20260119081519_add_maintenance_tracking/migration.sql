-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "monthlyFee" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "isPaidForCurrentMonth" BOOLEAN NOT NULL DEFAULT false,
    "paidInCash" BOOLEAN NOT NULL DEFAULT false,
    "cashConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "cashConfirmedAt" TIMESTAMP(3),
    "cashConfirmedBy" TEXT,
    "paidAt" TIMESTAMP(3),
    "lastReminderSent" TIMESTAMP(3),
    "reminderCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_projectId_key" ON "Maintenance"("projectId");

-- CreateIndex
CREATE INDEX "Maintenance_projectId_idx" ON "Maintenance"("projectId");

-- CreateIndex
CREATE INDEX "Maintenance_isActive_idx" ON "Maintenance"("isActive");

-- CreateIndex
CREATE INDEX "Maintenance_currentPeriodEnd_idx" ON "Maintenance"("currentPeriodEnd");

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
