import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { apiErrorMessage } from '@core/api/api-error';
import { CreateUserRequest, ManagedUser } from '@core/models/user-management.model';
import { CreateUserForm } from '@shared/components/create-user-form/create-user-form';
import { StaffCustomersService } from '../../services/staff-customers.service';

@Component({
  selector: 'app-create-customer-page',
  imports: [CreateUserForm, RouterLink],
  templateUrl: './create-customer-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCustomerPage {
  private readonly staffCustomers = inject(StaffCustomersService);
  private readonly form = viewChild.required(CreateUserForm);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly created = signal<ManagedUser | null>(null);

  submit(request: CreateUserRequest): void {
    this.error.set(null);
    this.created.set(null);
    this.submitting.set(true);

    this.staffCustomers
      .createCustomer(request)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (user) => {
          this.created.set(user);
          this.form().reset();
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error, 'Unable to create customer'));
        },
      });
  }
}
