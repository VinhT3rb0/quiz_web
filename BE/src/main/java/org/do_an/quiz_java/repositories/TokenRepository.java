package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.Token;
import org.do_an.quiz_java.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findByToken(String token);
    Token findByUser(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM Token t WHERE t = ?1")
    void deleteToken(Token token);
    void deleteByUser(User user);
}