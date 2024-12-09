-- Create categories table
CREATE TABLE `categories` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `name` varchar(255) DEFAULT NULL,
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create users table
CREATE TABLE `users` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `username` varchar(100) DEFAULT NULL,
                         `password` varchar(255) DEFAULT NULL,
                         `email` varchar(255) DEFAULT NULL,
                         `created_at` datetime DEFAULT current_timestamp(),
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create quizzes table (without foreign keys)
CREATE TABLE `quizzes` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `title` varchar(255) DEFAULT NULL,
                           `description` tinytext DEFAULT NULL,
                           `created_by` int(11) DEFAULT NULL,
                           `created_at` datetime DEFAULT current_timestamp(),
                           `category_id` int(11) DEFAULT NULL,
                           `is_published` tinyint(1) NOT NULL DEFAULT 1,
                           `image` varchar(255) DEFAULT NULL,
                           `total_questions` int(11) NOT NULL DEFAULT 0,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `id` (`id`),
                           KEY `created_by` (`created_by`),
                           KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create questions table (without foreign keys)
CREATE TABLE `questions` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `quiz_id` int(11) DEFAULT NULL,
                             `question` varchar(255) DEFAULT NULL,
                             `created_at` datetime DEFAULT current_timestamp(),
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `id` (`id`),
                             KEY `quiz_id` (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create question_choice table (without foreign keys)
CREATE TABLE `question_choice` (
                                   `id` int(11) NOT NULL AUTO_INCREMENT,
                                   `question_id` int(11) DEFAULT NULL,
                                   `text` varchar(255) DEFAULT NULL,
                                   `is_correct` tinyint(1) DEFAULT 0,
                                   PRIMARY KEY (`id`),
                                   UNIQUE KEY `id` (`id`),
                                   KEY `question_id` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create results table (without foreign keys)
CREATE TABLE `results` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `user_id` int(11) DEFAULT NULL,
                           `quiz_id` int(11) DEFAULT NULL,
                           `completed_at` datetime DEFAULT current_timestamp(),
                           `score` int(11) DEFAULT NULL,
                           `submitted_time` int(11) DEFAULT 0,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `id` (`id`),
                           KEY `user_id` (`user_id`),
                           KEY `quiz_id` (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create question_result table (without foreign keys)
CREATE TABLE `question_result` (
                                   `id` int(11) NOT NULL AUTO_INCREMENT,
                                   `result_id` int(11) DEFAULT NULL,
                                   `question_id` int(11) DEFAULT NULL,
                                   `selected_choice_id` int(11) DEFAULT NULL,
                                   `is_correct` tinyint(1) DEFAULT 0,
                                   PRIMARY KEY (`id`),
                                   UNIQUE KEY `id` (`id`),
                                   KEY `result_id` (`result_id`),
                                   KEY `question_id` (`question_id`),
                                   KEY `selected_choice_id` (`selected_choice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create token table (without foreign keys)
CREATE TABLE `token` (
                         `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                         `token` varchar(255) NOT NULL,
                         `expirationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                         `revoked` tinyint(1) NOT NULL,
                         `expired` tinyint(1) NOT NULL,
                         `userId` int(11) NOT NULL,
                         PRIMARY KEY (`id`),
                         KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Add foreign keys for quizzes
ALTER TABLE `quizzes`
    ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add foreign key for questions
ALTER TABLE `questions`
    ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key for question_choice
ALTER TABLE `question_choice`
    ADD CONSTRAINT `question_choice_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign keys for results
ALTER TABLE `results`
    ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign keys for question_result
ALTER TABLE `question_result`
    ADD CONSTRAINT `question_result_ibfk_1` FOREIGN KEY (`result_id`) REFERENCES `results` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `question_result_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `question_result_ibfk_3` FOREIGN KEY (`selected_choice_id`) REFERENCES `question_choice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key for token
ALTER TABLE `token`
    ADD CONSTRAINT `token_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
INSERT INTO `categories` (`name`)
VALUES
    ('Computer Science'),
    ('Mathematics'),
    ('Physics'),
    ('Biology'),
    ('Chemistry'),
    ('Mechanical Engineering'),
    ('Electrical Engineering'),
    ('Business Administration'),
    ('Economics'),
    ('Psychology'),
    ('Sociology'),
    ('Art History'),
    ('Literature'),
    ('Political Science'),
    ('Other'),
    ('Law');

-- -- Step 1: Create categories table
-- CREATE TABLE `categories` (
--                               `id` int(11) NOT NULL AUTO_INCREMENT,
--                               `name` varchar(255) DEFAULT NULL,
--                               PRIMARY KEY (`id`),
--                               UNIQUE KEY `id` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 2: Create users table
-- CREATE TABLE `users` (
--                          `id` int(11) NOT NULL AUTO_INCREMENT,
--                          `username` varchar(100) DEFAULT NULL,
--                          `password` varchar(255) DEFAULT NULL,
--                          `email` varchar(255) DEFAULT NULL,
--                          `created_at` datetime DEFAULT current_timestamp(),
--                          PRIMARY KEY (`id`),
--                          UNIQUE KEY `id` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 3: Create quizzes table (references users and categories)
-- CREATE TABLE `quizzes` (
--                            `id` int(11) NOT NULL AUTO_INCREMENT,
--                            `title` varchar(255) DEFAULT NULL,
--                            `description` tinytext DEFAULT NULL,
--                            `created_by` int(11) DEFAULT NULL,
--                            `created_at` datetime DEFAULT current_timestamp(),
--                            `category_id` int(11) DEFAULT NULL,
--                            `is_published` tinyint(1) NOT NULL DEFAULT 1,
--                            `image` varchar(255) DEFAULT NULL,
--                            `total_questions` int(11) NOT NULL DEFAULT 0,
--                            PRIMARY KEY (`id`),
--                            UNIQUE KEY `id` (`id`),
--                            KEY `created_by` (`created_by`),
--                            KEY `category_id` (`category_id`),
--                            CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
--                            CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 4: Create questions table (references quizzes)
-- CREATE TABLE `questions` (
--                              `id` int(11) NOT NULL AUTO_INCREMENT,
--                              `quiz_id` int(11) DEFAULT NULL,
--                              `question` varchar(255) DEFAULT NULL,
--                              `created_at` datetime DEFAULT current_timestamp(),
--                              PRIMARY KEY (`id`),
--                              UNIQUE KEY `id` (`id`),
--                              KEY `quiz_id` (`quiz_id`),
--                              CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 5: Create question_choice table (references questions)
-- CREATE TABLE `question_choice` (
--                                    `id` int(11) NOT NULL AUTO_INCREMENT,
--                                    `question_id` int(11) DEFAULT NULL,
--                                    `text` varchar(255) DEFAULT NULL,
--                                    `is_correct` tinyint(1) DEFAULT 0,
--                                    PRIMARY KEY (`id`),
--                                    UNIQUE KEY `id` (`id`),
--                                    KEY `question_id` (`question_id`),
--                                    CONSTRAINT `question_choice_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 6: Create results table (references users and quizzes)
-- CREATE TABLE `results` (
--                            `id` int(11) NOT NULL AUTO_INCREMENT,
--                            `user_id` int(11) DEFAULT NULL,
--                            `quiz_id` int(11) DEFAULT NULL,
--                            `completed_at` datetime DEFAULT current_timestamp(),
--                            `score` int(11) DEFAULT NULL,
--                            `submitted_time` int(11) DEFAULT 0,
--                            PRIMARY KEY (`id`),
--                            UNIQUE KEY `id` (`id`),
--                            KEY `user_id` (`user_id`),
--                            KEY `quiz_id` (`quiz_id`),
--                            CONSTRAINT `results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
--                            CONSTRAINT `results_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 7: Create question_result table (references results, questions, and question_choice)
-- CREATE TABLE `question_result` (
--                                    `id` int(11) NOT NULL AUTO_INCREMENT,
--                                    `result_id` int(11) DEFAULT NULL,
--                                    `question_id` int(11) DEFAULT NULL,
--                                    `selected_choice_id` int(11) DEFAULT NULL,
--                                    `is_correct` tinyint(1) DEFAULT 0,
--                                    PRIMARY KEY (`id`),
--                                    UNIQUE KEY `id` (`id`),
--                                    KEY `result_id` (`result_id`),
--                                    KEY `question_id` (`question_id`),
--                                    KEY `selected_choice_id` (`selected_choice_id`),
--                                    CONSTRAINT `question_result_ibfk_1` FOREIGN KEY (`result_id`) REFERENCES `results` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
--                                    CONSTRAINT `question_result_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
--                                    CONSTRAINT `question_result_ibfk_3` FOREIGN KEY (`selected_choice_id`) REFERENCES `question_choice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- -- Step 8: Create token table (references users)
-- CREATE TABLE `token` (
--                          `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
--                          `token` varchar(255) NOT NULL,
--                          `expirationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
--                          `revoked` tinyint(1) NOT NULL,
--                          `expired` tinyint(1) NOT NULL,
--                          `userId` int(11) NOT NULL,
--                          PRIMARY KEY (`id`),
--                          KEY `userId` (`userId`),
--                          CONSTRAINT `token_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
