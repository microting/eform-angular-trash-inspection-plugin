import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const fractionsUpdatePagination = createAction(
  '[Fractions] Update Filters',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);
export const fractionsUpdateTotalFractions = createAction(
  '[Fractions] Update Total Fractions',
  (payload: number) => ({payload})
);
