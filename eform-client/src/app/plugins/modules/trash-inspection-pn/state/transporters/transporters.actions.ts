import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const transportersUpdatePagination = createAction(
  '[Transporters] Update Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);
export const transportersUpdateTotalTransporters = createAction(
  '[Transporters] Update Total Transporters',
  (payload: number) => ({payload})
);
