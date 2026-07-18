import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CampusService } from '../../core/campus.service';
import { Campus } from '../../core/models';

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

  readonly form = this.fb.group({
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    campusId: this.fb.control<number | null>(null, [Validators.required]),
  });

  constructor() {
    this.campusService.list().subscribe((campuses) => this.campuses.set(campuses));
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
          this.router.navigateByUrl('/');
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
