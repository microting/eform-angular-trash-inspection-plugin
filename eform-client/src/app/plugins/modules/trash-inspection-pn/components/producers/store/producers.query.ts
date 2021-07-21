import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ProducersState, ProducersStore } from './';
import { PaginationModel, SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class ProducersQuery extends Query<ProducersState> {
  constructor(protected store: ProducersStore) {
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

  selectNameFilter$ = this.select((state) => state.filters.nameFilter);
}
