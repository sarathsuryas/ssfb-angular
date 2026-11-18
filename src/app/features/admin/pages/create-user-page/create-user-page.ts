import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { apiErrorMessage } from '@core/api/api-error';
import { CreateUserRequest, ManagedUser } from '@core/models/user-management.model';
import { CreateUserForm } from '@shared/components/create-user-form/create-user-form';
import { AdminUsersService } from '../../services/admin-users.service';

@Component({
  selector: 'app-create-user-page',
  imports: [CreateUserForm, RouterLink],
  templateUrl: './create-user-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserPage {
  private readonly route = inject(ActivatedRoute);
  private readonly adminUsers = inject(AdminUsersService);
  private readonly form = viewChild.required(CreateUserForm);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly created = signal<ManagedUser | null>(null);

  readonly targetRole =
    this.route.snapshot.data['role'] === 'STAFF' ? 'STAFF' : 'CUSTOMER';
  readonly heading =
    this.targetRole === 'STAFF' ? 'Create staff account' : 'Create customer account';

  submit(request: CreateUserRequest): void {
    this.error.set(null);
    this.created.set(null);
    this.submitting.set(true);

    const action$: Observable<ManagedUser> =
      this.targetRole === 'STAFF'
        ? this.adminUsers.createStaff(request)
        : this.adminUsers.createCustomer(request);

    action$
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (user) => {
          this.created.set(user);
          this.form().reset();
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error, 'Unable to create account'));
        },
      });
  }
}
