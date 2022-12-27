import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface ProducersReportPreviewTableState {
  pagination: CommonPaginationState;
}

export function createInitialState(): ProducersReportPreviewTableState {
  return <ProducersReportPreviewTableState>{
    pagination: {
      sort: 'Name',
      isSortDsc: false,
    },
  };
}

const producersReportPreviewTablePersistStorage = persistState({
  include: ['producersReportPreviewTable'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'producersReportPreviewTable',
  resettable: true,
})
export class ProducersReportPreviewTableStore extends Store<ProducersReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}

export const producersReportPreviewTablePersistProvider = {
  provide: 'persistStorage',
  useValue: producersReportPreviewTablePersistStorage,
  multi: true,
};
