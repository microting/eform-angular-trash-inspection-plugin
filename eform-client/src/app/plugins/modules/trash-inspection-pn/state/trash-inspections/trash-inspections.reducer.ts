import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  trashInspectionUpdateFilters, trashInspectionUpdatePagination,
  trashInspectionUpdateTotalTrashInspections
} from './trash-inspections.actions';

export interface TrashInspectionFiltrationModel {
  nameFilter: string;
}

export interface TrashInspectionsState {
  pagination: CommonPaginationState;
  filters: TrashInspectionFiltrationModel;
  total: number;
}

export const trashInspectionsInitialState: TrashInspectionsState = {
  pagination: {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
    pageIndex: 0,
    total: 0,
  },
  filters: {
    nameFilter: '',
  },
  total: 0,
};

export const _trashInspectionsReducer = createReducer(
  trashInspectionsInitialState,
  on(trashInspectionUpdateFilters, (state, {payload}) => ({
    ...state,
    filters: {
      ...state.filters,
      ...payload,
    },
  })),
  on(trashInspectionUpdatePagination, (state, {payload}) => ({
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
  on(trashInspectionUpdateTotalTrashInspections, (state, {payload}) => ({
      ...state,
      pagination: {
        ...state.pagination,
        total: payload,
      },
      total: payload,
    }
  )),
);

export function trashInspectionsReducer(state: TrashInspectionsState | undefined, action: any) {
  return _trashInspectionsReducer(state, action);
}
