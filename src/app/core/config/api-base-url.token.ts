import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

/** Base URL used by ApiService. Value comes from the active environment file. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
