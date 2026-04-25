-- CreateTable
CREATE TABLE `Vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `stockNumber` VARCHAR(191) NULL,
    `vin` VARCHAR(191) NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `trim` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `msrp` DOUBLE NULL,
    `mileage` INTEGER NOT NULL,
    `bodyStyle` VARCHAR(191) NULL,
    `transmission` VARCHAR(191) NULL,
    `engine` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `driveType` VARCHAR(191) NULL,
    `doors` INTEGER NULL,
    `seats` INTEGER NULL,
    `exteriorColor` VARCHAR(191) NULL,
    `interiorColor` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `features` TEXT NOT NULL,
    `images` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'available',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinanceApplication` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `dob` VARCHAR(191) NULL,
    `sin` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `zip` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `timeAtAddress` VARCHAR(191) NULL,
    `employer` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `income` DOUBLE NULL,
    `timeAtJob` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NULL,
    `tradeIn` BOOLEAN NOT NULL DEFAULT false,
    `tradeInDetails` TEXT NULL,
    `reference1` TEXT NULL,
    `reference2` TEXT NULL,
    `consent` BOOLEAN NOT NULL DEFAULT false,
    `message` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TradeInSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `trim` VARCHAR(191) NULL,
    `vin` VARCHAR(191) NULL,
    `mileage` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `transmission` VARCHAR(191) NULL,
    `condition` VARCHAR(191) NULL,
    `mechanical` TEXT NULL,
    `exterior` TEXT NULL,
    `interior` TEXT NULL,
    `hasLoan` BOOLEAN NOT NULL DEFAULT false,
    `payoffAmount` VARCHAR(191) NULL,
    `photos` TEXT NULL,
    `videos` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarFinderRequest` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `make` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `minYear` INTEGER NULL,
    `maxYear` INTEGER NULL,
    `minPrice` DOUBLE NULL,
    `maxPrice` DOUBLE NULL,
    `bodyStyle` VARCHAR(191) NULL,
    `transmission` VARCHAR(191) NULL,
    `fuelType` VARCHAR(191) NULL,
    `driveType` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `maxMileage` INTEGER NULL,
    `features` TEXT NULL,
    `notes` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'open',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `group` VARCHAR(191) NOT NULL DEFAULT 'general',
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SiteSetting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `Vehicle` ADD COLUMN `videoUrl` VARCHAR(191) NULL;
