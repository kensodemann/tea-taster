import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';

import { createNavControllerMock } from '@test/mocks';
import { AuthEffects } from './auth.effects';
import {
  login,
  loginSuccess,
  logout,
  logoutSuccess,
  unauthError,
} from '@app/store/actions';
import { AuthenticationService, SessionVaultService } from '@app/core';
import {
  createAuthenticationServiceMock,
  createSessionVaultServiceMock,
} from '@app/core/testing';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        {
          provide: AuthenticationService,
          useFactory: createAuthenticationServiceMock,
        },
        { provide: NavController, useFactory: createNavControllerMock },
        {
          provide: SessionVaultService,
          useFactory: createSessionVaultServiceMock,
        },
      ],
    });
    effects = TestBed.inject(AuthEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('login$', () => {
    it('performs a login operation', done => {
      const auth = TestBed.inject(AuthenticationService);
      (auth.login as any).and.returnValue(of(undefined));
      actions$ = of(login({ email: 'test@test.com', password: 'test' }));
      effects.login$.subscribe(() => {
        expect(auth.login).toHaveBeenCalledTimes(1);
        expect(auth.login).toHaveBeenCalledWith('test@test.com', 'test');
        done();
      });
    });

    describe('on login success', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.login as any).and.returnValue(
          of({
            user: {
              id: 73,
              firstName: 'Ken',
              lastName: 'Sodemann',
              email: 'test@test.com',
            },
            token: '314159',
          }),
        );
      });

      it('dispatches login success', done => {
        actions$ = of(login({ email: 'test@test.com', password: 'test' }));
        effects.login$.subscribe(action => {
          expect(action).toEqual({
            type: '[Auth API] login success',
            session: {
              user: {
                id: 73,
                firstName: 'Ken',
                lastName: 'Sodemann',
                email: 'test@test.com',
              },
              token: '314159',
            },
          });
          done();
        });
      });

      it('saves the session', done => {
        const sessionVaultService = TestBed.inject(SessionVaultService);
        actions$ = of(login({ email: 'test@test.com', password: 'test' }));
        effects.login$.subscribe(() => {
          expect(sessionVaultService.login).toHaveBeenCalledTimes(1);
          expect(sessionVaultService.login).toHaveBeenCalledWith({
            user: {
              id: 73,
              firstName: 'Ken',
              lastName: 'Sodemann',
              email: 'test@test.com',
            },
            token: '314159',
          });
          done();
        });
      });
    });

    describe('on login failure', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.login as any).and.returnValue(of(undefined));
      });

      it('dispatches login error', done => {
        actions$ = of(login({ email: 'test@test.com', password: 'badpass' }));
        effects.login$.subscribe(action => {
          expect(action).toEqual({
            type: '[Auth API] login failure',
            errorMessage: 'Invalid Username or Password',
          });
          done();
        });
      });

      it('does not save the session', done => {
        const sessionVaultService = TestBed.inject(SessionVaultService);
        actions$ = of(login({ email: 'test@test.com', password: 'badpass' }));
        effects.login$.subscribe(() => {
          expect(sessionVaultService.login).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe('on a hard error', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.login as any).and.returnValue(
          throwError(new Error('the server is blowing chunks')),
        );
      });

      it('does not save the session', done => {
        const sessionVaultService = TestBed.inject(SessionVaultService);
        actions$ = of(login({ email: 'test@test.com', password: 'badpass' }));
        effects.login$.subscribe(() => {
          expect(sessionVaultService.login).not.toHaveBeenCalled();
          done();
        });
      });

      it('dispatches the login failure event', done => {
        actions$ = of(login({ email: 'test@test.com', password: 'badpass' }));
        effects.login$.subscribe(action => {
          expect(action).toEqual({
            type: '[Auth API] login failure',
            errorMessage: 'Unknown error in login',
          });
          done();
        });
      });
    });
  });

  describe('loginSuccess$', () => {
    it('navigates to the root path', done => {
      const navController = TestBed.inject(NavController);
      actions$ = of(
        loginSuccess({
          session: {
            user: {
              id: 73,
              firstName: 'Ken',
              lastName: 'Sodemann',
              email: 'test@test.com',
            },
            token: '314159',
          },
        }),
      );
      effects.loginSuccess$.subscribe(() => {
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/']);
        done();
      });
    });
  });

  describe('unauthError$', () => {
    it('clears the session from storage', done => {
      const sessionVaultService = TestBed.inject(SessionVaultService);
      actions$ = of(unauthError());
      effects.unauthError$.subscribe(() => {
        expect(sessionVaultService.logout).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('dispatches the logout success event', done => {
      actions$ = of(unauthError());
      effects.unauthError$.subscribe(action => {
        expect(action).toEqual({
          type: '[Auth API] logout success',
        });
        done();
      });
    });
  });

  describe('logout$', () => {
    beforeEach(() => {
      const auth = TestBed.inject(AuthenticationService);
      (auth.logout as any).and.returnValue(of(undefined));
    });

    it('performs a logout operation', done => {
      const auth = TestBed.inject(AuthenticationService);
      actions$ = of(logout());
      effects.logout$.subscribe(() => {
        expect(auth.logout).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('dispatches logout success', done => {
      actions$ = of(logout());
      effects.logout$.subscribe(action => {
        expect(action).toEqual({
          type: '[Auth API] logout success',
        });
        done();
      });
    });

    it('clears the session', done => {
      const sessionVaultService = TestBed.inject(SessionVaultService);
      actions$ = of(logout());
      effects.logout$.subscribe(() => {
        expect(sessionVaultService.logout).toHaveBeenCalledTimes(1);
        done();
      });
    });

    describe('on a hard error', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.logout as any).and.returnValue(
          throwError(new Error('the server is blowing chunks')),
        );
      });

      it('does not clear the session from storage', done => {
        const sessionVaultService = TestBed.inject(SessionVaultService);
        actions$ = of(logout());
        effects.logout$.subscribe(() => {
          expect(sessionVaultService.logout).not.toHaveBeenCalled();
          done();
        });
      });

      it('dispatches the logout failure event', done => {
        actions$ = of(logout());
        effects.logout$.subscribe(action => {
          expect(action).toEqual({
            type: '[Auth API] logout failure',
            errorMessage: 'Unknown error in logout',
          });
          done();
        });
      });
    });
  });

  describe('logoutSuccess$', () => {
    it('navigates to the login path', done => {
      const navController = TestBed.inject(NavController);
      actions$ = of(logoutSuccess());
      effects.logoutSuccess$.subscribe(() => {
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'login']);
        done();
      });
    });
  });
});
