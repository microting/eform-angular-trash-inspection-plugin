import {TrashInspectionFiltrationModel} from './';
import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const trashInspectionUpdateFilters = createAction(
  '[TrashInspections] Update Filters',
  (payload: TrashInspectionFiltrationModel) => ({payload})
);

export const trashInspectionUpdatePagination = createAction(
  '[TrashInspections] Update Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const trashInspectionUpdateTotalTrashInspections = createAction(
  '[TrashInspections] Update Total Trash Inspections',
  (payload: number) => ({payload})
);
