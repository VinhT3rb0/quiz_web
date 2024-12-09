package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.QuestionChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Integer> {
    List<QuestionChoice> findByQuestionIdAndIsCorrect(Integer questionId, Boolean isCorrect);
}