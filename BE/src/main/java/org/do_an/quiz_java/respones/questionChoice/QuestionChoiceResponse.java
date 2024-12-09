package org.do_an.quiz_java.respones.questionChoice;

import lombok.*;
import org.do_an.quiz_java.model.QuestionChoice;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class QuestionChoiceResponse {

    private Integer id;
    private String text;
    private Boolean isCorrect;

    public static QuestionChoiceResponse fromEntity(QuestionChoice questionChoice) {
        return QuestionChoiceResponse.builder()
                .id(questionChoice.getId())
                .text(questionChoice.getText())
                .isCorrect(questionChoice.getIsCorrect())
                .build();
    }

    public static List<QuestionChoiceResponse> fromEntityList(List<QuestionChoice> questionChoices) {
        List<QuestionChoiceResponse> questionChoiceResponses = new java.util.ArrayList<>();
        for(QuestionChoice questionChoice : questionChoices) {
            questionChoiceResponses.add(QuestionChoiceResponse.fromEntity(questionChoice));
        }
        return questionChoiceResponses;
    }
}
