import { createReducer, on } from '@ngrx/store';

import { Tea } from '@app/models';
import * as Actions from '@app/store/actions';

export interface DataState {
  teas: Array<Tea>;
  loading: boolean;
  errorMessage: string;
}

export const initialState: DataState = {
  teas: [],
  loading: false,
  errorMessage: '',
};

export const reducer = createReducer(
  initialState,
  on(Actions.loginSuccess, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(Actions.sessionRestored, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(Actions.initialLoadSuccess, (state, { teas }) => ({
    ...state,
    loading: false,
    teas: [...teas],
  })),
  on(Actions.initialLoadFailure, (state, { errorMessage }) => ({
    ...state,
    loading: false,
    errorMessage,
  })),
  on(Actions.logoutSuccess, state => ({
    ...state,
    teas: [],
  })),
);
