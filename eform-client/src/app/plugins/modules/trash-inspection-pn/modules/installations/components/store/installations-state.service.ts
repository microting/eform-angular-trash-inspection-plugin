import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  PaginationModel,
  SortModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { InstallationsPnModel } from '../../../../models';
import { TrashInspectionPnInstallationsService } from '../../../../services';
import {Store} from '@ngrx/store';
import {
  installationsUpdatePagination,
  installationsUpdateTotalInstallations,
  selectInstallationsPagination
} from '../../../../state';

@Injectable({ providedIn: 'root' })
export class InstallationsStateService {
  private selectInstallationsPagination$ = this.store.select(selectInstallationsPagination);
  currentPagination: CommonPaginationState;
  constructor(
    private store: Store,
    private service: TrashInspectionPnInstallationsService,
  ) {
    this.selectInstallationsPagination$.subscribe(x => this.currentPagination = x);
  }

  getAllInstallations(): Observable<OperationDataResult<InstallationsPnModel>> {
    return this.service
      .getAllInstallations({
        ...this.currentPagination,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(
              installationsUpdateTotalInstallations(response.model.total)
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

  onDelete() {
    if (this.currentPagination.offset !== 0) {
      this.store.dispatch(
        installationsUpdatePagination({
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
      installationsUpdatePagination({
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
  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(
        installationsUpdatePagination({
          pagination: {
            ...this.currentPagination,
            offset: pagination.offset,
            pageSize: pagination.pageSize,
          }
        }));
  }
}
