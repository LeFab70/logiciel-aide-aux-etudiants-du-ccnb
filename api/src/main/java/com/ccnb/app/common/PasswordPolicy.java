package com.ccnb.app.common;

public final class PasswordPolicy {

    public static final String PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
    public static final String MESSAGE = "8 caractères minimum, avec une majuscule, une minuscule et un chiffre";

    private PasswordPolicy() {}
}
