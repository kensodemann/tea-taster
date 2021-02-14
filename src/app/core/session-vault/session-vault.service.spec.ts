import { TestBed } from '@angular/core/testing';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { Session } from '@app/models';
import { sessionRestored } from '@app/store/actions';
import { SessionVaultService } from './session-vault.service';

describe('SessionVaultService', () => {
  let service: SessionVaultService;
  let originalStorage: any;

  beforeEach(() => {
    originalStorage = Plugins.Storage;
    Plugins.Storage = jasmine.createSpyObj('Storage', {
      get: Promise.resolve(),
      set: Promise.resolve(),
      remove: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(SessionVaultService);
  });

  afterEach(() => {
    Plugins.Storage = originalStorage;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('saves the session in storage', async () => {
      const session: Session = {
        user: {
          id: 42,
          firstName: 'Joe',
          lastName: 'Tester',
          email: 'test@test.org',
        },
        token: '19940059fkkf039',
      };
      await service.login(session);
      expect(Plugins.Storage.set).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.set).toHaveBeenCalledWith({
        key: 'auth-session',
        value: JSON.stringify(session),
      });
    });
  });

  describe('restoreSession', () => {
    it('gets the session from storage', async () => {
      (Plugins.Storage.get as any).and.returnValue(
        Promise.resolve({ value: null }),
      );
      await service.restoreSession();
      expect(Plugins.Storage.get).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.get).toHaveBeenCalledWith({
        key: 'auth-session',
      });
    });

    describe('with a session', () => {
      const session: Session = {
        user: {
          id: 42,
          firstName: 'Joe',
          lastName: 'Tester',
          email: 'test@test.org',
        },
        token: '19940059fkkf039',
      };
      beforeEach(() => {
        (Plugins.Storage.get as any).and.returnValue(
          Promise.resolve({ value: JSON.stringify(session) }),
        );
      });

      it('resolves the session', async () => {
        expect(await service.restoreSession()).toEqual(session);
      });

      it('dispatches session restored', async () => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        await service.restoreSession();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          sessionRestored({ session }),
        );
      });
    });

    describe('without a session', () => {
      beforeEach(() => {
        (Plugins.Storage.get as any).and.returnValue(
          Promise.resolve({ value: null }),
        );
      });

      it('resolves without a session', async () => {
        expect(await service.restoreSession()).toEqual(null);
      });

      it('does not dispatch session restored', async () => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        await service.restoreSession();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    it('clears the storage', async () => {
      await service.logout();
      expect(Plugins.Storage.remove).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.remove).toHaveBeenCalledWith({
        key: 'auth-session',
      });
    });
  });
});
