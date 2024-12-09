package org.do_an.quiz_java.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "results")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "total_correct")
    private Integer totalCorrect;

    @Column(name = "score")
    private Float score;

    @Column(name = "submitted_time")
    private Integer submittedTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionResult> questionResults;

    @PrePersist
    protected void onCreate() {
        this.completedAt = LocalDateTime.now();
    }
}



