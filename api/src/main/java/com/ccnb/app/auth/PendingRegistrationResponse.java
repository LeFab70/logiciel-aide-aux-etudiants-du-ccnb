package com.ccnb.app.auth;

import java.time.Instant;

public record PendingRegistrationResponse(String email, Instant expiresAt) {
}
