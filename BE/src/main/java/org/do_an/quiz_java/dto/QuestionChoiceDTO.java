package org.do_an.quiz_java.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;

/**
 * DTO for {@link org.do_an.quiz_java.model.QuestionChoice}
 */
@Value
@Builder
public class QuestionChoiceDTO {
    @NotNull
    String text;
    @NotNull
    Boolean isCorrect;
}