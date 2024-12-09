package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.CompetitionQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetitionQuizRepository extends JpaRepository<CompetitionQuiz, Integer> {
}