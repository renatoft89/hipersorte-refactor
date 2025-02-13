-- CreateTable
CREATE TABLE `contests` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `game_type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `contests_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
