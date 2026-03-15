-- AlterTable
ALTER TABLE `subject` ADD COLUMN `priceCents` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `thumbnailKey` VARCHAR(191) NULL DEFAULT 'default';
