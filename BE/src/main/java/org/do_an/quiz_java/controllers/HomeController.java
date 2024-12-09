package org.do_an.quiz_java.controllers;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.respones.Response;
import org.do_an.quiz_java.services.UserService;
import org.do_an.quiz_java.utils.JwtGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
@Tag(name = "Root", description = "Root for testing the API")
@Hidden
@Slf4j
public class HomeController {
    private BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtGenerator jwtGenerator;
    private final UserService userService;
    //private final OAuthAuthorizedClientService oauthAuthorizedClientService;

    @GetMapping("/test")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String test() {
        return """
                Welcome to FoodOrdering!:)
                Please check the API documentation at /api-docs
                Please check the API documentation at /swagger-ui.html
                Please check the API documentation at /redoc.html
                """;
    }
    @GetMapping("/home")
    public ResponseEntity<Object> home(@RequestParam String token) {
        return ResponseEntity.ok().body(token);

    }
    @GetMapping("/pay-success")
    public ResponseEntity<Response> paySuccess() {
        return ResponseEntity.ok().body(new Response("success", "pay-success", "Payment success"));
    }
}
    //@GetMapping("/")
//    public ResponseEntity<?> home(OAuth2AuthenticationToken oauth2Token, HttpServletResponse response) {
//        OAuth2AuthenticatedPrincipal oauth2Principal = oauth2Token.getPrincipal();
//        OAuth2AuthorizedClient authorizedClient = oauthAuthorizedClientService.loadAuthorizedClient(
//                oauth2Token.getAuthorizedClientRegistrationId(), oauth2Token.getName());
//        String name = oauth2Principal.getAttribute("name");
//        String email = oauth2Principal.getAttribute("email");
//
//        Optional<User> getUser = userService.findByEmail(email);
//
//
//        Random random = new Random();
//        int randomNumber = random.nextInt(9);
//        String randomNumberAsString = String.valueOf(randomNumber);
//
//        String jwt = null;
//        String cryptoPassword = "";
//
//        if (getUser.isPresent()) {
//            try {
//                User user = getUser.get();
//                cryptoPassword = passwordEncoder().encode(randomNumberAsString);
//                user.setPassword(cryptoPassword);
//                user.setUsername(name);
//                user.setEmail(email);
//
//                userService.save(user);
//
//                Authentication authentication = authenticationManager.authenticate(
//                        new UsernamePasswordAuthenticationToken(
//                                email,
//                                randomNumberAsString
//                        )
//                );
//                jwt = jwtGenerator.generateToken(user);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//        if (!getUser.isPresent()) {
////            UserDTO userDTO = new UserDTO();
////            userDTO.setUsername(name);
////            userDTO.setEmail(email);
////            userDTO.setPassword(randomNumberAsString);
//
//            User newUser = new User();
//            newUser.setUsername(name);
//            newUser.setEmail(email);
//            cryptoPassword = passwordEncoder().encode(randomNumberAsString);
//            newUser.setPassword(cryptoPassword);
//            userService.save(newUser);
//
//
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            email,
//                            randomNumberAsString
//                    )
//            );
//            jwt = jwtGenerator.generateToken(newUser);
//        }
//
//        jwt = jwt.replace("/", "-");
//        name = name.replace("/", "-");
//        email = email.replace("/", "-");
//        cryptoPassword = cryptoPassword.replace("/", "-");
//
//        try {
//            response.sendRedirect("http://localhost:3000/googleauth/" + jwt + "/" + name + "/" + email + "/" + cryptoPassword);
//
//            return ResponseEntity.ok().build();
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//}
