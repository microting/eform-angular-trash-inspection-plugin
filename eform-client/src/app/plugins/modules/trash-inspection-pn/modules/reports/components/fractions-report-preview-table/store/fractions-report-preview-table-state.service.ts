import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged, SortModel } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import {
  FractionsReportPreviewTableQuery,
  FractionsReportPreviewTableStore,
} from './';
import { TrashInspectionPnFractionsService } from '../../../../../services';
import { FractionPnStatsByYearModel } from '../../../../../models';

@Injectable({ providedIn: 'root' })
export class FractionsReportPreviewTableStateService {
  constructor(
    private store: FractionsReportPreviewTableStore,
    private service: TrashInspectionPnFractionsService,
    private query: FractionsReportPreviewTableQuery
  ) {}

  private year = new Date().getFullYear();

  getAllFractionsStatsByYear(): Observable<
    OperationDataResult<Paged<FractionPnStatsByYearModel>>
  > {
    return this.service.getAllFractionsStatsByYear({
      ...this.query.pageSetting.pagination,
      year: this.year,
    });
  }

  updateYear(year: number) {
    this.year = year;
  }

  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
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
