import {TrashInspectionState} from '../';
import {createSelector} from '@ngrx/store';

const selectTrashInspectionPn =
  (state: { trashInspectionPn: TrashInspectionState }) => state.trashInspectionPn;
export const selectInstallations =
  createSelector(selectTrashInspectionPn, (state) => state.installationsState);
export const selectInstallationsPagination =
  createSelector(selectInstallations, (state) => state.pagination);
export const selectInstallationsPaginationSort =
  createSelector(selectInstallations, (state) => state.pagination.sort);
export const selectInstallationsPaginationIsSortDsc =
  createSelector(selectInstallations, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectInstallationsPaginationPageSize =
  createSelector(selectInstallations, (state) => state.pagination.pageSize);
export const selectInstallationsTotal =
  createSelector(selectInstallations, (state) => state.pagination.total);
