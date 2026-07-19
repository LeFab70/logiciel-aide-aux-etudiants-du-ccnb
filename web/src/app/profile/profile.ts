import { toSignal } from '@angular/core/rxjs-interop';
import { Component, Signal, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { CampusService } from '../core/campus.service';
import { Campus } from '../core/models';
import { AppIcon } from '../shared/icon/icon';
import { PASSWORD_PATTERN, computePasswordChecks, passwordsMatchValidator } from '../shared/password-policy';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, AppIcon],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly campusService = inject(CampusService);

  readonly campuses = signal<Campus[]>([]);
  readonly showPassword = signal(false);

  readonly profileError = signal<string | null>(null);
  readonly profileSuccess = signal<string | null>(null);
  readonly profileSubmitting = signal(false);

  readonly passwordError = signal<string | null>(null);
  readonly passwordSuccess = signal<string | null>(null);
  readonly passwordSubmitting = signal(false);

  readonly profileForm = this.fb.group({
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    campusId: this.fb.control<number | null>(null, [Validators.required]),
  });

  readonly passwordForm = this.fb.group(
    {
      currentPassword: this.fb.control('', [Validators.required]),
      newPassword: this.fb.control('', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
      confirmNewPassword: this.fb.control('', [Validators.required]),
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmNewPassword') },
  );

  private readonly newPasswordValue: Signal<string>;
  private readonly confirmNewPasswordValue: Signal<string>;

  readonly passwordChecks = computed(() => computePasswordChecks(this.newPasswordValue()));

  readonly passwordsMatch = computed(() => {
    const confirm = this.confirmNewPasswordValue();
    return confirm.length > 0 && this.newPasswordValue() === confirm;
  });

  readonly showMismatch = computed(() => {
    const confirm = this.confirmNewPasswordValue();
    return confirm.length > 0 && this.newPasswordValue() !== confirm;
  });

  constructor() {
    this.newPasswordValue = toSignal(this.passwordForm.controls.newPassword.valueChanges, {
      initialValue: '',
    });
    this.confirmNewPasswordValue = toSignal(this.passwordForm.controls.confirmNewPassword.valueChanges, {
      initialValue: '',
    });

    this.campusService.list().subscribe((campuses) => this.campuses.set(campuses));

    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        campusId: user.campus.id,
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileError.set(null);
    this.profileSuccess.set(null);
    this.profileSubmitting.set(true);
    const raw = this.profileForm.getRawValue();
    this.authService
      .updateProfile({ firstName: raw.firstName, lastName: raw.lastName, campusId: raw.campusId! })
      .subscribe({
        next: () => {
          this.profileSubmitting.set(false);
          this.profileSuccess.set('Profil mis à jour.');
        },
        error: () => {
          this.profileSubmitting.set(false);
          this.profileError.set('Une erreur est survenue. Réessaie.');
        },
      });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordError.set(null);
    this.passwordSuccess.set(null);
    this.passwordSubmitting.set(true);
    const raw = this.passwordForm.getRawValue();
    this.authService
      .changePassword({ currentPassword: raw.currentPassword, newPassword: raw.newPassword })
      .subscribe({
        next: () => {
          this.passwordSubmitting.set(false);
          this.passwordSuccess.set('Mot de passe mis à jour.');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.passwordSubmitting.set(false);
          this.passwordError.set(
            err?.status === 400 ? 'Mot de passe actuel invalide.' : 'Une erreur est survenue. Réessaie.',
          );
        },
      });
  }
}
