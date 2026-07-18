package com.ccnb.app.auth;

import com.ccnb.app.common.ApiException;
import com.ccnb.app.user.Campus;
import com.ccnb.app.user.CampusRepository;
import com.ccnb.app.user.Role;
import com.ccnb.app.user.User;
import com.ccnb.app.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final PasswordEncoder passwordEncoder;
    private final CredentialAuthenticationService credentialAuthenticationService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(
            UserRepository userRepository,
            CampusRepository campusRepository,
            PasswordEncoder passwordEncoder,
            CredentialAuthenticationService credentialAuthenticationService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.campusRepository = campusRepository;
        this.passwordEncoder = passwordEncoder;
        this.credentialAuthenticationService = credentialAuthenticationService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
        }
        Campus campus = campusRepository
                .findById(request.campusId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setCampus(campus);
        user.getRoles().add(Role.STUDENT);
        user = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(issueTokens(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = credentialAuthenticationService.authenticate(request.email(), request.password());
        return issueTokens(user);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        User user = refreshTokenService.verifyAndConsume(request.refreshToken());
        return issueTokens(user);
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.issue(user);
        return new AuthResponse(accessToken, refreshToken);
    }
}
