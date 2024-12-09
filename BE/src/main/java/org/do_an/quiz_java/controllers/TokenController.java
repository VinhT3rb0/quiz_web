package org.do_an.quiz_java.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.respones.Response;
import org.do_an.quiz_java.services.TokenService;
import org.do_an.quiz_java.utils.JwtGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.v1.prefix:/api/v1}/tokens")
@RequiredArgsConstructor
@Slf4j
public class TokenController {
    private final TokenService tokenService;
    private final JwtGenerator jwtGenerator;
    @GetMapping("/{token}")
    public ResponseEntity<?> isValidToken(@PathVariable String token) {
        try {
            return ResponseEntity.ok().body(new Response("success", "Token is valid", jwtGenerator.isValidToken(token)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }
}
