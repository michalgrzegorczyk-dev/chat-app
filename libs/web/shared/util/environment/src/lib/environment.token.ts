import { InjectionToken } from '@angular/core';

import { environment } from './environment';

export const ENVIRONMENT = new InjectionToken('environment', {
  providedIn: 'root',
  factory: () => environment
});
