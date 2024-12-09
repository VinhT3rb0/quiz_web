package org.do_an.quiz_java.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private Set<Token> tokens = new LinkedHashSet<>();

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name="verification_expiration")
    private LocalDateTime verificationExpiration;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name="date_of_birth")
    private Date dateOfBirth;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteQuiz> favoriteQuizzes;

    @Column(name="point")
    private Integer point;

    @Column(name="point_used")
    private Integer pointUsed;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
//        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
//
//        authorityList.add(new SimpleGrantedAuthority(getRoles().getRoleName().toUpperCase()));
//        return authorityList;
        return List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS")) ;}

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}