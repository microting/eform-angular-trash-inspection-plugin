import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  PaginationModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { TrashInspectionPnTransporterService } from '../../../../services';
import { TransportersPnModel } from '../../../../models';
import {Store} from '@ngrx/store';
import {
  selectTransportersPagination, transportersUpdatePagination,
  transportersUpdateTotalTransporters
} from '../../../../state';

@Injectable({ providedIn: 'root' })
export class TransportersStateService {
  private selectTransportersPagination$ = this.store.select(selectTransportersPagination);
  currentPagination: CommonPaginationState;
  constructor(
    private store: Store,
    private service: TrashInspectionPnTransporterService,
  ) {
    this.selectTransportersPagination$.subscribe(x => this.currentPagination = x);
  }

  getAllTransporters(): Observable<OperationDataResult<TransportersPnModel>> {
    return this.service
      .getAllTransporters({
        ...this.currentPagination,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(
              transportersUpdateTotalTransporters(response.model.total)
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
  //       nameFilter: nameFilter,
  //     },
  //   }));
  // }
  //
  // getNameFilter(): Observable<string> {
  //   return this.query.selectNameFilter$;
  // }
  //
  // getPageSize(): Observable<number> {
  //   return this.query.selectPageSize$;
  // }
  //
  // /*  getSort(): Observable<SortModel> {
  //     return this.query.selectSort$;
  //   }*/
  //
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
  // onDelete() {
  //   this.store.update((state) => ({
  //     total: state.total - 1,
  //   }));
  //   this.checkOffset();
  // }

  onDelete() {
    if (this.currentPagination.offset !== 0) {
      this.store.dispatch(
        transportersUpdatePagination({
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
      transportersUpdatePagination({
        pagination: {
          ...this.currentPagination,
          sort: localPageSettings.sort,
          isSortDsc: localPageSettings.isSortDsc,
        }
      }));
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
