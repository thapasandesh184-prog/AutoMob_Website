-- AlterTable
ALTER TABLE "FinanceApplication" ADD COLUMN "city" TEXT;
ALTER TABLE "FinanceApplication" ADD COLUMN "state" TEXT;
ALTER TABLE "FinanceApplication" ADD COLUMN "street" TEXT;
ALTER TABLE "FinanceApplication" ADD COLUMN "zip" TEXT;

-- AlterTable
ALTER TABLE "TradeInSubmission" ADD COLUMN "photos" TEXT;

-- CreateTable
CREATE TABLE "CarFinderRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "make" TEXT,
    "model" TEXT,
    "minYear" INTEGER,
    "maxYear" INTEGER,
    "minPrice" REAL,
    "maxPrice" REAL,
    "bodyStyle" TEXT,
    "transmission" TEXT,
    "fuelType" TEXT,
    "driveType" TEXT,
    "color" TEXT,
    "maxMileage" INTEGER,
    "features" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
