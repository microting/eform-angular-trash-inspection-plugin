import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface FractionsState {
  pagination: CommonPaginationState;
  total: number;
}

export function createInitialState(): FractionsState {
  return <FractionsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const fractionsPersistStorage = persistState({
  include: ['fractions'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      // filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fractions', resettable: true })
export class FractionsStore extends Store<FractionsState> {
  constructor() {
    super(createInitialState());
  }
}

export const fractionsPersistProvider = {
  provide: 'persistStorage',
  useValue: fractionsPersistStorage,
  multi: true,
};
