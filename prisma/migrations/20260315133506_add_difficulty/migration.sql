-- AlterTable
ALTER TABLE `subject` ADD COLUMN `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'MEDIUM';
