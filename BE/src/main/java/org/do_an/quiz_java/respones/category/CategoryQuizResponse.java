package org.do_an.quiz_java.respones.category;

import lombok.*;
import org.do_an.quiz_java.respones.quiz.QuizResponse;

import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryQuizResponse {
    private Integer id;
    private String name;
    private Integer count;
    List<QuizResponse> quizResponses;

}
