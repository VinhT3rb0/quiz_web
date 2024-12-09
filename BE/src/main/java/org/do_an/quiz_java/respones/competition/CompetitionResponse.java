package org.do_an.quiz_java.respones.competition;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.model.Competition;
import org.do_an.quiz_java.model.Quiz;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.respones.quiz.QuizResponse;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class CompetitionResponse {
    private String description;
    private Integer time;
    private String name;
    private Integer id;
    private String code;
    private List<CompetitionQuizResponse> competitionQuizResponses;
    private String organizedBy;
    private String startTime;
    private boolean isSubmited;
    public static CompetitionResponse fromEntity(Competition competition) {
        return CompetitionResponse.builder()
                .id(competition.getId())
                .description(competition.getDescription())
                .time(competition.getTime())
                .name(competition.getName())
                .code(competition.getCode())
                .competitionQuizResponses(competition.getCompetitionQuizzes() == null ? null : CompetitionQuizResponse.fromEntities(competition.getCompetitionQuizzes()))
                .organizedBy(competition.getOrganizedBy().getUsername())
                .startTime(competition.getStartTime().toString())
                .build();
    }
    public static CompetitionResponse fromEntityWithUser(Competition competition, User user) {
        return CompetitionResponse.builder()
                .id(competition.getId())
                .description(competition.getDescription())
                .time(competition.getTime())
                .name(competition.getName())
                .code(competition.getCode())
                .competitionQuizResponses(competition.getCompetitionQuizzes() == null ? null : CompetitionQuizResponse.fromEntities(competition.getCompetitionQuizzes()))
                .organizedBy(competition.getOrganizedBy().getUsername())
                .startTime(competition.getStartTime().toString())
                .build();
    }
    public static List<CompetitionResponse> fromEntities(List<Competition> competitions) {
        return competitions.stream().map(CompetitionResponse::fromEntity).collect(Collectors.toList());
    }

}
