import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface TransportersReportPreviewTableState {
  sort: string;
  isSortDsc: boolean;
}

export function createInitialState(): TransportersReportPreviewTableState {
  return {
    sort: 'Name',
    isSortDsc: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionsTransportersReportPreviewTable' })
export class TransportersReportPreviewTableStore extends Store<TransportersReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}
