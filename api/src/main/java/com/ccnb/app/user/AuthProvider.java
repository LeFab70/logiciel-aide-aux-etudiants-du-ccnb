package com.ccnb.app.user;

/**
 * Tracks how a user proves their identity. LOCAL is the only supported provider in v1;
 * CCNB_SSO is reserved for when CCNB IT exposes an SSO/API the app can integrate against.
 */
public enum AuthProvider {
    LOCAL,
    CCNB_SSO
}
