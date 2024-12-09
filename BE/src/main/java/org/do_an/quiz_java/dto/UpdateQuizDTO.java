package org.do_an.quiz_java.dto;

import lombok.*;
import org.do_an.quiz_java.model.Question;

import java.util.List;
@Value
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
public class UpdateQuizDTO {
    Integer id;
    String title;
    String description;
    Integer categoryId;
    List<Question> questions;
    Boolean isPublished;

}
