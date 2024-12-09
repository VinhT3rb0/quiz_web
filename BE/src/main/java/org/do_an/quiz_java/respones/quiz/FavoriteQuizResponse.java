package org.do_an.quiz_java.respones.quiz;

import lombok.*;
import org.do_an.quiz_java.model.FavoriteQuiz;

import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteQuizResponse {
    private Integer id;
    private QuizResponse quiz;

    public static FavoriteQuizResponse fromEntity(FavoriteQuiz favoriteQuiz) {
        return FavoriteQuizResponse.builder()
                .id(favoriteQuiz.getId())
                .quiz(QuizResponse.fromEntityPreview(favoriteQuiz.getQuiz()))
                .build();
    }
    public static List<FavoriteQuizResponse> fromEntities(List<FavoriteQuiz> favoriteQuizzes) {
        return favoriteQuizzes.stream().map(FavoriteQuizResponse::fromEntity).toList();
    }
}
