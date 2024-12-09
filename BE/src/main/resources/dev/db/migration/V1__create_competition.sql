CREATE TABLE `competition` (
                               `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
                               `quiz_id` INT,
                               `time` INT,
                               `name` VARCHAR(255),
                               `description` VARCHAR(255),
                               `start_time` DATETIME,
                               `organized_by` INT,
                               `code` VARCHAR(6) UNIQUE,
                               PRIMARY KEY (`id`)
);
-- Create a trigger to auto-generate a 6-digit code for each new competition
DELIMITER $$
CREATE TRIGGER `generate_competition_code` BEFORE INSERT ON `competition`
    FOR EACH ROW
BEGIN
    DECLARE random_code VARCHAR(6);

    -- Generate a random 6-digit numeric code
    SET random_code = LPAD(FLOOR(RAND() * 999999), 6, '0');

    -- Assign the generated code to the new row
    SET NEW.code = random_code;
END$$
    DELIMITER ;

-- Add competition_id column to results table
ALTER TABLE `results`
    ADD COLUMN `competition_id` INT(11) DEFAULT NULL;

-- Add foreign key constraint to competition_id in the results table
ALTER TABLE `results`
    ADD CONSTRAINT `fk_results_competition`
        FOREIGN KEY (`competition_id`) REFERENCES `competition`(`id`)
            ON UPDATE NO ACTION
            ON DELETE NO ACTION;

-- Add foreign key constraint for quiz_id in the competition table (reference quiz table)
ALTER TABLE `competition`
    ADD CONSTRAINT `fk_competition_quiz`
        FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`)
            ON UPDATE CASCADE
            ON DELETE CASCADE;


-- Add foreign key for organized_by column in the competition table (reference users table)
ALTER TABLE `competition`
    ADD CONSTRAINT `fk_competition_organized_by`
        FOREIGN KEY (`organized_by`) REFERENCES `users`(`id`)
            ON UPDATE NO ACTION
            ON DELETE NO ACTION;
