import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface FractionsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  offset: number;
}

export function createInitialState(): FractionsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnFractions' })
export class FractionsStore extends Store<FractionsState> {
  constructor() {
    super(createInitialState());
  }
}
