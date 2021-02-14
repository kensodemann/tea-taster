import { Session, Tea } from '@app/models';
import {
  loginSuccess,
  sessionRestored,
  initialLoadFailure,
  initialLoadSuccess,
  logoutSuccess,
} from '../actions';
import { DataState, initialState, reducer } from './data.reducer';

const session: Session = {
  user: {
    id: 314,
    firstName: 'Kevin',
    lastName: 'Minion',
    email: 'goodtobebad@gru.org',
  },
  token: '39948503',
};

const teas: Array<Tea> = [
  {
    id: 1,
    name: 'Green',
    image: 'assets/img/green.jpg',
    description: 'Green teas are green',
  },
  {
    id: 2,
    name: 'Black',
    image: 'assets/img/black.jpg',
    description: 'Black teas are not green',
  },
  {
    id: 3,
    name: 'Herbal',
    image: 'assets/img/herbal.jpg',
    description: 'Herbal teas are not even tea',
  },
];

const createState = (stateChanges: {
  teas?: Array<Tea>;
  loading?: boolean;
  errorMessage?: string;
}): DataState => ({ ...initialState, ...stateChanges });

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

[
  {
    description:
      'Login Success: sets the loading flag and clears any error message',
    action: loginSuccess({ session }),
    begin: { errorMessage: 'Unknown error with data load' },
    end: { loading: true },
  },
  {
    description:
      'Session Restored: sets the loading flag and clears any error message',
    action: sessionRestored({ session }),
    begin: { errorMessage: 'Unknown error with data load' },
    end: { loading: true },
  },
  {
    description:
      'Initial Load Failure: clears the loading flag and sets the error message',
    action: initialLoadFailure({ errorMessage: 'The load blew some chunks' }),
    begin: { loading: true },
    end: { errorMessage: 'The load blew some chunks' },
  },
  {
    description:
      'Initial Load Success: clears the loading flag and sets the teas',
    action: initialLoadSuccess({ teas }),
    begin: { loading: true },
    end: { teas },
  },
  {
    description: 'Logout Success: clears the tea data',
    action: logoutSuccess(),
    begin: { teas },
    end: {},
  },
].forEach(test =>
  it(test.description, () => {
    expect(reducer(createState(test.begin), test.action)).toEqual(
      createState(test.end),
    );
  }),
);
