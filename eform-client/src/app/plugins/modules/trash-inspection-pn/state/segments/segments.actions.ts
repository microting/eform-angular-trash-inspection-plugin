import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const segmentsUpdatePagination = createAction(
  '[Segments] Update Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const segmentsUpdateTotalSegments = createAction(
  '[Segments] Update Total Segments',
  (payload: number) => ({payload})
);
