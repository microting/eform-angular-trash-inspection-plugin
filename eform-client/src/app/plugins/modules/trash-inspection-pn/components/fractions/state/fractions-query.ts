import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { FractionsState, FractionsStore } from './fractions-store';

@Injectable({ providedIn: 'root' })
export class FractionsQuery extends Query<FractionsState> {
  constructor(protected store: FractionsStore) {
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
