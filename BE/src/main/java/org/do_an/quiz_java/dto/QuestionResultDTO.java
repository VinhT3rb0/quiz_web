package org.do_an.quiz_java.dto;

import lombok.Value;
import org.do_an.quiz_java.model.Question;

import java.util.List;

/**
 * DTO for {@link org.do_an.quiz_java.model.QuestionResult}
 */
@Value
public class QuestionResultDTO {

    Integer questionId;
    List<Integer> selectedChoiceIds;
}