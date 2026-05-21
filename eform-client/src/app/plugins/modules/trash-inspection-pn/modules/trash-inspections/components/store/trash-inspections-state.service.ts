import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {updateTableSort, getOffset} from 'src/app/common/helpers';
import {map} from 'rxjs/operators';
import {TrashInspectionPnTrashInspectionsService} from '../../../../services';
import {TrashInspectionPnModel} from '../../../../models';
import {Store} from '@ngrx/store';
import {
  selectTrashInspectionsFilters,
  selectTrashInspectionsPagination,
  trashInspectionUpdateFilters,
  trashInspectionUpdatePagination,
  trashInspectionUpdateTotalTrashInspections
} from '../../../../state';

@Injectable({providedIn: 'root'})
export class TrashInspectionsStateService {
  private selectTrashInspectionsFilters$ = this.store.select(selectTrashInspectionsFilters);
  private selectTrashInspectionsPagination$ = this.store.select(selectTrashInspectionsPagination);
  currentPagination: CommonPaginationState;
  currentFilters: any;
  constructor(
    private store: Store,
    private service: TrashInspectionPnTrashInspectionsService,
  ) {
    this.selectTrashInspectionsPagination$.subscribe(x => this.currentPagination = x);
    this.selectTrashInspectionsFilters$.subscribe(x => this.currentFilters = x);
  }

  getAllTrashInspections(): Observable<
    OperationDataResult<Paged<TrashInspectionPnModel>>
  > {
    return this.service
      .getAllTrashInspections({
        ...this.currentPagination,
        ...this.currentFilters,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(
              trashInspectionUpdateTotalTrashInspections(response.model.total)
            )
          }
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(trashInspectionUpdateFilters({nameFilter: nameFilter}));
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

  // getSort(): Observable<SortModel> {
  //   return this.query.selectSort$;
  // }

  // getActiveSort(): Observable<string> {
  //   return this.query.selectActiveSort$;
  // }
  //
  // getActiveSortDirection(): Observable<'asc' | 'desc'> {
  //   return this.query.selectActiveSortDirection$;
  // }
  //
  // getNameFilter(): Observable<string> {
  //   return this.query.selectNameFilter$;
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
        trashInspectionUpdatePagination({
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
      trashInspectionUpdatePagination({
        pagination: {
          ...this.currentPagination,
          sort: localPageSettings.sort,
          isSortDsc: localPageSettings.isSortDsc,
        }
      }));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(
      trashInspectionUpdatePagination({
        pagination: {
          ...this.currentPagination,
          pageSize: pagination.pageSize,
          offset: pagination.offset,
        }
      }));
  }
}
