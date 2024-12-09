package org.do_an.quiz_java.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Builder
public class UpdatePasswordDTO {
    private String password;
    private String newPassword;
    private String retypePassword;

}
