package org.do_an.quiz_java.dto;


import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Setter
@Getter
@Builder
public class UpdateUserDTO {
    private String username;
    @Pattern(regexp = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$", message = "Invalid email")
    private String email;
    private String fullName;
    private String phoneNumber;
    private Date dateOfBirth;
}
