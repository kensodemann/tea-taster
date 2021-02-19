import { TastingNote, Tea } from '@app/models';
import { DataState } from '@app/store/reducers/data.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectData = createFeatureSelector('data');
export const selectTeas = createSelector(
  selectData,
  (state: DataState) => state.teas,
);
export const selectTea = createSelector(
  selectTeas,
  (teas: Array<Tea>, props: { id: number }) =>
    teas.find(t => t.id === props.id),
);
export const selectNotes = createSelector(
  selectData,
  (state: DataState) => state.notes,
);
export const selectNote = createSelector(
  selectNotes,
  (notes: Array<TastingNote>, props: { id: number }) =>
    notes.find(t => t.id === props.id),
);
