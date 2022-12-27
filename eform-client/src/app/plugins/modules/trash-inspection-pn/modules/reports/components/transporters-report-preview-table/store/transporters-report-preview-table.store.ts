import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface TransportersReportPreviewTableState {
  pagination: CommonPaginationState;
}

export function createInitialState(): TransportersReportPreviewTableState {
  return <TransportersReportPreviewTableState>{
    pagination: {
      sort: 'Name',
      isSortDsc: false,
    },
  };
}

const transportersReportPreviewTablePersistStorage = persistState({
  include: ['transportersReportPreviewTable'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'transportersReportPreviewTable',
  resettable: true,
})
export class TransportersReportPreviewTableStore extends Store<TransportersReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}

export const transportersReportPreviewTablePersistProvider = {
  provide: 'persistStorage',
  useValue: transportersReportPreviewTablePersistStorage,
  multi: true,
};
