package org.do_an.quiz_java.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.exceptions.TokenExpiredException;
import org.do_an.quiz_java.model.Token;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.repositories.TokenRepository;
import org.do_an.quiz_java.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtGenerator {
    @Value("${jwt.secret.key}")
    private String secretKey;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    public String generateToken(User user) {
//        User foundUser = userRepository.findByUsername(user.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return JWT.create()
                .withSubject(user.getUsername())
                .withClaim("roles", roles)
//                .withExpiresAt(new Date(System.currentTimeMillis() + 864000000))
                .withExpiresAt(new Date(System.currentTimeMillis() + 864000000))

                .sign(Algorithm.HMAC256(secretKey));
    }

    public String extractUsername(String token) {
        DecodedJWT decodedJwt = getDecodedJwt(token);
        return decodedJwt.getSubject();
    }




    private Date getExpirationTime(String token) {
        DecodedJWT decodedJwt = getDecodedJwt(token);
        return decodedJwt.getExpiresAt();
    }


    public boolean isValidToken(String token) throws TokenExpiredException {
        String username = extractUsername(token);
        User userDetails = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Date expirationTime = getExpirationTime(token);
//        Token userToken = tokenRepository.findByUser(userDetails);
        if(expirationTime.before(new Date())) {
//            throw new TokenExpiredException("Token has expired");
            return false;
        }

        Token existingToken = tokenRepository.findByToken(token);

        if (token == null || existingToken == null) {
            return false;
        }
        return username.equals(userDetails.getUsername());
    }


    private DecodedJWT getDecodedJwt(String token) {
        return JWT.require(Algorithm.HMAC256(secretKey))
                .build()
                .verify(token);

    }


}
