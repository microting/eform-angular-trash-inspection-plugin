import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ProducersReportPreviewTableState {
  sort: string;
  isSortDsc: boolean;
}

export function createInitialState(): ProducersReportPreviewTableState {
  return {
    sort: 'Name',
    isSortDsc: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionsProducersReportPreviewTable' })
export class ProducersReportPreviewTableStore extends Store<ProducersReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}
