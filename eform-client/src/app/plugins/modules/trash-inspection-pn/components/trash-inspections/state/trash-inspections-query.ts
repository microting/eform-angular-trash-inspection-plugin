import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  TrashInspectionsState,
  TrashInspectionsStore,
} from './trash-inspections-store';

@Injectable({ providedIn: 'root' })
export class TrashInspectionsQuery extends Query<TrashInspectionsState> {
  constructor(protected store: TrashInspectionsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select('pageSize');
  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
}
