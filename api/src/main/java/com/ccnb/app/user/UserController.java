package com.ccnb.app.user;

import com.ccnb.app.common.ApiException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository, CampusRepository campusRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.campusRepository = campusRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return UserResponse.from(loadCurrentUser(authentication));
    }

    @PatchMapping("/me")
    public UserResponse updateProfile(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        User user = loadCurrentUser(authentication);
        Campus campus = campusRepository
                .findById(request.campusId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setCampus(campus);
        User saved = userRepository.save(user);

        // Build the response from the `campus` we already fetched rather than saved.getCampus():
        // save() on a detached entity merges it, and the merged copy re-attaches associations as
        // lazy proxies regardless of what was set beforehand, so reading it here (post-transaction)
        // would throw LazyInitializationException.
        return new UserResponse(
                saved.getId(),
                saved.getEmail(),
                saved.getFirstName(),
                saved.getLastName(),
                CampusResponse.from(campus),
                saved.getRoles());
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        User user = loadCurrentUser(authentication);
        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Mot de passe actuel invalide");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    private User loadCurrentUser(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        return userRepository
                .findByIdWithCampus(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }
}
