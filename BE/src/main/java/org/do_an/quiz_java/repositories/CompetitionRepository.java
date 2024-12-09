package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.Competition;
import org.do_an.quiz_java.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Integer> {
    Competition findByCode(String code);

    List<Competition> findByOrganizedBy(User user);
}