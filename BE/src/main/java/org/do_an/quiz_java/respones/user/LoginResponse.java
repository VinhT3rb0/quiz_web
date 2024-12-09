package org.do_an.quiz_java.respones.user;


import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Integer id;
    private String username;
    private String email;
    private String token;
}
