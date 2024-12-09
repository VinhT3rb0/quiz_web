-- Flyway migration script for updating question_result and adding selected_choices table

-- Step 1: Drop the selected_choice_id column from question_result
ALTER TABLE `question_result`
DROP FOREIGN KEY `question_result_ibfk_3`;

ALTER TABLE `question_result`
DROP COLUMN `selected_choice_id`;

-- Step 1: Tạo bảng selected_choices với khóa ngoại tới question_choice
CREATE TABLE `selected_choices` (   `id` int(11) NOT NULL AUTO_INCREMENT,
                                    `question_result_id` int(11) NOT NULL,
                                    `choice_id` int(11) NOT NULL,
                                    PRIMARY KEY (`id`),
                                    FOREIGN KEY (`question_result_id`) REFERENCES `question_result` (`id`) ON DELETE CASCADE,
                                    FOREIGN KEY (`choice_id`) REFERENCES `question_choice` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

