import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// todo: where to put it
// ogarniasz to jako token
// z Auth eksportujesz AuthModule, ktory ma metode forRoot, ktora przyjmuje config
// wewnatrz Auth korzystasz i InjectionTokenow (tworzysz tokeny dla konfiguracji i uzywasz tokenow)
import { environment } from '../../../../../util-configuration/src/lib/configuration/environments/environment';
import { UserDto } from '@chat-app/dtos';
import { User } from '@chat-app/domain';

const USER_PLACEHOLDER = {
  id: '',
  avatarUrl: '',
  name: ''
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO MOVE USER TO ACCOUNT?
  // wg mnie nie. uzytkownik tutaj jest czyms innym niz uzytkownik z Account
  // zobacz sobie przykladowe implementacje auth:
  // keycloak: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/src/keycloak.js
  // msal: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser/src
  readonly user = signal<User>(USER_PLACEHOLDER);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  setUser(user: User) {
    this.user.update(() => user);
  }

  isUserLoggedIn() {
    return this.user().id !== USER_PLACEHOLDER.id &&
      this.user().avatarUrl !== USER_PLACEHOLDER.avatarUrl &&
      this.user().name !== USER_PLACEHOLDER.name;
  }

  async logOut(): Promise<void> {
    this.setUser(USER_PLACEHOLDER);
    await this.router.navigate(['/auth']);
  }

  // to tutaj nie powinno sie znalezc. chyba ze masz multitenancy i zwracasz wszystkich uzytkownikow w ramach jednego konta
  getAllUsers(): Observable<User[]> {
    return this.http.get<UserDto[]>(`${environment.apiUrl}/chat/users`).pipe(map((response: UserDto[]) => {
      return response.map((userDto: UserDto) => {
        return {
          ...userDto,
          avatarUrl: userDto.profile_photo_url
        };
      });
    }));
  }
}
