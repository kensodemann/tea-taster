import { createAction, props } from '@ngrx/store';
import { Session } from '@app/models';

export const login = createAction(
  '[Login Page] login',
  props<{ email: string; password: string }>(),
);
export const loginSuccess = createAction(
  '[Auth API] login success',
  props<{ session: Session }>(),
);
export const loginFailure = createAction(
  '[Auth API] login failure',
  props<{ errorMessage: string }>(),
);

export const sessionRestored = createAction(
  '[Vault API] session restored',
  props<{ session: Session }>(),
);

export const unauthError = createAction('[Auth API] unauthenticated error');

export const logout = createAction('[Tea Page] logout');
export const logoutSuccess = createAction('[Auth API] logout success');
export const logoutFailure = createAction(
  '[Auth API] logout failure',
  props<{ errorMessage: string }>(),
);
