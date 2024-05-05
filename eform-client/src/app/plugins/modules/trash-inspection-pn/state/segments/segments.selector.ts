import {
  TrashInspectionState,
} from '../';
import { createSelector } from '@ngrx/store';

const selectTrashInspectionPn =
  (state: { trashInspectionPn: TrashInspectionState }) => state.trashInspectionPn;
export const selectSegments =
  createSelector(selectTrashInspectionPn, (state) => state.segmentsState);
export const selectSegmentsPagination =
  createSelector(selectSegments, (state) => state.pagination);
export const selectSegmentsPaginationSort =
  createSelector(selectSegments, (state) => state.pagination.sort);
export const selectSegmentsPaginationIsSortDsc =
  createSelector(selectSegments, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectSegmentsPaginationPageSize =
  createSelector(selectSegments, (state) => state.pagination.pageSize);
export const selectSegmentsTotal =
  createSelector(selectSegments, (state) => state.pagination.total);
