import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface SegmentsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  offset: number;
}

export function createInitialState(): SegmentsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnSegments' })
export class SegmentsStore extends Store<SegmentsState> {
  constructor() {
    super(createInitialState());
  }
}
