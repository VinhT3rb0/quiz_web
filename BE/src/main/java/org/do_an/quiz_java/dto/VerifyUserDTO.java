package org.do_an.quiz_java.dto;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyUserDTO {
    private String email;
    private String verificationCode;
}
