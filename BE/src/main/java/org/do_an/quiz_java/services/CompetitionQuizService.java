package org.do_an.quiz_java.services;

import lombok.RequiredArgsConstructor;
import org.do_an.quiz_java.model.CompetitionQuiz;
import org.do_an.quiz_java.model.Quiz;
import org.do_an.quiz_java.repositories.CompetitionQuizRepository;
import org.do_an.quiz_java.repositories.CompetitionRepository;
import org.do_an.quiz_java.repositories.QuizRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompetitionQuizService {
    private final CompetitionQuizRepository competitionQuizRepository;
    private final CompetitionRepository competitionRepository;
    private final QuizRepository quizRepository;
    public  void save(Quiz quiz, Integer competitionId) {
        CompetitionQuiz competitionQuiz = CompetitionQuiz.builder()
                .competition(competitionRepository.findById(competitionId).get())
                .quiz(quiz)
                .build();
        competitionQuizRepository.save(competitionQuiz);
    }



}
