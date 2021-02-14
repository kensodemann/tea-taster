import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DataState } from '@app/store/reducers/data.reducer';

export const selectData = createFeatureSelector('data');
export const selectTeas = createSelector(
  selectData,
  (state: DataState) => state.teas,
);
