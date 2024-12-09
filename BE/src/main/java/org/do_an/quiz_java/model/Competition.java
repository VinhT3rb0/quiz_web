package org.do_an.quiz_java.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Builder
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "competition")
public class Competition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JoinColumn(name = "quiz_id")
//    private Quiz quiz;

    @Column(name = "time")
    private Integer time;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Column(name = "start_time")
    private Instant startTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organized_by")
    private User organizedBy;

    @Size(max = 6)
    @Column(name = "code", length = 6)
    private String code;

    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompetitionQuiz> competitionQuizzes = new ArrayList<>();

    @PrePersist
    public void generateCompetitionCode() {
        if (this.code == null || this.code.isEmpty()) {
            this.code = generateRandomCode();
        }
    }

    // Sinh mã 6 chữ số
    private String generateRandomCode() {
        Random random = new Random();
        int randomNumber = random.nextInt(999999);
        return String.format("%06d", randomNumber);  // Tạo chuỗi 6 chữ số, thêm số 0 nếu cần
    }

}