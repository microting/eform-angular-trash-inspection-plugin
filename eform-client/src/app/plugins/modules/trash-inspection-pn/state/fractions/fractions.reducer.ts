import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {fractionsUpdatePagination} from './fractions.actions';

export interface FractionsState {
  pagination: CommonPaginationState;
  total: number;
}

export const fractionsInitialState: FractionsState = {
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

export const _fractionsReducer = createReducer(
  fractionsInitialState,
  on(fractionsUpdatePagination, (state, {payload}) => ({
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

export function fractionsReducer(state: FractionsState | undefined, action: any) {
  return _fractionsReducer(state, action);
}
