import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OperationDataResult, Paged} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {
  TransportersReportPreviewTableQuery,
  TransportersReportPreviewTableStore,
} from './';
import {TrashInspectionPnTransporterService} from '../../../../../services';
import {FractionPnStatsByYearModel} from '../../../../../models';

@Injectable({providedIn: 'root'})
export class TransportersReportPreviewTableStateService {
  constructor(
    private store: TransportersReportPreviewTableStore,
    private service: TrashInspectionPnTransporterService,
    private query: TransportersReportPreviewTableQuery
  ) {
  }

  private year = new Date().getFullYear();

  getAllTransportersByYear(): Observable<
    OperationDataResult<Paged<FractionPnStatsByYearModel>>
  > {
    return this.service.getAllTransportersByYear({
      ...this.query.pageSetting.pagination,
      year: this.year,
    });
  }

  updateYear(year: number) {
    this.year = year;
  }

  // getSort(): Observable<SortModel> {
  //   return this.query.selectSort$;
  // }

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
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
}
