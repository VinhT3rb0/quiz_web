package org.do_an.quiz_java.filter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.exceptions.TokenExpiredException;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.utils.JwtGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtGenerator jwtGenerator;
    private final UserDetailsService userDetailsService;

    @Value("${api.v1.prefix}")
    private String apiPrefix;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            final String authorizationHeader = request.getHeader("Authorization");

            if (isNonAuthRequest(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String username = jwtGenerator.extractUsername(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User user = (User) userDetailsService.loadUserByUsername(username);

                    try {
                        if (jwtGenerator.isValidToken(token)) {  // Ensure the token is valid for the user
                            UsernamePasswordAuthenticationToken authenticationToken =
                                    new UsernamePasswordAuthenticationToken(
                                            user,
                                            null,
                                            user.getAuthorities());

                            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                            filterChain.doFilter(request, response);
                        } else {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Invalid Token");
                        }
                    } catch (TokenExpiredException e) {
                        log.error("An error occurred: " + e.getMessage());
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("Token has expired: " + e.getMessage());
                    }
                }
            } else {

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Authorization header is missing or invalid");
            }
        } catch (Exception e) {
            log.error("An error occurred: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("An error occurred: " + e.getMessage());
        }
    }

    private boolean isNonAuthRequest(HttpServletRequest request) {
        final List<Pair<String, String>> nonAuthRequests = List.of(
                // Swagger
                Pair.of("/swagger-ui/**", "GET"),
                Pair.of("/v3/api-docs/**", "GET"),
                Pair.of("/v3/api-docs", "GET"),
                Pair.of("/swagger-resources", "GET"),
                Pair.of("/swagger-resources/**", "GET"),
                Pair.of("/configuration/ui", "GET"),
                Pair.of("/configuration/security", "GET"),
                Pair.of("/swagger-ui/**", "GET"),
                Pair.of("/swagger-ui.html", "GET"),
                Pair.of("/swagger-ui/index.html", "GET"),

                // heath check
                Pair.of("/actuator", "GET"),
                Pair.of("/actuator/**", "GET"),

                // Auth
                Pair.of(String.format("%s/users/login", apiPrefix), "POST"),
//                Pair.of(String.format("%s/users/**", apiPrefix), "PUT"),
                //Pair.of(String.format("%s/users/**", apiPrefix), "GET"),
                Pair.of(String.format("%s/users/create", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/verify", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/resend-verification/**", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/forgot-password/**", apiPrefix), "POST"),

                //Me
                //Pair.of(String.format("%s/users/me/**", apiPrefix), "GET"),

                Pair.of(String.format("%s/tokens/**", apiPrefix), "GET"),
                Pair.of("/home", "GET"),
                //Pair.of("/", "GET"),

//                Pair.of(String.format("%s/login/oauth2/code/**", apiPrefix), "GET"),
//                Pair.of(String.format("/login/oauth2/code/**", apiPrefix), "POST"),
                Pair.of("/login", "GET"),
                Pair.of("/login/oauth2/code/**", "GET"),
                Pair.of("/login/oauth2/code/**", "POST"),


                Pair.of(String.format("%s/oauth/**", apiPrefix), "GET"),
                Pair.of(String.format("%s/oauth/**", apiPrefix), "POST"),

//                Pair.of(String.format("%s/roles", apiPrefix), "GET"),

                //Web-setting
                Pair.of(String.format("%s/web-settings", apiPrefix), "GET"),
                Pair.of(String.format("%s/web-settings/**", apiPrefix), "PUT"),


                // Category
                Pair.of(String.format("%s/category/getAll", apiPrefix),"GET"),
//                Pair.of(String.format("%s/categories/**", apiPrefix),"POST"),

                // Quiz
                Pair.of(String.format("%s/quizs/getAllQuiz", apiPrefix),"GET"),
                Pair.of(String.format("%s/quizs/category/**", apiPrefix),"GET"),
                Pair.of(String.format("%s/quizs", apiPrefix),"GET"),
                Pair.of(String.format("%s/quizs/getAllQuizByCategory", apiPrefix),"GET"),

                //home
                Pair.of("/home/**", "GET"),

                // device token

                Pair.of(String.format("%s/device-tokens", apiPrefix), "POST")


        );

        String requestPath = request.getServletPath();
        String requestMethod = request.getMethod();

        for (Pair<String, String> nonAuthRequest : nonAuthRequests) {
            String path = nonAuthRequest.getFirst();
            String method = nonAuthRequest.getSecond();


            if (requestPath.matches(path.replace("**", ".*"))
                    && requestMethod.equalsIgnoreCase(method)) {
                return true;
            }

        }

        return false;
    }

}
