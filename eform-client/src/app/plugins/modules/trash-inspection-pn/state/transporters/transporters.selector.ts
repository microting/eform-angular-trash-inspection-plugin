import {
  TrashInspectionState,
} from '../';
import { createSelector } from '@ngrx/store';

const selectTrashInspectionPn =
  (state: { trashInspectionPn: TrashInspectionState }) => state.trashInspectionPn;
export const selectTransporters =
  createSelector(selectTrashInspectionPn, (state) => state.transportersState);
export const selectTransportersPagination =
  createSelector(selectTransporters, (state) => state.pagination);
export const selectTransportersPaginationSort =
  createSelector(selectTransporters, (state) => state.pagination.sort);
export const selectTransportersPaginationIsSortDsc =
  createSelector(selectTransporters, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectTransportersPaginationPageSize =
  createSelector(selectTransporters, (state) => state.pagination.pageSize);
export const selectTransportersTotal =
  createSelector(selectTransporters, (state) => state.pagination.total);
