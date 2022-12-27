import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  TransportersReportPreviewTableState,
  TransportersReportPreviewTableStore,
} from './';
import { SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class TransportersReportPreviewTableQuery extends Query<TransportersReportPreviewTableState> {
  constructor(protected store: TransportersReportPreviewTableStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );
}
