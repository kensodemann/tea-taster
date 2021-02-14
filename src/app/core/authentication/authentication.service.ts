import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, EMPTY } from 'rxjs';

import { Session } from '@app/models';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

interface LoginResponse extends Session {
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Session | undefined> {
    return this.http
      .post<LoginResponse>(`${environment.dataService}/login`, {
        username: email,
        password,
      })
      .pipe(
        map(res => {
          if (res.success) {
            delete res.success;
            return res;
          }
        }),
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.dataService}/logout`, {});
  }
}
