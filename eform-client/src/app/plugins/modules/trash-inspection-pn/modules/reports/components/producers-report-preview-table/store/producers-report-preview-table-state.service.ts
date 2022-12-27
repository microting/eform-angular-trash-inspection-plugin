import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged, SortModel } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import {
  ProducersReportPreviewTableQuery,
  ProducersReportPreviewTableStore,
} from './';
import { TrashInspectionPnProducersService } from '../../../../../services';
import { ProducerPnStatsByYearModel } from '../../../../../models';

@Injectable({ providedIn: 'root' })
export class ProducersReportPreviewTableStateService {
  constructor(
    private store: ProducersReportPreviewTableStore,
    private service: TrashInspectionPnProducersService,
    private query: ProducersReportPreviewTableQuery
  ) {}

  private year = new Date().getFullYear();

  getAllProducersStatsByYear(): Observable<
    OperationDataResult<Paged<ProducerPnStatsByYearModel>>
  > {
    return this.service.getAllProducersStatsByYear({
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
