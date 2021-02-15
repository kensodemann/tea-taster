import { Injectable } from '@angular/core';
import { TeaService } from '@app/core';
import {
  initialLoadFailure,
  initialLoadSuccess,
  loginSuccess,
  sessionRestored,
} from '@app/store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class DataEffects {
  sessionLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess, sessionRestored),
      mergeMap(() =>
        this.teaService.getAll().pipe(
          map(teas => initialLoadSuccess({ teas })),
          catchError(() =>
            of(
              initialLoadFailure({
                errorMessage: 'Error in data load, check server logs',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  constructor(private actions$: Actions, private teaService: TeaService) {}
}
