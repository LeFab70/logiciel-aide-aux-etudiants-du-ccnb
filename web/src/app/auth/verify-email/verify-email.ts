import { Component, OnDestroy, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

const RESEND_COOLDOWN_SECONDS = 60;

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: '../login/login.scss',
})
export class VerifyEmail implements OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string | null>(null);
  readonly infoMessage = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly resending = signal(false);
  readonly cooldownSeconds = signal(RESEND_COOLDOWN_SECONDS);
  private cooldownIntervalId?: ReturnType<typeof setInterval>;

  readonly form = this.fb.group({
    email: this.fb.control(this.readEmailFromState(), [Validators.required, Validators.email]),
    code: this.fb.control('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  });

  constructor() {
    this.startCooldown();
  }

  ngOnDestroy(): void {
    if (this.cooldownIntervalId) {
      clearInterval(this.cooldownIntervalId);
    }
  }

  private readEmailFromState(): string {
    const state = window.history.state as { email?: string };
    return state?.email ?? '';
  }

  private startCooldown(): void {
    this.cooldownSeconds.set(RESEND_COOLDOWN_SECONDS);
    if (this.cooldownIntervalId) {
      clearInterval(this.cooldownIntervalId);
    }
    this.cooldownIntervalId = setInterval(() => {
      const next = this.cooldownSeconds() - 1;
      this.cooldownSeconds.set(next);
      if (next <= 0 && this.cooldownIntervalId) {
        clearInterval(this.cooldownIntervalId);
      }
    }, 1000);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.infoMessage.set(null);
    this.submitting.set(true);
    const raw = this.form.getRawValue();
    this.authService.verifyEmail({ email: raw.email, code: raw.code }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Code invalide.');
      },
    });
  }

  resend(): void {
    const email = this.form.controls.email.value;
    if (!email || this.cooldownSeconds() > 0) {
      return;
    }
    this.errorMessage.set(null);
    this.infoMessage.set(null);
    this.resending.set(true);
    this.authService.resendCode({ email }).subscribe({
      next: () => {
        this.resending.set(false);
        this.infoMessage.set('Un nouveau code a été envoyé.');
        this.startCooldown();
      },
      error: (err) => {
        this.resending.set(false);
        this.errorMessage.set(err?.error?.message ?? "Impossible de renvoyer le code pour l'instant.");
      },
    });
  }
}
