// pagination
import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {producersUpdatePagination} from './producers.actions';

export interface ProducersState {
  pagination: CommonPaginationState;
  total: number;
}

export const producersInitialState: ProducersState = {
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

export const _producersReducer = createReducer(
  producersInitialState,
  on(producersUpdatePagination, (state, {payload}) => ({
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

export function producersReducer(state: ProducersState | undefined, action: any) {
  return _producersReducer(state, action);
}
