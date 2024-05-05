import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  PaginationModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { TrashInspectionPnProducersService } from '../../../../services';
import { ProducersPnModel } from '../../../../models';
import {Store} from '@ngrx/store';
import {
  producersUpdatePagination,
  producersUpdateTotalProducers,
  selectProducersPagination
} from '../../../../state';

@Injectable({ providedIn: 'root' })
export class ProducersStateService {
  private selectProducersPagination$ = this.store.select(selectProducersPagination);
  currentPagination: CommonPaginationState;
  constructor(
    private store: Store,
    private service: TrashInspectionPnProducersService,
  ) {
    this.selectProducersPagination$.subscribe(x => this.currentPagination = x);
  }

  getAllProducers(): Observable<OperationDataResult<ProducersPnModel>> {
    return this.service
      .getAllProducers({
        ...this.currentPagination,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(
              producersUpdateTotalProducers(response.model.total)
            )
          }
          return response;
        })
      );
  }

  // updatePageSize(pageSize: number) {
  //   this.store.update((state) => ({
  //     pagination: {
  //       ...state.pagination,
  //       pageSize: pageSize,
  //     },
  //   }));
  //   this.checkOffset();
  // }
  //
  // updateNameFilter(nameFilter: string) {
  //   this.store.update((state) => ({
  //     filters: {
  //       ...state.filters,
  //       pageSize: nameFilter,
  //     },
  //   }));
  // }
  //
  // getPageSize(): Observable<number> {
  //   return this.query.selectPageSize$;
  // }
  //
  // getNameFilter(): Observable<string> {
  //   return this.query.selectNameFilter$;
  // }

/*  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
  }*/

  // getActiveSort(): Observable<string> {
  //   return this.query.selectActiveSort$;
  // }
  //
  // getActiveSortDirection(): Observable<'asc' | 'desc'> {
  //   return this.query.selectActiveSortDirection$;
  // }
  //
  // changePage(offset: number) {
  //   this.store.update((state) => ({
  //     pagination: {
  //       ...state.pagination,
  //       offset: offset,
  //     },
  //   }));
  // }
  //

  onDelete() {
    if (this.currentPagination.offset !== 0) {
      this.store.dispatch(
        producersUpdatePagination({
          pagination: {
            ...this.currentPagination,
            offset: this.currentPagination.offset - 1,
          }
        }));
    }
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(
      producersUpdatePagination({
        pagination: {
          ...this.currentPagination,
          sort: localPageSettings.sort,
          isSortDsc: localPageSettings.isSortDsc,
        }
      }));
    // this.store.update((state) => ({
    //   pagination: {
    //     ...state.pagination,
    //     isSortDsc: localPageSettings.isSortDsc,
    //     sort: localPageSettings.sort,
    //   },
    // }));
  }

  // checkOffset() {
  //   const newOffset = getOffset(
  //     this.query.pageSetting.pagination.pageSize,
  //     this.query.pageSetting.pagination.offset,
  //     this.query.pageSetting.total
  //   );
  //   if (newOffset !== this.query.pageSetting.pagination.offset) {
  //     this.store.update((state) => ({
  //       pagination: {
  //         ...state.pagination,
  //         offset: newOffset,
  //       },
  //     }));
  //   }
  // }
  //
  // getPagination(): Observable<PaginationModel> {
  //   return this.query.selectPagination$;
  // }
  //
  // updatePagination(pagination: PaginationModel) {
  //   this.store.update((state) => ({
  //     pagination: {
  //       ...state.pagination,
  //       pageSize: pagination.pageSize,
  //       offset: pagination.offset,
  //     },
  //   }));
  //   // this.checkOffset();
  // }
}
