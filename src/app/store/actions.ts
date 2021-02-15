import { createAction, props } from '@ngrx/store';
import { Session, Tea } from '@app/models';

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

export const initialLoadSuccess = createAction(
  '[Data API] initial data load success',
  props<{ teas: Array<Tea> }>(),
);
export const initialLoadFailure = createAction(
  '[Data API] initial data load failure',
  props<{ errorMessage: string }>(),
);

export const teaDetailsChangeRating = createAction(
  '[Tea Details Page] change rating',
  props<{ tea: Tea; rating: number }>(),
);
export const teaDetailsChangeRatingSuccess = createAction(
  '[Data API] change rating success',
  props<{ tea: Tea }>(),
);
export const teaDetailsChangeRatingFailure = createAction(
  '[Data API] change rating failure',
  props<{ errorMessage: string }>(),
);

export const unauthError = createAction('[Auth API] unauthenticated error');

export const logout = createAction('[Tea Page] logout');
export const logoutSuccess = createAction('[Auth API] logout success');
export const logoutFailure = createAction(
  '[Auth API] logout failure',
  props<{ errorMessage: string }>(),
);
