import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {installationsUpdatePagination, installationsUpdateTotalInstallations} from './installations.actions';

export interface InstallationsState {
  pagination: CommonPaginationState;
  total: number;
}

export const installationsInitialState: InstallationsState = {
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

export const _installationsReducer = createReducer(
  installationsInitialState,
  on(installationsUpdatePagination, (state, {payload}) => ({
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
  on(installationsUpdateTotalInstallations, (state, {payload}) => ({
    ...state,
    total: payload,
    pagination: {
      ...state.pagination,
      total: payload,
    },
  })
  )
);

export function installationsReducer(state: InstallationsState | undefined, action: any) {
  return _installationsReducer(state, action);
}
