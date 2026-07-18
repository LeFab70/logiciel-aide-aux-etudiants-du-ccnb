package com.ccnb.app.auth;

import com.ccnb.app.user.User;
import com.ccnb.app.user.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LocalCredentialAuthenticationService implements CredentialAuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LocalCredentialAuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User authenticate(String email, String rawPassword) {
        User user = userRepository
                .findByEmail(email)
                .filter(User::isEnabled)
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe invalide"));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new BadCredentialsException("Email ou mot de passe invalide");
        }
        return user;
    }
}
