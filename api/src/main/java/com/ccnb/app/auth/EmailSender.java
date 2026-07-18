package com.ccnb.app.auth;

/**
 * Isolates "how emails are delivered" so the SMTP-based implementation can be swapped for a
 * transactional email provider (SendGrid/Mailgun/SES) later without touching call sites.
 */
public interface EmailSender {

    void send(String to, String subject, String body);
}
