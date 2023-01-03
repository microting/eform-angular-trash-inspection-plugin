import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  FractionsReportPreviewTableState,
  FractionsReportPreviewTableStore,
} from './';
import { SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class FractionsReportPreviewTableQuery extends Query<FractionsReportPreviewTableState> {
  constructor(protected store: FractionsReportPreviewTableStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  // selectSort$ = this.select(
  //   (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  // );
  selectActiveSort$ = this.select((state) => state.pagination.sort);
  selectActiveSortDirection$ = this.select((state) => state.pagination.isSortDsc ? 'desc' : 'asc');
}
