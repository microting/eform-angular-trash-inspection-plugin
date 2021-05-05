import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface TransportersState {
  pagination: CommonPaginationState;
  total: number;
}

export function createInitialState(): TransportersState {
  return <TransportersState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const transportersPersistStorage = persistState({
  include: ['transporters'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      // filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'transporters', resettable: true })
export class TransportersStore extends Store<TransportersState> {
  constructor() {
    super(createInitialState());
  }
}

export const transportersPersistProvider = {
  provide: 'persistStorage',
  useValue: transportersPersistStorage,
  multi: true,
};
