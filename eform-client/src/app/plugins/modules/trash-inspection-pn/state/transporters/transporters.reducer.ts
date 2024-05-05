import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  transportersUpdatePagination
} from './transporters.actions';

export interface TransportersState {
  pagination: CommonPaginationState;
  total: number;
}

export const transportersInitialState: TransportersState = {
  pagination: {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
    pageIndex: 0,
    total: 0,
  },
  total: 0,
};

export const _transportersReducer = createReducer(
  transportersInitialState,
  on(transportersUpdatePagination, (state, {payload}) => ({
    ...state,
    pagination: {
      offset: payload.pagination.offset,
      pageSize: payload.pagination.pageSize,
      pageIndex: payload.pagination.pageIndex,
      sort: payload.pagination.sort,
      isSortDsc: payload.pagination.isSortDsc,
      total: payload.pagination.total,
    },
  })),
);

export function transportersReducer(state: TransportersState | undefined, action: any) {
  return _transportersReducer(state, action);
}
