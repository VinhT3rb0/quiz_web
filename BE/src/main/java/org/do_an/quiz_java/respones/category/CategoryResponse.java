package org.do_an.quiz_java.respones.category;

import lombok.*;
import org.do_an.quiz_java.model.Category;

import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer id;
    private String name;

    public static CategoryResponse fromEntity(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    public static List<CategoryResponse> fromEntities(List<Category> categories) {
        return categories.stream().map(CategoryResponse::fromEntity).toList();
    }

}
