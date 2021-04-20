import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { InstallationsState, InstallationsStore } from './installations-store';

@Injectable({ providedIn: 'root' })
export class InstallationsQuery extends Query<InstallationsState> {
  constructor(protected store: InstallationsStore) {
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
