package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.Category;
import org.do_an.quiz_java.model.Quiz;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.respones.quiz.QuizResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    Page<Quiz> findByIsPublishedTrue(Pageable pageable);

    List<Quiz> findByCreatedBy(User user);

    @Query("select q from Quiz q where q.title like %?1% and q.isPublished = true and q.competitionQuizzes IS EMPTY and q.isPublished = true")
    Page<Quiz> searchByName(String name, Pageable pageable);

    @Query("select q from Quiz q where q.id = :id")
    Quiz findByQuizId(Integer id);


    @Query("select q from Quiz q where q.category = :category and q.competitionQuizzes IS EMPTY and q.isPublished = true")
    List<Quiz> findByCategory(Category category);



    @Query("SELECT q FROM Quiz q WHERE q.category.id = :categoryId AND q.category.name LIKE %:name% and q.competitionQuizzes IS EMPTY and q.isPublished = true")
    List<Quiz> findByCategoryNameContaining(@Param("name") String name, @Param("categoryId") Integer categoryId);

    @Override
    @Query("SELECT q FROM Quiz q WHERE q.competitionQuizzes IS EMPTY AND q.isPublished = true ORDER BY  q.category.id ASC")
    List<Quiz> findAll();
}