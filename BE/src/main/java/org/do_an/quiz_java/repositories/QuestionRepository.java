package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.Question;
import org.do_an.quiz_java.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
//    int countByQuiz(Quiz quiz);
//
//    int countByQuizAndIsValidTrue(Quiz quiz);
//
//    List<Question> findByQuizOrderByOrderAsc(Quiz quiz);
//
//    List<Question> findByQuizAndIsValidTrueOrderByOrderAsc(Quiz quiz);

    //int countByQuizId(Integer quizId);

    List<Question> findByQuiz(Quiz quiz);

}