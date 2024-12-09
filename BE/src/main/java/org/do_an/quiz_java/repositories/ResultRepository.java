package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.Competition;
import org.do_an.quiz_java.model.Result;
import org.do_an.quiz_java.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    List<Result> findByUser(User user);

    List<Result> findByCompetition(Competition competition);

    @Query("SELECT r FROM Result r WHERE r.user.id = :userId")
    List<Result> findByUserId(@Param("userId") Integer userId);
//    List<Result> findByUserId(Integer userId);

    boolean existsByUserAndCompetition(User user, Competition competition);
}