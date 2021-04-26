import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface TrashInspectionsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): TrashInspectionsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspections' })
export class TrashInspectionsStore extends Store<TrashInspectionsState> {
  constructor() {
    super(createInitialState());
  }
}
