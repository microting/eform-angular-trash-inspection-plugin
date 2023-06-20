import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  PaginationModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { TransportersQuery, TransportersStore } from './';
import { TrashInspectionPnTransporterService } from '../../../../services';
import { TransportersPnModel } from '../../../../models';

@Injectable({ providedIn: 'root' })
export class TransportersStateService {
  constructor(
    private store: TransportersStore,
    private service: TrashInspectionPnTransporterService,
    private query: TransportersQuery
  ) {}

  getAllTransporters(): Observable<OperationDataResult<TransportersPnModel>> {
    return this.service
      .getAllTransporters({
        ...this.query.pageSetting.pagination,
        ...this.query.pageSetting.filters,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.update(() => ({
              total: response.model.total,
            }));
          }
          return response;
        })
      );
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
    this.checkOffset();
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        nameFilter: nameFilter,
      },
    }));
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  /*  getSort(): Observable<SortModel> {
      return this.query.selectSort$;
    }*/

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
  }

  changePage(offset: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        offset: offset,
      },
    }));
  }

  onDelete() {
    this.store.update((state) => ({
      total: state.total - 1,
    }));
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSettings.isSortDsc,
        sort: localPageSettings.sort,
      },
    }));
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.query.pageSetting.total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: {
          ...state.pagination,
          offset: newOffset,
        },
      }));
    }
  }

  getPagination(): Observable<PaginationModel> {
    return this.query.selectPagination$;
  }

  updatePagination(pagination: PaginationModel) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pagination.pageSize,
        offset: pagination.offset,
      },
    }));
    // this.checkOffset();
  }
}
