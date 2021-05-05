import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface FractionsReportPreviewTableState {
  pagination: CommonPaginationState;
}

export function createInitialState(): FractionsReportPreviewTableState {
  return <FractionsReportPreviewTableState>{
    pagination: {
      sort: 'Name',
      isSortDsc: false,
    },
  };
}

const fractionsReportPreviewTablePersistStorage = persistState({
  include: ['fractionsReportPreviewTable'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'fractionsReportPreviewTable',
  resettable: true,
})
export class FractionsReportPreviewTableStore extends Store<FractionsReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}

export const fractionsReportPreviewTablePersistProvider = {
  provide: 'persistStorage',
  useValue: fractionsReportPreviewTablePersistStorage,
  multi: true,
};
