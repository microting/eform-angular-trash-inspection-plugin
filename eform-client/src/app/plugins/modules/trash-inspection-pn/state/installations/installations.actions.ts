import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const installationsUpdatePagination = createAction(
  '[Installations] Update Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);
export const installationsUpdateTotalInstallations = createAction(
  '[Installations] Update Total Installations',
  (payload: number) => ({payload})
);
