ALTER TABLE `users`
    ADD COLUMN `verification_code` VARCHAR(255) DEFAULT NULL,
    ADD COLUMN `verification_expiration` DATETIME DEFAULT NULL,
    ADD COLUMN `enabled` BOOLEAN DEFAULT NULL;
