package org.do_an.quiz_java.respones.result;

import lombok.*;
import org.do_an.quiz_java.model.SelectedChoice;

import java.util.ArrayList;
import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SelectedChoiceResponse {
    Integer id;
    Integer choiceId;
    String choiceText;
    Boolean isCorrect;
    public static SelectedChoiceResponse fromEntity(SelectedChoice selectedChoice){
        return SelectedChoiceResponse.builder()
                .id(selectedChoice.getId())
                .choiceId(selectedChoice.getChoice().getId())
                .choiceText(selectedChoice.getChoice().getText())
                .isCorrect(selectedChoice.getChoice().getIsCorrect())
                .build();
    }

    public static List<SelectedChoiceResponse> fromEntityList(List<SelectedChoice> selectedChoices){
        List<SelectedChoiceResponse> selectedChoiceResponses = new ArrayList<>();
        for (SelectedChoice selectedChoice : selectedChoices){
            selectedChoiceResponses.add(SelectedChoiceResponse.fromEntity(selectedChoice));
        }
        return selectedChoiceResponses;
    }
}
