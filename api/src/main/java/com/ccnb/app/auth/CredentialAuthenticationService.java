package com.ccnb.app.auth;

import com.ccnb.app.user.User;

/**
 * Isolates "how identity is proven" from the rest of the app. The only implementation today
 * checks email+password locally, but a future CCNB SSO (OIDC/SAML) integration can be added as
 * a separate inbound flow that resolves/creates the local User and hands it to the same JWT
 * issuance path in AuthController, without touching authorization or client apps.
 */
public interface CredentialAuthenticationService {

    User authenticate(String email, String rawPassword);
}
