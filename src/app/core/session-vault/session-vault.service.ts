import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Plugins } from '@capacitor/core';

import { Session } from '@app/models';
import { State } from '@app/store';
import { sessionRestored } from '@app/store/actions';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private key = 'auth-session';

  constructor(private store: Store<State>) {}

  async login(session: Session): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Storage } = Plugins;
    await Storage.set({ key: this.key, value: JSON.stringify(session) });
  }

  async restoreSession(): Promise<Session> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Storage } = Plugins;
    const { value } = await Storage.get({ key: this.key });
    const session = value && JSON.parse(value);

    if (session) {
      this.store.dispatch(sessionRestored({ session }));
    }

    return session;
  }

  async logout(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Storage } = Plugins;
    await Storage.remove({ key: this.key });
  }
}
