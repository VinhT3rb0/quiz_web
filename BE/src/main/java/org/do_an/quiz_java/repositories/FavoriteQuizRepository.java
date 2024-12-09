package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.FavoriteQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteQuizRepository extends JpaRepository<FavoriteQuiz, Integer> {

    List<FavoriteQuiz> findByUserId(Integer userId);

    FavoriteQuiz findByUserIdAndQuizId(Integer userId, Integer quizId);
}