import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Mirrors PasswordPolicy.PATTERN on the backend (api/.../common/PasswordPolicy.java) — keep both in sync. */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export interface PasswordChecks {
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
}

export function computePasswordChecks(value: string): PasswordChecks {
  return {
    hasMinLength: value.length >= 8,
    hasUpper: /[A-Z]/.test(value),
    hasLower: /[a-z]/.test(value),
    hasDigit: /\d/.test(value),
  };
}

export function passwordsMatchValidator(
  passwordKey: string,
  confirmKey: string,
): (group: AbstractControl) => ValidationErrors | null {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };
}
