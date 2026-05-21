import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {segmentsUpdatePagination, segmentsUpdateTotalSegments} from './segments.actions';

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
  on(segmentsUpdateTotalSegments, (state, {payload}) => ({
    ...state,
    pagination: {
      ...state.pagination,
      total: payload,
    },
    total: payload,
  })),
);

export function segmentsReducer(state: SegmentsState | undefined, action: any) {
  return _segmentsReducer(state, action);
}
