import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/api/api.service';
import { CreateUserRequest, ManagedUser } from '@core/models/user-management.model';

/** Scoped to the staff area via providers on the staff parent route. */
@Injectable()
export class StaffCustomersService {
  private readonly api = inject(ApiService);

  createCustomer(request: CreateUserRequest): Observable<ManagedUser> {
    return this.api.post<ManagedUser>('/staff/customers', request);
  }
}
