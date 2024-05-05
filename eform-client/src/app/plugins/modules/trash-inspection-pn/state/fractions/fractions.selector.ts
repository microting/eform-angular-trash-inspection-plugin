import {TrashInspectionState} from '../';
import {createSelector} from '@ngrx/store';

const selectTrashInspectionPn =
  (state: { trashInspectionPn: TrashInspectionState }) => state.trashInspectionPn;
export const selectFractions =
  createSelector(selectTrashInspectionPn, (state) => state.fractionsState);
export const selectFractionsPagination =
  createSelector(selectFractions, (state) => state.pagination);
export const selectFractionsPaginationSort =
  createSelector(selectFractions, (state) => state.pagination.sort);
export const selectFractionsPaginationIsSortDsc =
  createSelector(selectFractions, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectFractionsPaginationPageSize =
  createSelector(selectFractions, (state) => state.pagination.pageSize);
export const selectFractionsTotal =
  createSelector(selectFractions, (state) => state.pagination.total);
