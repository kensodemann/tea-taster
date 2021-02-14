import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { selectAuthToken, State } from '@app/store';
import { NavController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take, mergeMap, map, tap } from 'rxjs/operators';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private navController: NavController,
    private store: Store<State>,
    private vault: SessionVaultService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(selectAuthToken),
      take(1),
      mergeMap(token => (token ? of(token) : this.vault.restoreSession())),
      map(value => !!value),
      tap(sessionExists => {
        if (!sessionExists) {
          this.navController.navigateRoot(['/', 'login']);
        }
      }),
    );
  }
}
