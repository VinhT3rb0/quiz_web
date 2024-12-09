package org.do_an.quiz_java.respones.question;

import lombok.*;
import org.do_an.quiz_java.model.Question;
import org.do_an.quiz_java.respones.questionChoice.QuestionChoiceResponse;

import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Integer id;
    private String question;
    private String createdAt;
    private String quizId;
    List<QuestionChoiceResponse> questionChoice;

    public static QuestionResponse fromEntity(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .createdAt(question.getCreatedAt().toString())
                .quizId(question.getQuiz().getId().toString())
                .questionChoice(QuestionChoiceResponse.fromEntityList(question.getQuestionChoice()))
                .build();
    }

    public static List<QuestionResponse> fromEntityList(List<Question> questions) {
        List<QuestionResponse> questionResponses = new java.util.ArrayList<>();
        for (Question question : questions) {
            questionResponses.add(QuestionResponse.fromEntity(question));
        }
        return questionResponses;
    }
}
