package org.do_an.quiz_java.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.dto.*;
import org.do_an.quiz_java.model.Token;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.repositories.UserRepository;
import org.do_an.quiz_java.respones.Response;
import org.do_an.quiz_java.respones.quiz.QuizResponse;
import org.do_an.quiz_java.respones.user.LoginResponse;
import org.do_an.quiz_java.respones.user.UserResponse;
import org.do_an.quiz_java.services.TokenService;
import org.do_an.quiz_java.services.UserService;
import org.modelmapper.ModelMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.v1.prefix:/api/v1}/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final TokenService tokenService;
    private final ModelMapper modelMapper;

    @PostMapping("/login")
    public ResponseEntity<Response> login(
            @RequestBody @Valid UserLoginDTO userLoginDTO
    ) {

        try {
            LoginResponse loginResponse = userService.login(userLoginDTO.getUsername(), userLoginDTO.getPassword());

//            User userLoginDetail = userService.getUserDetailFromToken(tokenGenerate);
//                User userLoginDetail = userRepository.findByUsername(userLoginDTO.getUsername()).orElseThrow(() -> new Exception("User not found"));
//            Token token = tokenService.addToken(userLoginDetail, tokenGenerate); // Save token to database


//            loginResponse.setRole(token.getUser()
//                    .getAuthorities()
//                    .stream()
//                    .map(GrantedAuthority::getAuthority).collect(Collectors.toList()));

            return ResponseEntity.ok().body(new Response("success", "Login successful", loginResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Response> create(@RequestBody @Valid UserDTO userDTO) {
        try {

            return ResponseEntity.ok().body(new Response("success", "User created successfully", UserResponse.fromUser(userService.createUser(userDTO))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyUserDTO verifyUserDTO) {
        try {
            userService.verifyUser(verifyUserDTO);
            return ResponseEntity.ok("User verified successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }

    }

    @PostMapping("/resend-verification/{email}")
    public ResponseEntity<?> resendVerification(@PathVariable String email) {
        try {
            userService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }
    @PutMapping("/update")
    public ResponseEntity<Response> update(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdateUserDTO updateUserDTO
    ) {
        try {
                User userDTOUpdated = userService.updateInfo(user.getId() , updateUserDTO);
                return ResponseEntity.ok().body(new Response("success", "User updated successfully", UserResponse.fromUser(userDTOUpdated)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<Response> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdatePasswordDTO updatePasswordDTO
    ) {
        try {
            User userDTOUpdated = userService.updatePassword(user.getId() , updatePasswordDTO);
            return ResponseEntity.ok().body(new Response("success", "User updated successfully", UserResponse.fromUser(userDTOUpdated)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Response> delete(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok().body(new Response("success", "User deleted successfully", UserResponse.fromUser( userService.deleteUserByUserId(userId))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    @PostMapping("/forgot-password/{email}")
    public ResponseEntity<?> forgotPassword(@PathVariable String email) {
        try {
            userService.forgotPassword(email);
            return ResponseEntity.ok("Password reset email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    @GetMapping(value = "/me")
    //@PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> getProfile(@AuthenticationPrincipal User user) {
        try {
            log.info("User: {}", user );
            User userDetail = userRepository.findById(user.getId()).orElseThrow(() -> new Exception("User not found"));
            return ResponseEntity.ok().body(new Response("success", "User detail", UserResponse.fromUser(userDetail)));
        } catch (Exception e) {
            log.error("Error fetching user details", e);
            return ResponseEntity.badRequest().body(new Response("error", e.getMessage(), null));
        }
    }

    //@PreAuthorize("isAuthenticated()")
//    @GetMapping("/me")
//    public UserResponse getProfile(@AuthenticationPrincipal User user) {
//            log.info("User: {}", user);
//        return UserResponse.fromUser(user);
//    }


}
