import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SegmentsState, SegmentsStore } from './segments-store';

@Injectable({ providedIn: 'root' })
export class SegmentsQuery extends Query<SegmentsState> {
  constructor(protected store: SegmentsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select('pageSize');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
}
