import { TestBed } from '@angular/core/testing';
import { TeaService } from '@app/core';
import { createTeaServiceMock } from '@app/core/testing';
import { Session, Tea } from '@app/models';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import {
  loginSuccess,
  sessionRestored,
  teaDetailsChangeRating,
} from '../actions';
import { DataEffects } from './data.effects';

describe('DataEffects', () => {
  let actions$: Observable<any>;
  let effects: DataEffects;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataEffects,
        provideMockActions(() => actions$),
        {
          provide: TeaService,
          useFactory: createTeaServiceMock,
        },
      ],
    });
    effects = TestBed.inject(DataEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  [loginSuccess({ session }), sessionRestored({ session })].forEach(action =>
    describe(`sessionLoaded$ with ${action.type}`, () => {
      it('fetches the teas', done => {
        const teaService = TestBed.inject(TeaService);
        (teaService.getAll as any).and.returnValue(of(undefined));
        actions$ = of(action);
        effects.sessionLoaded$.subscribe(() => {
          expect(teaService.getAll).toHaveBeenCalledTimes(1);
          done();
        });
      });

      describe('on success', () => {
        beforeEach(() => {
          const teaService = TestBed.inject(TeaService);
          (teaService.getAll as any).and.returnValue(of(teas));
        });

        it('dispatches initial load success', done => {
          actions$ = of(action);
          effects.sessionLoaded$.subscribe(mappedAction => {
            expect(mappedAction).toEqual({
              type: '[Data API] initial data load success',
              teas,
            });
            done();
          });
        });
      });

      describe('on an exception', () => {
        beforeEach(() => {
          const teaService = TestBed.inject(TeaService);
          (teaService.getAll as any).and.returnValue(
            throwError(new Error('the server is blowing chunks')),
          );
        });

        it('dispatches initial load failure', done => {
          actions$ = of(action);
          effects.sessionLoaded$.subscribe(newAction => {
            expect(newAction).toEqual({
              type: '[Data API] initial data load failure',
              errorMessage: 'Error in data load, check server logs',
            });
            done();
          });
        });
      });
    }),
  );

  describe('teaRatingChanged$', () => {
    it('save the tea', done => {
      const teaService = TestBed.inject(TeaService);
      actions$ = of(teaDetailsChangeRating({ tea: teas[1], rating: 5 }));
      effects.teaRatingChanged$.subscribe(() => {
        expect(teaService.save).toHaveBeenCalledTimes(1);
        expect(teaService.save).toHaveBeenCalledWith({ ...teas[1], rating: 5 });
        done();
      });
    });

    describe('on success', () => {
      it('dispatches tea rating change success', done => {
        actions$ = of(teaDetailsChangeRating({ tea: teas[1], rating: 5 }));
        effects.teaRatingChanged$.subscribe(newAction => {
          expect(newAction).toEqual({
            type: '[Data API] change rating success',
            tea: { ...teas[1], rating: 5 },
          });
          done();
        });
      });
    });

    describe('on an exception', () => {
      beforeEach(() => {
        const teaService = TestBed.inject(TeaService);
        (teaService.save as any).and.returnValue(
          Promise.reject(new Error('private storage is blowing chunks?')),
        );
      });

      it('dispatches tea rating change failure', done => {
        actions$ = of(teaDetailsChangeRating({ tea: teas[1], rating: 5 }));
        effects.teaRatingChanged$.subscribe(newAction => {
          expect(newAction).toEqual({
            type: '[Data API] change rating failure',
            errorMessage: 'private storage is blowing chunks?',
          });
          done();
        });
      });
    });
  });
});
