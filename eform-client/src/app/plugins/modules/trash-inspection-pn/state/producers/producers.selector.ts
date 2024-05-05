import {
  TrashInspectionState,
} from '../';
import { createSelector } from '@ngrx/store';

const selectTrashInspectionPn =
  (state: { trashInspectionPn: TrashInspectionState }) => state.trashInspectionPn;
export const selectProducers =
  createSelector(selectTrashInspectionPn, (state) => state.producersState);
export const selectProducersPagination =
  createSelector(selectProducers, (state) => state.pagination);
export const selectProducersPaginationSort =
  createSelector(selectProducers, (state) => state.pagination.sort);
export const selectProducersPaginationIsSortDsc =
  createSelector(selectProducers, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectProducersPaginationPageSize =
  createSelector(selectProducers, (state) => state.pagination.pageSize);
export const selectProducersTotal =
  createSelector(selectProducers, (state) => state.pagination.total);
