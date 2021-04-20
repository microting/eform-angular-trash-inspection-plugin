import { Injectable } from '@angular/core';
import { TransportersReportPreviewTableStore } from './transporters-report-preview-table-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { TransportersReportPreviewTableQuery } from './transporters-report-preview-table-query';
import { TrashInspectionPnTransporterService } from '../../../../services';
import { FractionPnStatsByYearModel } from '../../../../models';

@Injectable({ providedIn: 'root' })
export class TransportersReportPreviewTableStateService {
  constructor(
    private store: TransportersReportPreviewTableStore,
    private service: TrashInspectionPnTransporterService,
    private query: TransportersReportPreviewTableQuery
  ) {}

  private year = new Date().getFullYear();

  getAllTransportersByYear(): Observable<
    OperationDataResult<Paged<FractionPnStatsByYearModel>>
  > {
    return this.service.getAllTransportersByYear({
      isSortDsc: this.query.pageSetting.isSortDsc,
      sort: this.query.pageSetting.sort,
      year: this.year,
    });
  }

  updateYear(year: number) {
    this.year = year;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.sort,
      this.query.pageSetting.isSortDsc
    );
    this.store.update({
      isSortDsc: localPageSettings.isSortDsc,
      sort: localPageSettings.sort,
    });
  }
}
