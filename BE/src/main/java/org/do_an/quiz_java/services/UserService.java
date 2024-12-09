package org.do_an.quiz_java.services;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.dto.UpdatePasswordDTO;
import org.do_an.quiz_java.dto.UpdateUserDTO;
import org.do_an.quiz_java.dto.UserDTO;
import org.do_an.quiz_java.dto.VerifyUserDTO;
import org.do_an.quiz_java.exceptions.DataNotFoundException;
import org.do_an.quiz_java.model.Token;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.repositories.TokenRepository;
import org.do_an.quiz_java.repositories.UserRepository;
import org.do_an.quiz_java.respones.user.LoginResponse;
import org.do_an.quiz_java.utils.JwtGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService  {
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;

    private final TokenRepository tokenRepository;
//    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtGenerator jwtGenerator;
    private final ModelMapper modelMapper;



    @Transactional
    public User createUser(UserDTO userDTO) throws Exception {


        // Check if username already exists
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new DataIntegrityViolationException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DataIntegrityViolationException("Email already exists");
        }


        // Create User entity
        User newUser = User.builder()
                .email(userDTO.getEmail())
                .username(userDTO.getUsername())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .verificationCode(generateVerificationCode())
                .active(false)
                .verificationExpiration(LocalDateTime.now().plusMinutes(15))
                .build();
        //emailService.sendEmail(newUser.getEmail(),"Verification code" , "123");
        try {
            sendVerificationEmail(newUser);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        // Save User entity to generate ID
        newUser = userRepository.save(newUser);

        return userRepository.save(newUser);
    }

    public void verifyUser(VerifyUserDTO verifyUserDTO) throws Exception {
        User user = userRepository.findByEmail(verifyUserDTO.getEmail())
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        if (user.getVerificationCode().equals(verifyUserDTO.getVerificationCode())
                && user.getVerificationExpiration().isAfter(LocalDateTime.now())) {
            user.setActive(true);
            user.setVerificationCode(null);
            user.setVerificationExpiration(null);
            user.setPoint(100);
            userRepository.save(user);
        } else {
            throw new DataNotFoundException("Invalid verification code");
        }
    }

    public void resendVerificationCode(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User findByEmail not found" + email));
        if(user.getActive()) {
            throw new DataNotFoundException("User already verified " );
        }
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        sendVerificationEmail(user);
    }

    public void sendVerificationEmail(User user) throws MessagingException {
        String subject = "Verification code";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            user.setVerificationCode(verificationCode);
            user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }
    private String generateVerificationCode() {

        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
    @Transactional
    public LoginResponse login(String username, String password) throws Exception {
        User userExist = userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("User not exist")); // 1
        if (!passwordEncoder.matches(password, userExist.getPassword())) {
            throw new BadCredentialsException("Password not match");
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                username, password, userExist.getAuthorities()
        );
        authenticationManager.authenticate(authenticationToken);
        Token userToken = tokenRepository.findByUser(userExist);
        String token;
        try {
            if(jwtGenerator.isValidToken(userToken.getToken())){
                token= userToken.getToken();
            }else {
                token= tokenService.addToken(userExist, jwtGenerator.generateToken(userExist)).getToken();
            }
        }catch (Exception e){
            token= tokenService.addToken(userExist, jwtGenerator.generateToken(userExist)).getToken();
        }

        LoginResponse loginResponse = modelMapper.map(userExist, LoginResponse.class);
        loginResponse.setToken(token);
        return loginResponse;
    }

    @Transactional
    public User getUserDetailFromToken(String token) throws Exception {
        String username = jwtGenerator.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new DataNotFoundException("User not found"));

        return user;
    }

    @Transactional(rollbackFor = Exception.class)
    public User updateInfo(Integer userId, UpdateUserDTO updatedUserDTO) throws Exception {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        // update user
        if (updatedUserDTO.getFullName() != null) {
            existingUser.setFullName(updatedUserDTO.getFullName());
        }

        if (updatedUserDTO.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUserDTO.getPhoneNumber());
        }
//
//        if (updatedUserDTO.getAddress() != null) {
//            existingUser.setAddress(updatedUserDTO.getAddress());
//        }
        if (updatedUserDTO.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updatedUserDTO.getDateOfBirth());
        }

        if (updatedUserDTO.getEmail() != null) {
            existingUser.setEmail(updatedUserDTO.getEmail());
        }

        if (updatedUserDTO.getUsername() != null) {
            existingUser.setUsername(updatedUserDTO.getUsername());
        }

        return userRepository.save(existingUser);

    }
    @Transactional(rollbackFor = Exception.class)
    public User updatePassword(Integer userId, UpdatePasswordDTO updatePasswordDTO) throws Exception {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!passwordEncoder.matches(updatePasswordDTO.getPassword(), existingUser.getPassword())) {
            throw new BadCredentialsException("Password not match");
        }
        if (updatePasswordDTO.getNewPassword() != null
                && !updatePasswordDTO.getNewPassword().isEmpty()) {
            if (!updatePasswordDTO.getNewPassword().equals(updatePasswordDTO.getRetypePassword())) { // check retype password
                throw new DataNotFoundException("Password not match");
            }

            String newPassword = updatePasswordDTO.getNewPassword();
            String encodePassword = passwordEncoder.encode(newPassword);
            existingUser.setPassword(encodePassword);
        }
        return userRepository.save(existingUser);

    }
    @Transactional
    public User deleteUserByUserId(Integer userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        boolean isAdmin = user.getAuthorities().stream().anyMatch(grantedAuthority -> grantedAuthority.toString().equals("ROLE_ADMIN"));
        if (isAdmin) {
            throw new IllegalStateException("Cannot delete admin account");
        }
        userRepository.delete(user);
        return user;

    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    private void sendEmail(User user, String subject, String template, String urlAttribute, String urlPath) throws MessagingException {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("username", user.getUsername());
        attributes.put(urlAttribute, "http://" + "localhost:8080" + urlPath);
        emailService.sendMessageHtml(user.getEmail(), subject, template, attributes);
    }


    public void forgotPassword(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        String newPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        sendForgotPasswordEmail(email, newPassword);
    }

    public void sendForgotPasswordEmail(String email ,String newPassword) throws MessagingException {
        String subject = "Forgot password";
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Forgot password?</h2>"
                + "<p style=\"font-size: 16px;\">Your new password is below:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">New Password:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + newPassword + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(email, subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }

//    public String generateAuthUrl(String loginType) {
//        String url = "";
//        loginType = loginType.trim().toLowerCase(); // Normalize the login type
//
////        if ("google".equals(loginType)) {
////            GoogleAuthorizationCodeRequestUrl urlBuilder = new GoogleAuthorizationCodeRequestUrl(
////                    googleClientId,
////                    googleRedirectUri,
////                    Arrays.asList("email", "profile", "openid"));
////            url = urlBuilder.build();
////        } else if ("facebook".equals(loginType)) {
////            /*
////            url = String.format("https://www.facebook.com/v3.2/dialog/oauth?client_id=%s&redirect_uri=%s&scope=email,public_profile&response_type=code",
////                    facebookClientId, facebookRedirectUri);
////             */
////            url = UriComponentsBuilder
////                    .fromUriString(facebookAuthUri)
////                    .queryParam("client_id", facebookClientId)
////                    .queryParam("redirect_uri", facebookRedirectUri)
////                    .queryParam("scope", "email,public_profile")
////                    .queryParam("response_type", "code")
////                    .build()
////                    .toUriString();
////        }
//        GoogleAuthorizationCodeRequestUrl urlBuilder = new GoogleAuthorizationCodeRequestUrl(
//                googleClientId,
//                googleRedirectUri,
//                Arrays.asList("email", "profile", "openid"));
//        url = urlBuilder.build();
//        return url;
//    }

}
