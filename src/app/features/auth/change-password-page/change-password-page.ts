import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { apiErrorMessage } from '@core/api/api-error';
import { AuthService } from '@core/auth/auth.service';
import { AuthCard } from '@layout/auth-card/auth-card';

@Component({
  selector: 'app-change-password-page',
  imports: [AuthCard, ReactiveFormsModule],
  templateUrl: './change-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly form = this.formBuilder.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });
  readonly error = signal<string | null>(null);
  readonly success = signal(false);
  readonly submitting = signal(false);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.success.set(false);
    this.submitting.set(true);

    this.auth
      .changePassword(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.form.reset();
          this.success.set(true);
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error, 'Unable to change password'));
        },
      });
  }
}
