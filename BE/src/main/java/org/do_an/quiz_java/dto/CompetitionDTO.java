package org.do_an.quiz_java.dto;

import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link org.do_an.quiz_java.model.Competition}
 */
@Value
public class CompetitionDTO  {
    Integer time;
    @Size(max = 255)
    String name;
    @Size(max = 255)
    String description;
    Instant startTime;

}