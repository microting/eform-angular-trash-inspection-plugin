import {TrashInspectionState} from '../';
import { createSelector } from '@ngrx/store';

const selectTrashInspectionPn =
  (state: { trashInspectionPn: TrashInspectionState }) => state.trashInspectionPn;
export const selectTrashInspections =
  createSelector(selectTrashInspectionPn, (state) => state.trashInspectionsState);
export const selectTrashInspectionsFilters =
  createSelector(selectTrashInspections, (state) => state.filters);
export const selectTrashInspectionsPagination =
  createSelector(selectTrashInspections, (state) => state.pagination);
export const selectTrashInspectionsPaginationSort =
  createSelector(selectTrashInspections, (state) => state.pagination.sort);
export const selectTrashInspectionsPaginationIsSortDsc =
  createSelector(selectTrashInspections, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectTrashInspectionsNameFilters =
  createSelector(selectTrashInspections, (state) => state.filters.nameFilter);
export const selectTrashInspectionsPaginationPageSize =
  createSelector(selectTrashInspections, (state) => state.pagination.pageSize);
export const selectTrashInspectionsTotal =
  createSelector(selectTrashInspections, (state) => state.total);
