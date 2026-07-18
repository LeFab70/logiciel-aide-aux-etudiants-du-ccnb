package com.ccnb.app.auth;

import com.ccnb.app.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final PendingRegistrationService pendingRegistrationService;
    private final CredentialAuthenticationService credentialAuthenticationService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(
            PendingRegistrationService pendingRegistrationService,
            CredentialAuthenticationService credentialAuthenticationService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.pendingRegistrationService = pendingRegistrationService;
        this.credentialAuthenticationService = credentialAuthenticationService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<PendingRegistrationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pendingRegistrationService.startRegistration(request));
    }

    @PostMapping("/verify-email")
    public AuthResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        User user = pendingRegistrationService.verify(request);
        return issueTokens(user);
    }

    @PostMapping("/resend-code")
    public PendingRegistrationResponse resendCode(@Valid @RequestBody ResendCodeRequest request) {
        return pendingRegistrationService.resend(request);
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
