import { Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';

export const ROUTES = {
  AUTH: 'auth',
  CHAT: 'chat',
  USERS: 'users'
};


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.AUTH,
    pathMatch: 'full'
  },
  {
    path: ROUTES.AUTH,
    component: LoginComponent
  },
];
