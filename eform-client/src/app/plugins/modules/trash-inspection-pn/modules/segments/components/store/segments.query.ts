import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SegmentsState, SegmentsStore } from './';
import { PaginationModel, SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class SegmentsQuery extends Query<SegmentsState> {
  constructor(protected store: SegmentsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectPagination$ = this.select(
    (state) =>
      new PaginationModel(
        state.total,
        state.pagination.pageSize,
        state.pagination.offset
      )
  );
  selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );
}
