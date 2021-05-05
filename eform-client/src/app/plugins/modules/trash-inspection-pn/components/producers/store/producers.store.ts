import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface ProducersState {
  pagination: CommonPaginationState;
  total: number;
}

export function createInitialState(): ProducersState {
  return <ProducersState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const producersPersistStorage = persistState({
  include: ['producers'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      // filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'producers', resettable: true })
export class ProducersStore extends Store<ProducersState> {
  constructor() {
    super(createInitialState());
  }
}

export const producersPersistProvider = {
  provide: 'persistStorage',
  useValue: producersPersistStorage,
  multi: true,
};
