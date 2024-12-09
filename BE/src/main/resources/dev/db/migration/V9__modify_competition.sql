ALTER TABLE `competition`
DROP FOREIGN KEY `fk_competition_quiz`;


ALTER TABLE `competition`
DROP COLUMN `quiz_id`;

CREATE TABLE competition_quiz (
                                  id INT NOT NULL AUTO_INCREMENT,
                                  competition_id INT NOT NULL,
                                  quiz_id INT NOT NULL,
                                  PRIMARY KEY (id),
                                  UNIQUE KEY (competition_id, quiz_id),
                                  CONSTRAINT fk_competition
                                      FOREIGN KEY (competition_id) REFERENCES competition(id)
                                          ON DELETE CASCADE,
                                  CONSTRAINT fk_quiz
                                      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
                                          ON DELETE CASCADE
);

