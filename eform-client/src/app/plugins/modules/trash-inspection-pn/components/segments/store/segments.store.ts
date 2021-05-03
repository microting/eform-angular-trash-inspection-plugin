import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface SegmentsState {
  pagination: CommonPaginationState;
  total: number;
}

export function createInitialState(): SegmentsState {
  return <SegmentsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const segmentsPersistStorage = persistState({
  include: ['segments'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      // filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'segments', resettable: true })
export class SegmentsStore extends Store<SegmentsState> {
  constructor() {
    super(createInitialState());
  }
}

export const segmentsPersistProvider = {
  provide: 'persistStorage',
  useValue: segmentsPersistStorage,
  multi: true,
};
