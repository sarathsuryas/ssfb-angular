import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateUserRequest } from '../../models/admin-user.model';

@Component({
  selector: 'app-create-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './create-user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserForm {
  readonly submitting = input(false);
  readonly submitted = output<CreateUserRequest>();

  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(72)],
    ],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  reset(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
