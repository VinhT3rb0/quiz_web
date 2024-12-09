package org.do_an.quiz_java.respones.competition;

import lombok.*;
import org.do_an.quiz_java.model.CompetitionQuiz;
import org.do_an.quiz_java.respones.quiz.QuizResponse;

import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionQuizResponse {
//    private Integer id;
    private Integer competitionId;
    private QuizResponse quizResponses;

    public static CompetitionQuizResponse fromEntity(CompetitionQuiz competitionQuiz) {
        return CompetitionQuizResponse.builder()
//                .id(competitionQuiz.getId())
                .competitionId(competitionQuiz.getCompetition().getId())
                .quizResponses(QuizResponse.fromEntity(competitionQuiz.getQuiz()))
                .build();
    }

    public static List<CompetitionQuizResponse> fromEntities(List<CompetitionQuiz> competitionQuizzes) {
        return competitionQuizzes.stream().map(CompetitionQuizResponse::fromEntity).toList();
    }
}
