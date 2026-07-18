import { toSignal } from '@angular/core/rxjs-interop';
import { Component, Signal, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CampusService } from '../../core/campus.service';
import { Campus } from '../../core/models';

/** Mirrors the server-side pattern in RegisterRequest.password — keep both in sync. */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss',
})
export class Register {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly campusService = inject(CampusService);
  private readonly router = inject(Router);

  readonly campuses = signal<Campus[]>([]);
  readonly errorMessage = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly showPassword = signal(false);

  readonly form = this.fb.group(
    {
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
      confirmPassword: this.fb.control('', [Validators.required]),
      campusId: this.fb.control<number | null>(null, [Validators.required]),
    },
    { validators: passwordsMatchValidator },
  );

  private readonly passwordValue: Signal<string>;
  private readonly confirmPasswordValue: Signal<string>;

  readonly passwordChecks = computed(() => {
    const value = this.passwordValue();
    return {
      hasMinLength: value.length >= 8,
      hasUpper: /[A-Z]/.test(value),
      hasLower: /[a-z]/.test(value),
      hasDigit: /\d/.test(value),
    };
  });

  readonly passwordsMatch = computed(() => {
    const confirm = this.confirmPasswordValue();
    return confirm.length > 0 && this.passwordValue() === confirm;
  });

  readonly showMismatch = computed(() => {
    const confirm = this.confirmPasswordValue();
    return confirm.length > 0 && this.passwordValue() !== confirm;
  });

  constructor() {
    this.passwordValue = toSignal(this.form.controls.password.valueChanges, { initialValue: '' });
    this.confirmPasswordValue = toSignal(this.form.controls.confirmPassword.valueChanges, {
      initialValue: '',
    });
    this.campusService.list().subscribe((campuses) => this.campuses.set(campuses));
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.submitting.set(true);
    const raw = this.form.getRawValue();
    this.authService
      .register({
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        password: raw.password,
        campusId: raw.campusId!,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigateByUrl('/auth/verify-email', { state: { email: raw.email } });
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err?.status === 409
              ? 'Un compte existe déjà avec cet email.'
              : "Une erreur est survenue lors de l'inscription.",
          );
        },
      });
  }
}
