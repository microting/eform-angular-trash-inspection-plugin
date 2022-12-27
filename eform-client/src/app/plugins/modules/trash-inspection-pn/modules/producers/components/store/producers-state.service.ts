import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  PaginationModel,
  SortModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { ProducersQuery, ProducersStore } from './';
import { TrashInspectionPnProducersService } from '../../../../services';
import { ProducersPnModel } from '../../../../models';

@Injectable({ providedIn: 'root' })
export class ProducersStateService {
  constructor(
    private store: ProducersStore,
    private service: TrashInspectionPnProducersService,
    private query: ProducersQuery
  ) {}

  getAllProducers(): Observable<OperationDataResult<ProducersPnModel>> {
    return this.service
      .getAllProducers({
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
        pageSize: nameFilter,
      },
    }));
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
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
}
