import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { apiErrorMessage } from '@core/api/api-error';
import { ManagedUser } from '../../models/admin-user.model';
import { AdminUsersService } from '../../services/admin-users.service';

@Component({
  selector: 'app-users-page',
  imports: [DatePipe],
  templateUrl: './users-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {
  private readonly adminUsers = inject(AdminUsersService);

  readonly users = signal<ManagedUser[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminUsers
      .listUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => this.users.set(users),
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error, 'Unable to load users'));
        },
      });
  }
}
