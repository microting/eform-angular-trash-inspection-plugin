import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface FractionsReportPreviewTableState {
  sort: string;
  isSortDsc: boolean;
}

export function createInitialState(): FractionsReportPreviewTableState {
  return {
    sort: 'Name',
    isSortDsc: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionsFractionsReportPreviewTable' })
export class FractionsReportPreviewTableStore extends Store<FractionsReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}
