import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const producersUpdatePagination = createAction(
  '[Producers] Update Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const producersUpdateTotalProducers = createAction(
  '[Producers] Update Total Producers',
  (payload: number) => ({payload})
);
