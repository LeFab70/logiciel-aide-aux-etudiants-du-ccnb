package com.ccnb.app.auth;

import com.ccnb.app.common.ApiException;
import com.ccnb.app.common.HashUtil;
import com.ccnb.app.user.Campus;
import com.ccnb.app.user.CampusRepository;
import com.ccnb.app.user.Role;
import com.ccnb.app.user.User;
import com.ccnb.app.user.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PendingRegistrationService {

    private static final Logger log = LoggerFactory.getLogger(PendingRegistrationService.class);
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSender emailSender;
    private final long codeTtlMinutes;
    private final SecureRandom secureRandom = new SecureRandom();

    public PendingRegistrationService(
            PendingRegistrationRepository pendingRegistrationRepository,
            UserRepository userRepository,
            CampusRepository campusRepository,
            PasswordEncoder passwordEncoder,
            EmailSender emailSender,
            @Value("${ccnb.verification.code-ttl-minutes}") long codeTtlMinutes) {
        this.pendingRegistrationRepository = pendingRegistrationRepository;
        this.userRepository = userRepository;
        this.campusRepository = campusRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSender = emailSender;
        this.codeTtlMinutes = codeTtlMinutes;
    }

    public PendingRegistrationResponse startRegistration(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
        }
        Campus campus = campusRepository
                .findById(request.campusId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));

        pendingRegistrationRepository.deleteByEmail(request.email());

        PendingRegistration pending = new PendingRegistration();
        pending.setEmail(request.email());
        pending.setPasswordHash(passwordEncoder.encode(request.password()));
        pending.setFirstName(request.firstName());
        pending.setLastName(request.lastName());
        pending.setCampusId(campus.getId());
        Instant expiresAt = applyFreshCode(pending);
        pendingRegistrationRepository.save(pending);

        return new PendingRegistrationResponse(pending.getEmail(), expiresAt);
    }

    public User verify(VerifyEmailRequest request) {
        PendingRegistration pending = pendingRegistrationRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND, "Aucune inscription en attente pour cet email"));

        if (pending.getExpiresAt().isBefore(Instant.now())) {
            pendingRegistrationRepository.delete(pending);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Code expiré, veuillez recommencer l'inscription");
        }

        if (!HashUtil.sha256(request.code()).equals(pending.getCodeHash())) {
            pending.setAttempts(pending.getAttempts() + 1);
            if (pending.getAttempts() >= MAX_ATTEMPTS) {
                pendingRegistrationRepository.delete(pending);
                throw new ApiException(
                        HttpStatus.BAD_REQUEST, "Trop de tentatives, veuillez recommencer l'inscription");
            }
            pendingRegistrationRepository.save(pending);
            int remaining = MAX_ATTEMPTS - pending.getAttempts();
            throw new ApiException(
                    HttpStatus.BAD_REQUEST, "Code invalide, il reste " + remaining + " tentative(s)");
        }

        Campus campus = campusRepository
                .findById(pending.getCampusId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));

        User user = new User();
        user.setEmail(pending.getEmail());
        user.setPasswordHash(pending.getPasswordHash());
        user.setFirstName(pending.getFirstName());
        user.setLastName(pending.getLastName());
        user.setCampus(campus);
        user.getRoles().add(Role.STUDENT);
        user = userRepository.save(user);

        pendingRegistrationRepository.delete(pending);
        return user;
    }

    public PendingRegistrationResponse resend(ResendCodeRequest request) {
        PendingRegistration pending = pendingRegistrationRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND, "Aucune inscription en attente pour cet email"));

        if (pending.getLastSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(Instant.now())) {
            throw new ApiException(
                    HttpStatus.TOO_MANY_REQUESTS, "Veuillez patienter avant de redemander un code");
        }

        Instant expiresAt = applyFreshCode(pending);
        pendingRegistrationRepository.save(pending);
        return new PendingRegistrationResponse(pending.getEmail(), expiresAt);
    }

    /** Generates a fresh 6-digit code, hashes+stores it on the entity, sends the email, and returns expiresAt. */
    private Instant applyFreshCode(PendingRegistration pending) {
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        Instant now = Instant.now();
        Instant expiresAt = now.plus(codeTtlMinutes, ChronoUnit.MINUTES);

        pending.setCodeHash(HashUtil.sha256(code));
        pending.setAttempts(0);
        pending.setLastSentAt(now);
        pending.setExpiresAt(expiresAt);

        log.info("Code de vérification pour {} (dev only): {}", pending.getEmail(), code);
        emailSender.send(
                pending.getEmail(),
                "Code de vérification - App CCNB",
                "Bonjour "
                        + pending.getFirstName()
                        + ",\n\nVoici ton code de vérification : "
                        + code
                        + "\n\nCe code expire dans "
                        + codeTtlMinutes
                        + " minutes.");

        return expiresAt;
    }
}
