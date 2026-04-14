-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "bodyStyle" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "engine" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "exteriorColor" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "fuelType" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "interiorColor" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "msrp" REAL;
ALTER TABLE "Vehicle" ADD COLUMN "stockNumber" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "transmission" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "vin" TEXT;

-- CreateTable
CREATE TABLE "TradeInSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "vin" TEXT,
    "mileage" TEXT NOT NULL,
    "color" TEXT,
    "transmission" TEXT,
    "condition" TEXT,
    "mechanical" TEXT,
    "exterior" TEXT,
    "interior" TEXT,
    "hasLoan" BOOLEAN NOT NULL DEFAULT false,
    "payoffAmount" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "vehicleId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinanceApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dob" TEXT,
    "sin" TEXT,
    "address" TEXT,
    "timeAtAddress" TEXT,
    "employer" TEXT,
    "occupation" TEXT,
    "income" REAL,
    "timeAtJob" TEXT,
    "vehicleId" TEXT,
    "tradeIn" BOOLEAN NOT NULL DEFAULT false,
    "tradeInDetails" TEXT,
    "reference1" TEXT,
    "reference2" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FinanceApplication" ("createdAt", "email", "id", "income", "message", "name", "phone", "vehicleId") SELECT "createdAt", "email", "id", "income", "message", "name", "phone", "vehicleId" FROM "FinanceApplication";
DROP TABLE "FinanceApplication";
ALTER TABLE "new_FinanceApplication" RENAME TO "FinanceApplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
