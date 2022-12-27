import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  ProducersReportPreviewTableState,
  ProducersReportPreviewTableStore,
} from './';
import { SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class ProducersReportPreviewTableQuery extends Query<ProducersReportPreviewTableState> {
  constructor(protected store: ProducersReportPreviewTableStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );
}
