package org.do_an.quiz_java.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Value
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
public class ResultDTO {
    Integer quizId;
    List<QuestionResultDTO> questionResultDTOS;
    Float score;
    Integer totalCorrect;
    //LocalDateTime completedAt;
    Integer submittedTime;
    Integer competitionId = null;


}
