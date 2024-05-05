import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {segmentsUpdatePagination} from './segments.actions';

export interface SegmentsState {
  pagination: CommonPaginationState;
  total: number;
}

export const segmentsInitialState: SegmentsState = {
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

export const _segmentsReducer = createReducer(
  segmentsInitialState,
  on(segmentsUpdatePagination, (state, {payload}) => ({
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

export function segmentsReducer(state: SegmentsState | undefined, action: any) {
  return _segmentsReducer(state, action);
}
