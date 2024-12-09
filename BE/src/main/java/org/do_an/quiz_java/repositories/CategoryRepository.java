package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findById(Integer id);


    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.quizzes q WHERE q.isPublished = true AND q.competitionQuizzes IS EMPTY")
    List<Category> findAllWithQuizzes();
}